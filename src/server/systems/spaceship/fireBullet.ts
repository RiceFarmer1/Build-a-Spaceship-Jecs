import { create } from "@rbxts/jabby/out/vide";
import { World } from "@rbxts/jecs";
import { routes } from "shared/network";
import { ComponentDataFromEntity, createEntity, getEntity } from "shared/utils/functions/jecsHelpFunctions";
import { HealthBar, Planet, Player, Spaceship } from "shared/utils/jecs/components";
import { useRoute } from "shared/utils/jecs/plugins/hooks/use-route";

export default (world: World) => {
	useRoute("shipShoot", (bulletParams, playerFired) => {
		const playerFiredEntity = playerFired && getEntity.fromInstance(playerFired);
		const spaceshipEntity =
			playerFiredEntity && world.contains(playerFiredEntity)
				? getEntity.getSpaceship(playerFiredEntity)
				: undefined;
		const spaceshipModel = (
			(spaceshipEntity && world.contains(spaceshipEntity)
				? world.get(spaceshipEntity, Spaceship)
				: {}) as ComponentDataFromEntity<typeof Spaceship>
		).spaceshipModel;

		if (playerFiredEntity && spaceshipEntity && spaceshipModel) {
			const fireOrigin = spaceshipModel.FindFirstChild("fireOrigin") as BasePart;
			createEntity.createProjectile(
				{
					...bulletParams,
					origin: fireOrigin.GetPivot().Position,
					include: [],
				},
				(hitEntity) => {
					const healthBar = getEntity.fromHealth(hitEntity);
					
				},
			);
		}
	});
};
