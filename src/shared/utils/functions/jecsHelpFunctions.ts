import { Entity, pair, Pair } from "@rbxts/jecs";
import Object, { deepCopy } from "@rbxts/object-utils";
import { RunService, Workspace } from "@rbxts/services";
import { PlayerData } from "shared/data/defaultData";
import { SpaceshipData } from "shared/data/spaceshipData";
import paths from "shared/paths";
import * as c from "shared/utils/jecs/components";
import {
	world,
	UpdateData,
	Planet,
	CastProjectile,
	Cooldown,
	HealthBar,
	DestroyAfterCounting,
	componentsToReplicate,
	Spaceship,
	ReplicatedComponent,
	FollowInstance,
	ModelDebugger,
	TargetEntity,
	Occupant,
	Player,
	SpawnPoint,
	TargetReplication,
} from "shared/utils/jecs/components";

export type ComponentValue<C> = C extends Entity<infer T> ? T : C extends Pair<infer _, infer O> ? O : never;
export type ComponentDataFromEntity<E> = E extends Entity<infer T> ? T : never;
export type AllComponentNames = {
	[K in keyof typeof c]: (typeof c)[K] extends Entity<unknown> ? K : never;
}[keyof typeof c];

export type MappedComponents = { [K in AllComponentNames]: (typeof c)[K] };
export const MappedComponents: MappedComponents = c as MappedComponents;
export const MappedComponentsSwitched = Object.entries(MappedComponents)
	.map(([k, v]) => [v, k] as const)
	.reduce(
		(acc, [k, v]) => {
			acc[k] = v;
			return acc;
		},
		{} as Record<string, string>,
	) as ReturnType<<CompName extends AllComponentNames>() => { [K in MappedComponents[CompName]]: CompName }>;

export const checkEntity = {
	isPlanet: (planetEntity: Entity) => world.query(pair(planetEntity, Planet)).iter()()[0] !== undefined,
	isSpaceship: (spaceshipEntity: Entity) => world.query(pair(spaceshipEntity, Spaceship)).iter()()[0] !== undefined
}

	export const getEntity = {
	replicatedFromServerEntity: (serverEntity: Entity) => world.query(pair(serverEntity, ReplicatedComponent)).iter()()[0],

	fromInstance: (instance: Instance) => {
		const entity = <Entity>instance.GetAttribute("ServerId");

		// if entity exists then return it
		return entity !== undefined && world.contains(entity as Entity) ? entity : undefined;
	},

	fromHealth: (bodyEntity: Entity) => {
		const healthComp = world.get(bodyEntity, HealthBar);
		return world.contains(bodyEntity) ? healthComp : { current: 100, max: 100}
	},

	getSpaceship: (serverEntity: Entity) => world.query(pair(TargetEntity, serverEntity)).with(Spaceship).iter()()[0]
};

export const setEntity = {
	

	claimSpaceshipSpawn: (
		spaceshipEntity: Entity,
		spawnEntity: Entity,
		{ spaceshipModel }: ComponentDataFromEntity<typeof Spaceship>,
		{ point }: ComponentDataFromEntity<typeof SpawnPoint>,
	) => {
		spaceshipModel.PivotTo(new CFrame(point));
		spaceshipModel.Parent = Workspace;

		// setting spaceship relationship
		addComponent(spawnEntity, pair(TargetEntity, Spaceship), spaceshipEntity);
		addComponent(spaceshipEntity, pair(TargetEntity, SpawnPoint), spawnEntity);
	},

	addTargetForReplication: (
		targetEntity: Entity,
		player: Player | Player[],
		component: (typeof componentsToReplicate)[keyof typeof componentsToReplicate],
	) => {
		const targetReplication = world.get(targetEntity, TargetReplication) || { [component]: [] };
		const oldTargets = targetReplication[component] || [];

		// adds the targets to the table
		if (typeIs(player, "Instance")) {
			oldTargets.push(player);
		} else {
			player.forEach((player) => oldTargets.push(player));
		}

		// remove any duplicates
		oldTargets.filter((v, i, a) => a.indexOf(v) === i);

		// sets tje targets in thje target replication
		world.set(targetEntity, TargetReplication, { ...targetReplication, [component]: oldTargets });
	},

	followInstance: (
		playerEntity: Entity,
		instanceToFollow: BasePart,
		{
			offset = new Vector3(0, 0, 0),
			rotation = new CFrame(0, 0, 0),
			smoothness = 2.5,
		}: Partial<Omit<ComponentDataFromEntity<typeof FollowInstance>, "instanceToFollow">>,
	) => {
		const player = world.get(playerEntity, Player);

		const followEntity = world.entity();
		if (player) {
			setEntity.addTargetForReplication(playerEntity, player, FollowInstance);
			addComponent(followEntity, FollowInstance, { instanceToFollow, offset, rotation, smoothness });
		}
		return followEntity;
	},
};

