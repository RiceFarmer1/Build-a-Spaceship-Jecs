import React from "@rbxts/react";
import { useAtom } from "@rbxts/react-charm";
import pageStates from "../../state";
import imageIds from "shared/data/imageIds";
import Home from "./home";
import { usePx } from "../../hooks/use-px";
import { Frame } from "../../components/primitive/frame";
import { ImageLabel } from "../../components/primitive/image";
import { routes } from "shared/network";

export default () => {
	const px = usePx();
	const page = useAtom(pageStates.openPage);
	const isHome = page === "home"

	return (
		<Frame
			key="Menu"
			Native={{ Position: UDim2.fromScale(0.5, 0.5), Size: UDim2.fromScale(1, 1), BackgroundTransparency: 1 }}
		>
			<ImageLabel
				Image={imageIds.menu.menu_bg}
				Native={{
					AnchorPoint: new Vector2(0.5, 0.5),
					Position: UDim2.fromScale(0.5, 0.5),
					Size: UDim2.fromScale(1.1, 2.15),
					BackgroundTransparency: 1,
					ImageTransparency: 1
				}}
			/>

			{isHome ? <Home /> : <></>}
		</Frame>
	);
};
