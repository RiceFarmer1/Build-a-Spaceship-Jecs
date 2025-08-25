import { World } from "@rbxts/jecs";
import { CollectionService } from "@rbxts/services";
import { addComponent } from "shared/utils/functions/jecsHelpFunctions";
import { ModelDebugger, SpawnPoint } from "shared/utils/jecs/components";
import { useMemo } from "shared/utils/jecs/plugins/hooks/use-memo";

export default (world: World) => {
	function addSpawner(spawnPoint: BasePart) {
		print(spawnPoint)
		if (!spawnPoint.GetAttribute("ServerId")) {
			const entity = world.entity();
			spawnPoint.SetAttribute("ServerId", entity);

			addComponent(entity, SpawnPoint, { spawn: spawnPoint, point: spawnPoint.GetPivot().Position });
			addComponent(entity, ModelDebugger, spawnPoint);
		}
	}

	useMemo(() => {
		for (const spawn of CollectionService.GetTagged("Spawner")) addSpawner(spawn as BasePart);
		CollectionService.GetInstanceAddedSignal("Spawner").Connect((point) => addSpawner(point as BasePart));
	}, []);
};
