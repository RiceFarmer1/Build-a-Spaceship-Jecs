import { spawn_app } from "@rbxts/jabby/out/jabby/client";
import { World } from "@rbxts/jecs";
import { CollectionService, Workspace } from "@rbxts/services";
import planetsConfig from "shared/data/planetsConfig";
import PlanetGenerator from "shared/libs/planetGenerator";
import paths from "shared/paths";
import { createEntity } from "shared/utils/functions/jecsHelpFunctions";
import { useThrottle } from "shared/utils/jecs/plugins/hooks/use-throttle";

const startPos = new Vector2(0, 0);
const endPos = new Vector2(2500, 2500);
const planetsCollection = paths.Map.Planets;
const spawnsCollection = paths.Map.Spawns;
const planetGenerator = new PlanetGenerator(startPos, endPos);

export default (world: World) => {
	const planets = planetsCollection.GetChildren();
	const spawns = spawnsCollection.GetChildren();

	if (useThrottle(planetsConfig.nCirclesPerFrame)) {
		const position = planetGenerator.GetPosition();
		if (planets.size() < 50 && position) {
			if (position) createEntity.createPlanet(new Vector2(position[0], position[1]));
		} else if (spawns.size() < 6 && position) {
			const spawn = paths.Assets.Spawn.Clone();
			spawn.PivotTo(new CFrame(position[0], 0, position[1]));
			spawn.Parent = spawnsCollection;
            CollectionService.AddTag(spawn, "Spawner");
		}
	}
};
