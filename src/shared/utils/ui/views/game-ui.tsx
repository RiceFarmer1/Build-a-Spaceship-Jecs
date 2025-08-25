import React from "@rbxts/react";
import Menu from "../pages/menu";

export default () => {
	return (
		<frame
			key="GameUI"
			AnchorPoint={new Vector2(0.5, 0.5)}
			Size={UDim2.fromScale(1, 1)}
			Position={UDim2.fromScale(0.5, 0.5)}
			BackgroundTransparency={1}
		>
			<Menu />
		</frame>
	);
};
