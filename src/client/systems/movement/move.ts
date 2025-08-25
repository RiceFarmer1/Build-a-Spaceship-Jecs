import client from "@rbxts/jabby/out/jabby/client";
import { Entity, pair, World } from "@rbxts/jecs";
import { UserInputService, Workspace } from "@rbxts/services";
import { Tracer } from "@rbxts/tracer";
import { CurrentCamera, LocalCharacter, LocalPlayer } from "client/constants";
import { actions } from "shared/data/keybinds";
import { routes } from "shared/network";
import paths from "shared/paths";
import { getEntity } from "shared/utils/functions/jecsHelpFunctions";
import { RayParams, rayParamsFilter } from "shared/utils/functions/rayFunctions";
import { Body, Energy, Occupant, Spaceship } from "shared/utils/jecs/components";
import { useMemo } from "shared/utils/jecs/plugins/hooks/use-memo";
import { useThrottle } from "shared/utils/jecs/plugins/hooks/use-throttle";
import pageStates from "shared/utils/ui/state";

export default (world: World) => {
	const serverEntity = LocalCharacter.GetAttribute("ServerId") as Entity;
	const clientEntity = serverEntity && getEntity.replicatedFromServerEntity(serverEntity);
	const isShooting = actions.pressed("fire-bullet");
	const isAccelerating = actions.pressed("ship-accelerate");

	if (useThrottle(0.01) && CurrentCamera) {
		const mouseLocation = UserInputService.GetMouseLocation();
		const cameraCenter = CurrentCamera.ViewportSize.div(2);
		const angle = -math.atan2(mouseLocation.X - cameraCenter.X, mouseLocation.Y - cameraCenter.Y);

		if (isShooting) {
			const toScreen = CurrentCamera.ViewportPointToRay(mouseLocation.X, mouseLocation.Y, 1)
			routes.shipShoot.send({
				direction: toScreen.Direction,
				speed: 15,
				maxDistance: 100,
				visualize: true
			})
		} else {
			routes.shipMove.send(angle);
		}
	}
};
