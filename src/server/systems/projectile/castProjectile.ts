import { Janitor } from "@rbxts/janitor";
import { World } from "@rbxts/jecs";
import { Tracer } from "@rbxts/tracer";
import { addComponent, checkEntity, getEntity } from "shared/utils/functions/jecsHelpFunctions";
import { rayParamsFilter } from "shared/utils/functions/rayFunctions";
import { CreateVisualizer } from "shared/utils/functions/vector3Functions";
import { CastProjectile, systemQueue } from "shared/utils/jecs/components";

const projectileTrash = new Janitor();
const projectileVisualizer = projectileTrash.Add(new CreateVisualizer().SetColor(Color3.fromRGB(255, 255, 255)));
const projectileVisualizerSize = 3;

export default (world: World) => {
	const deltaTime = systemQueue.getDeltaTime();

	for (const [projectileEntity, projectileComp] of world.query(CastProjectile)) {
		const { origin, direction, radius, speed, maxDistance, include, visualize, hit } = projectileComp;
		const goal = origin.add(direction.mul(maxDistance));
		const distanceTravelled = math.min(speed * deltaTime, maxDistance);

		const hitResult = (radius ? Tracer.sphere(radius, origin, goal) : Tracer.ray(origin, goal))
			.useRaycastParams(rayParamsFilter(include, Enum.RaycastFilterType.Include))
			.run();
		const hitEntity = hitResult.hit && getEntity.fromInstance(hitResult.hit);
		const reached =
			distanceTravelled === 0 ||
			// checking if the model that the projectile hits
			// Is either a planet or spaceship
			(hitEntity && (checkEntity.isPlanet(hitEntity) || checkEntity.isSpaceship(hitEntity)));

		if (visualize) projectileVisualizer.MoveTo(origin, direction, projectileVisualizerSize);

		if (reached) {
			// calls the hit function
			if (hitEntity) hit(hitEntity);

			// delete the projectile entity
			world.delete(projectileEntity);
		} else {
			const newOrigin = hitResult.position;
			const newDistance = math.max(0, maxDistance - distanceTravelled);

			addComponent(projectileEntity, CastProjectile, {
				...projectileComp,
				origin: newOrigin,
				maxDistance: newDistance,
			});
		}
	}
};
