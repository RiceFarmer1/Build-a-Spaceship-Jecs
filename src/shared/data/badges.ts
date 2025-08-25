const badges = {
	["Welcome"]: 1111,
};
export type Badges = typeof badges;
export type BadgeID = ValueOf<typeof badges>;
export default badges;
