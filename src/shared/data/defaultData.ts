import { Document } from "@rbxts/lapis";
import { t } from "@rbxts/t";
import { SpaceshipDefaultData, SpaceshipData, spaeshipValidation } from "./spaceshipData";

const defaultData = {
	Kills: 0,
	Wins: 0,
	SpaceshipData: SpaceshipDefaultData
};

export const playerDataValidation = t.interface({
	Kills: t.number,
	Wins: t.number,
	SpaceshipData: spaeshipValidation
});

export default defaultData;
export type PlayerData = typeof defaultData;
export type DocumentData = Document<PlayerData, true>;