export const createEntity = {
	replicated: (serverEntity: Entity) => {
		const replicatedEntity = world.entity();

		// adds relationship
		world.set(replicatedEntity, pair(serverEntity, ReplicatedComponent), serverEntity);
		world.set(replicatedEntity, ReplicatedComponent, serverEntity);

		// returns it
		return replicatedEntity;
	},

	updateData: (bodyEntity: Entity, updateFunction: (oldData: PlayerData) => PlayerData) => {
		const updateEntity = world.entity();
		world.set(updateEntity, UpdateData, { bodyEntity, updateFunction });
		return updateEntity;
	},

	createProjectile: (
		{
			origin,
			direction,
			speed = 10,
			maxDistance = 35,
			visualize,
			include = [],
		}: Omit<ComponentDataFromEntity<typeof CastProjectile>, "hit">,
		projectileFunction: (hitEntity: Entity) => void,
	) => {
		const projectileEntity = world.entity();
		world.set(projectileEntity, CastProjectile, {
			origin,
			direction,
			visualize,
			speed,
			maxDistance,
			include,
			hit: projectileFunction,
		});
		const timeToComplete = maxDistance / speed;
		addComponent(projectileEntity, Cooldown, timeToComplete);
		addComponent(projectileEntity, DestroyAfterCounting);
		return projectileEntity;
	},

	createSpaceship: (playerOccupantEntity: Entity, spaceship: SpaceshipData) => {
		const player = world.get(playerOccupantEntity, Player)
		const spaceshipModel = paths.Assets.Spaceships[spaceship.Name as "Default"].Clone();
		const spaceshipEntity = world.entity();

		addComponent(playerOccupantEntity, pair(Occupant, Spaceship), spaceshipEntity);
		addComponent(spaceshipEntity, pair(TargetEntity, playerOccupantEntity), playerOccupantEntity);
		addComponent(spaceshipEntity, ModelDebugger, spaceshipModel);
		addComponent(spaceshipEntity, Spaceship, { spaceshipModel, spaceshipAngle: 0 });
		return spaceshipEntity;
	},

	createPlanet: ({ X, Y }: Vector2) => {
		const planetModel = paths.Assets.Planets.Saturn.Clone();
		const planetEntity = world.entity();
		planetModel.PivotTo(new CFrame(X, 0, Y));
		planetModel.Parent = paths.Map.Planets;

		addComponent(planetEntity, ModelDebugger, planetModel);
		addComponent(planetEntity, Planet);
		planetModel.SetAttribute("ServerId", planetEntity);
		return planetEntity;
	},
};

export const jecsDefaultProps = {} satisfies {
	[componentName in AllComponentNames]?: ComponentValue<MappedComponents[componentName]>;
};
type DefaultProps = typeof jecsDefaultProps;
type DefaultPropKeys = keyof DefaultProps;

export function addComponent<P extends undefined>(entity: Entity, component: Entity<P>): void;

export function addComponent<P, O>(entity: Entity, component: Pair<P, O>, value: P): void;

export function addComponent<N extends DefaultPropKeys, D extends MappedComponents[N]>(
	entity: Entity,
	component: D,
): void;

// 2) Three-arg only for non-defaulted components
export function addComponent<N extends Exclude<AllComponentNames, DefaultPropKeys>, D extends MappedComponents[N]>(
	entity: Entity,
	component: D,
	value: ComponentValue<D>,
): void;

// 3) Three-arg override for defaulted components
export function addComponent<N extends DefaultPropKeys, D extends Entity>(
	entity: Entity,
	component: D,
	value: ComponentValue<D>,
): void;

// implementation
export function addComponent<N extends AllComponentNames, D extends MappedComponents[N]>(
	entity: Entity,
	component: D,
	value?: ComponentValue<D>,
): void {
	// Determine the component data to use
	const defaultTable = jecsDefaultProps[MappedComponentsSwitched[component] as DefaultPropKeys] as
		| ComponentValue<MappedComponents[N]>
		| undefined;
	const clonedTable = typeIs(defaultTable, "table") && deepCopy(defaultTable);
	const componentInfo = (
		value !== undefined
			? value
			: clonedTable || jecsDefaultProps[MappedComponentsSwitched[component] as DefaultPropKeys]
	) as ComponentValue<MappedComponents[N]>;

	// Add the component to the entity
	world.set(entity, component as never, componentInfo as never);
}
