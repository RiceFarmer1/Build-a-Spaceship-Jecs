import { Atom, atom } from "@rbxts/charm";

const pageStates = {
	openPage: atom("home") as Atom<"home" | "shop" | "build" | "settings" | "hud" >,
	notifiy: atom("none") as Atom<"low-energy" | "none">,
};

export type PageStates = typeof pageStates;
export default pageStates;
