import { World } from "@rbxts/jecs";
import { addComponent } from "shared/utils/functions/jecsHelpFunctions";
import { HealthBar, Spaceship, world } from "shared/utils/jecs/components";

const shipsWithoutHealth = world.query(Spaceship).without(HealthBar).cached();

export default (world: World) => {
	for (const [entity] of shipsWithoutHealth) addComponent(entity, HealthBar, { current: 150, max: 150 });
};
