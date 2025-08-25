import { Janitor } from "@rbxts/janitor";
import { Entity, pair, World } from "@rbxts/jecs";
import { createMotion } from "@rbxts/ripple";
import { RunService } from "@rbxts/services";
import { CurrentCamera, LocalCharacter } from "client/constants";
import { routes } from "shared/network";
import { getEntity } from "shared/utils/functions/jecsHelpFunctions";
import { Added, FollowInstance, Player, Spaceship, systemQueue, TargetEntity } from "shared/utils/jecs/components";
import { useChange } from "shared/utils/jecs/plugins/hooks/use-change";
import { useRoute } from "shared/utils/jecs/plugins/hooks/use-route";
import pageStates from "shared/utils/ui/state";

export default (world: World) => {
	const deltaTime = systemQueue.getDeltaTime();

	if (CurrentCamera) {
		for (const [entity, { instanceToFollow, rotation, offset, smoothness }] of world.query(FollowInstance)) {
			if (!instanceToFollow) {
				world.delete(entity);
			} else {
				const oldCF = CurrentCamera.CFrame;
				const goalCF = instanceToFollow.CFrame.mul(new CFrame(offset)).mul(rotation);
				const alpha = math.clamp(deltaTime * smoothness, 0, 1);
				const smoothed = oldCF.Lerp(goalCF, alpha);
				CurrentCamera.CameraType = Enum.CameraType.Scriptable;
				CurrentCamera.CFrame = smoothed;
			}
		}
	}
};
