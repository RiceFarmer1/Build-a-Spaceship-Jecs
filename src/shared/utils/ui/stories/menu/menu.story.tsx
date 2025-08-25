import React, { StrictMode } from "@rbxts/react";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import Menu from "../../pages/menu";

// return the controller
export = (frame: Frame) => {
	const root = createRoot(new Instance("Folder"));

	root.render(<StrictMode>{createPortal(<Menu />, frame)}</StrictMode>);

	//We need to return another function to unmount the handle
	return () => {
		root.unmount();
	};
};
