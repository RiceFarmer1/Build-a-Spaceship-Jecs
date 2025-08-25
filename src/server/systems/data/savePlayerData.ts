import { World } from "@rbxts/jecs";
import { Players } from "@rbxts/services";
import { useEvent } from "shared/utils/jecs/plugins/hooks/use-event";
import { getPlayerData } from "./extra/playerData";
import { getEntity } from "shared/utils/functions/jecsHelpFunctions";

export default (world: World) => {
	for (const [player] of useEvent(Players.PlayerRemoving)) {
		const playerData = getPlayerData(player);
		const entity = getEntity.fromInstance(player);
		if (playerData && entity) playerData.close();
	}
};
