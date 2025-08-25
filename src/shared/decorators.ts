import { callMethodOnDependencies } from "@rbxts/flamework-meta-utils";
import { Players } from "@rbxts/services";

/** @metadata reflect identifier*/
export function OnPlayerJoin(
	ctor: object,
	propertyKey: string,
	descriptor: TypedPropertyDescriptor<(this: unknown, player: Player) => void>,
) {
	Players.PlayerAdded.Connect((player) => callMethodOnDependencies(ctor, descriptor, player));
}
