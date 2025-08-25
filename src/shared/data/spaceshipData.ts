import { t } from "@rbxts/t";

export const Spaceships = {
	Default: { Level: 1, Control: 100, FirePower: 75, Thrust: 25, Speed: 50 },
} as Record<SpaceshipName, Omit<SpaceshipData, "Name">>;

export const SpaceshipDefaultData = {
	Name: "Default",
	Level: 1,
	Control: 100,
	FirePower: 75,
	Speed: 50,
	Thrust: 25,
};

export const spaeshipValidation = t.interface({
	Name: t.string,
	Level: t.number,
	Control: t.number,
	FirePower: t.number,
	Speed: t.number,
	Thrust: t.number,
});

export type SpaceshipData = typeof SpaceshipDefaultData;
