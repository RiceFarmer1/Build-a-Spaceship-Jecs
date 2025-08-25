import { World } from "@rbxts/jecs";
import { createCollection, Document } from "@rbxts/lapis";
import { useAsync } from "@rbxts/pretty-react-hooks";
import { Players } from "@rbxts/services";
import defaultData, { PlayerData, playerDataValidation } from "shared/data/defaultData";
import { Body, Data, Player, UpdateData, world } from "shared/utils/jecs/components";
import { useEffect } from "shared/utils/jecs/plugins/hooks/use-effect";
import { getPlayerData, setPlayerData } from "./extra/playerData";
import { deepCopy, deepEquals } from "@rbxts/object-utils";
import { addComponent, createEntity } from "shared/utils/functions/jecsHelpFunctions";
import Sift from "@rbxts/sift";

const playersWithoutData = world.query(Body).with(Player).without(Data).cached();

export default (world: World) => {
	for (const [updateEntity, update] of world.query(UpdateData)) {
		const bodyEntity = update.bodyEntity;
		const hasEntity = world.contains(bodyEntity);
		const [body, oldData] = hasEntity ? world.get(bodyEntity, Body, Data) : [];

		world.delete(updateEntity);
		if (body && oldData) {
			const { model } = body;
			const player = Players.GetPlayerFromCharacter(model);
			const updatedData = update.updateFunction(deepCopy(oldData));

			const mergedData = Sift.Dictionary.mergeDeep(updatedData, oldData);
			world.set(bodyEntity, Data, mergedData);
			if (player) {
				const playerDocument = getPlayerData(player);
				if (playerDocument) {
					setPlayerData(player, playerDocument);
					playerDocument.write(mergedData);
				}
			}
		}
	}

	for (const [bodyEntity, { model }] of playersWithoutData) {
		const player = Players.GetPlayerFromCharacter(model);
		if (player) {
			const playerData = getPlayerData(player);
			if (playerData) {
				const read = playerData.read();
				world.set(bodyEntity, Data, read);
				world.set(world.entity(), UpdateData, { updateFunction: () => read, bodyEntity, updateAll: true });
			} else {
				warn(`No player data found for ${player.Name}`);
			}
		}
	}
};
