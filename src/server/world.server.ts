import { start } from "shared/utils/jecs/start";
import replication from "./systems/replication";
import updateBody from "./systems/body/updateBody";
import loadCharacter from "./systems/body/loadCharacter";
import updateSpaceship from "./systems/spaceship/updateSpaceship";
import generatePlanets from "./systems/planets/generatePlanets";
import addSpawners from "./systems/spaceship/addSpawners";
import loadData from "./systems/data/loadData";
import savePlayerData from "./systems/data/savePlayerData";
import updateData from "./systems/data/updateData";
import change from "shared/utils/jecs/systems/change";

start([
	// player
	{ system: updateBody },
	{ system: loadCharacter },
	{ system: loadData },
	{ system: savePlayerData },
	{ system: updateData },

	// spaceship
	{ system: updateSpaceship },
	{ system: addSpawners },
	{ system: updateSpaceship },

	// planets
	{ system: generatePlanets },

	// components replication
	{ system: replication },
	change
]);
