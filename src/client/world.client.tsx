import { start } from "shared/utils/jecs/start";
import receiveReplication from "./systems/receive-replication";
import move from "./systems/movement/move";
import { LocalPlayer } from "./constants";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import React, { StrictMode } from "@rbxts/react";
import GameUi from "shared/utils/ui/views/game-ui";
import change from "shared/utils/jecs/systems/change";
import followInstance from "./systems/camera/followInstance"
import updateShipStats from "./systems/stats/updateShipStats";

const playerGui = LocalPlayer.WaitForChild("PlayerGui");
const root = createRoot(new Instance("Folder"));

root.render(
	<StrictMode>
		{createPortal(
			<screengui
				key="GameUI"
				IgnoreGuiInset={true}
				ZIndexBehavior={"Sibling"}
				ResetOnSpawn={false}
				ScreenInsets={Enum.ScreenInsets.DeviceSafeInsets}
			>
				<GameUi />
			</screengui>,
			playerGui,
		)}
	</StrictMode>,
);

start([

	// spaceship
	{ system: move },

	// stats
	{ system: updateShipStats },

	// camera
	{ system: followInstance },

	// replication
	{ system: receiveReplication },
	change
]);
