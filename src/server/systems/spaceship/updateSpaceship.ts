import { Entity, pair, Wildcard, World } from "@rbxts/jecs";
import Object from "@rbxts/object-utils";
import Sift from "@rbxts/sift";
import { equalsDeep } from "@rbxts/sift/out/Array";
import { merge } from "@rbxts/sift/out/Dictionary";
import { routes } from "shared/network";
import paths from "shared/paths";
import {
	addComponent,
	ComponentDataFromEntity,
	createEntity,
	getEntity,
	setEntity,
} from "shared/utils/functions/jecsHelpFunctions";
import {
	Added,
	Body,
	Data,
	Occupant,
	Player,
	Spaceship,
	SpawnPoint,
	systemQueue,
	TargetEntity,
	world,
} from "shared/utils/jecs/components";
import { useRoute } from "shared/utils/jecs/plugins/hooks/use-route";

const SPACESHIP_MOVE_SMOOTHNESS = 2.5;
const SPACESHIP_MOVE_SPEED = 1.25;
const SPACESHIP_CAMERA_OFFSET = new Vector3(0, 68.46, 0);

const loadSpaceships = world.query(Data).with(Body, Player).without(pair(Occupant, Spaceship)).cached();
const spawnsArchetype = world.query(SpawnPoint).without(pair(TargetEntity, Spaceship)).cached().archetypes();

const RNG = new Random();
function getSpawn(spaceshipEntity: Entity) {
	const spawns = new Map<ComponentDataFromEntity<typeof SpawnPoint>, Entity>();
	for (const { records, columns, entities } of spawnsArchetype) {
		const spawnIndex = records[SpawnPoint - 1];
		const spawnList = columns[spawnIndex - 1] as ComponentDataFromEntity<typeof SpawnPoint>[];
		spawnList.forEach((spawn) => {
			spawns.set(spawn, spawnList.findIndex((v) => equalsDeep(v, spawn)) as Entity);
		});
	}

	const randomSpawn = Object.keys(spawns)[RNG.NextInteger(0, spawns.size())];
	return [spawns.get(randomSpawn), randomSpawn] as [Entity, ComponentDataFromEntity<typeof SpawnPoint>];
}

export default (world: World) => {
	const deltaTime = systemQueue.getDeltaTime();

	// handle when the player requests spawns in the match
	useRoute("shipSpawn", (_, player) => {
		const entity = player && getEntity.fromInstance(player);
		// get the spaceship for the player
		const spaceshipEntity = entity && getEntity.getSpaceship(entity);
		const spaceshipComp = (
			spaceshipEntity && world.contains(spaceshipEntity) ? world.get(spaceshipEntity, Spaceship) : {}
		) as ComponentDataFromEntity<typeof Spaceship>;
		const spawn = entity && getSpawn(entity);
		if (entity && spawn && spaceshipEntity && spaceshipComp) {
			const [spawnEntity, spawnPointComp] = spawn;

			// spawning the spaceship at spawnpoint
			if (spawnEntity && spawnPointComp && spaceshipComp !== undefined) {
				setEntity.claimSpaceshipSpawn(spaceshipEntity, spawnEntity, spaceshipComp, spawnPointComp);
				routes.shipSpawned.sendTo(undefined, player);
			}
		}
	});

	// Switches the current ship when the player interacts with the new ship ui
	useRoute("shipSwitch", (spaceshipData, player) => {
		const entity = player && getEntity.fromInstance(player);
		const oldSpaceshipEntity = entity && world.target(entity, Occupant);
		if (entity && oldSpaceshipEntity)
			createEntity.updateData(entity, (oldData) => {
				// delete the old spaceship
				if (oldSpaceshipEntity) world.delete(oldSpaceshipEntity);
				// merge the new spaceship data with the previous
				const newSpaceshipData = merge(spaceshipData, oldData.SpaceshipData);
				createEntity.createSpaceship(entity, newSpaceshipData);
				oldData.SpaceshipData = newSpaceshipData;
				return oldData;
			});
	});

	useRoute("shipMove", (angle, player) => {
		const entity = player && getEntity.fromInstance(player);
		const spaceshipEntity = entity && getEntity.getSpaceship(entity);
		const spaceshipComp = (
			spaceshipEntity && world.contains(spaceshipEntity) ? world.get(spaceshipEntity, Spaceship) : {}
		) as ComponentDataFromEntity<typeof Spaceship>;
		const hasSpawned = spaceshipEntity && world.has(spaceshipEntity, pair(TargetEntity, SpawnPoint));
		if (entity && spaceshipEntity && spaceshipComp && hasSpawned) {
			const { spaceshipModel } = spaceshipComp;
			const direction = new Vector3(math.cos(angle), 0, math.sin(angle));
			const destination = spaceshipModel.GetPivot().Position.add(direction.mul(SPACESHIP_MOVE_SPEED));
			const newCFrame = CFrame.lookAt(destination, destination.add(direction));
			spaceshipModel.PivotTo(newCFrame);
			setEntity.followInstance(entity, spaceshipModel.PrimaryPart as BasePart, {
				offset: SPACESHIP_CAMERA_OFFSET,
				rotation: CFrame.Angles(-math.rad(0.5), 0, 0),
			});
			addComponent(spaceshipEntity, Spaceship, { spaceshipModel, spaceshipAngle: angle });
		}
	});

	// setting the spaceship to the player if they dont already have one
	for (const [entity, { SpaceshipData }] of loadSpaceships) createEntity.createSpaceship(entity, SpaceshipData);
};
