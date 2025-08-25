import React, { useCallback } from "@rbxts/react";
import { routes } from "shared/network";
import { Button } from "shared/utils/ui/components/primitive/button";
import { Frame } from "shared/utils/ui/components/primitive/frame";
import { usePx } from "shared/utils/ui/hooks/use-px";

export default () => {
	const px = usePx();

	return (
		<Frame Native={{ Size: UDim2.fromScale(1, 1), Position: UDim2.fromScale(0.5, 0.5), BackgroundTransparency: 1 }}>
			<Button
				Native={{ Size: UDim2.fromOffset(px(100), px(50)), Position: UDim2.fromScale(0.5, 0.5) }}
				onClick={() => {
					print("clicked once")
					routes.shipSpawn.send();
				}}
			/>
		</Frame>
	);
};
