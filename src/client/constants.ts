import { Players, Workspace } from "@rbxts/services";

export const { LocalPlayer } = Players;
export const { UserId } = LocalPlayer;
export const { CurrentCamera } = Workspace;

export const LocalCharacter = LocalPlayer.Character || LocalPlayer.CharacterAdded.Wait()[0];
