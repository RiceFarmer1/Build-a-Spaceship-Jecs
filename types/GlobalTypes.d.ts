type FirstParam<T extends (...args: unknown[]) => unknown> = T extends (first: infer U, ...args: unknown[]) => unknown
	? U
	: never;

//* Gets the value of the type
type ValueOf<T> = T[keyof T];

type AssetId = `rbxassetid://${number}` | `rbxgameasset://${string}`;

type SpaceshipName = keyof Omit<Assets["Spaceships"], keyof Folder>
