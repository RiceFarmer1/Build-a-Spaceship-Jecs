import { RunService } from "@rbxts/services";
import { Actions, InputState, VirtualAxis2d } from "@rbxts/spark";

export const inputState = new InputState();
export const actions = new Actions(["ship-accelerate", "fire-bullet"]);
actions.setRebuildBindings((bindings) => {
	bindings.bind("ship-accelerate", Enum.KeyCode.Q);
	bindings.bind("fire-bullet", Enum.UserInputType.MouseButton1, Enum.KeyCode.ButtonR1);
});

RunService.BindToRenderStep("Spark", Enum.RenderPriority.Input.Value, () => {
	actions.update(inputState);
	inputState.clear();
});
