import { Storybook } from "@rbxts/ui-labs";

const storybook: Storybook = {
	name: "Stories",
	storyRoots: script.Parent?.GetChildren().filter((story) => story.IsA("Folder")) || [],
	groupRoots: true,
};

export = storybook;
