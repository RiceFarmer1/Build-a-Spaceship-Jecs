import { World } from "@rbxts/jecs";
import { Players } from "@rbxts/services";
import { useAsync } from "shared/utils/jecs/plugins/hooks/use-async";
import { useMemo } from "shared/utils/jecs/plugins/hooks/use-memo";
import { loadPlayerData, setPlayerData } from "./extra/playerData";
import { createCollection } from "@rbxts/lapis";
import defaultData, { PlayerData, playerDataValidation as validate } from "shared/data/defaultData";



export default (world: World) => {
	Players.GetPlayers().forEach((player) => {
		if (!player.GetAttribute("DataLoaded")) {
			player.SetAttribute("DataLoaded", true);

			task.spawn(() => loadPlayerData(player));
		}
	});
};
