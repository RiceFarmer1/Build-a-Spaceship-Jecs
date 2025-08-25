import { HotReloader } from "@rbxts/hot-reloader";
import { Entity, Name, Pair, pair, World } from "@rbxts/jecs";
import { Document } from "@rbxts/lapis";
import { Scheduler } from "@rbxts/planck";
import { DocumentData, PlayerData } from "shared/data/defaultData";

export const world = new World();
export const systemQueue = new Scheduler(world);
export const hotReloader = new HotReloader();
world.set(Name, Name, "Name");
const component = <T = undefined>(name: string, defaultValue?: T) => {
	const theComponent = world.component<T>();

	// Create a new component with the given name
	world.set(theComponent, Name, name);
	if (defaultValue) world.set(theComponent, theComponent, defaultValue);

	// returns it
	return theComponent;
};

export const Append = component<Callback>("Append");
export const ModelDebugger = component<Model | BasePart>("ModelDebugger");
export const TargetEntity = component<Entity>("TargetEntity");
export const Cooldown = component<number>("Cooldown");
export const DestroyAfterCounting = component("DestroyAfterCounting");
export const ReplicatedComponent = component<Entity>("ReplicatedComponent");
export const TargetReplication =
	component<{ [key in (typeof componentsToReplicate)[keyof typeof componentsToReplicate]]?: Player[] }>(
		"TargetReplication",
	);

const _changedComponent = component<Changed<unknown>>("Changed");
const _addedComponent = component<Entity>("Added");
const _removedComponent = component<Entity>("Removed");

// for changes
type Changed<T> = { readonly old?: T; readonly new?: T };
export const [changedQuery, addedQuery, removedQuery] = [new Set<Entity>(), new Set<Entity>(), new Set<Entity>()];
export const Changed = <T>(comp: Entity<T>) => {
	changedQuery.add(comp);
	Added(comp);
	Removed(comp);
	return pair<Changed<T>, T>(_changedComponent as unknown as Entity<Changed<T>>, comp as unknown as Entity<T>);
};
export const Added = <T>(comp: Entity<T>) => {
	addedQuery.add(comp);
	return pair<T, undefined>(_addedComponent as unknown as Entity<T>, comp as unknown as Entity<undefined>);
};
export const Removed = <T>(comp: Entity<T>) => {
	removedQuery.add(comp);
	return pair<T, undefined>(_removedComponent as unknown as Entity<T>, comp as unknown as Entity<undefined>);
};

/******************* Camera *******************/

// have the camera follow an instance
export const FollowInstance = component<{
	instanceToFollow: BasePart;
	offset: Vector3;
	rotation: CFrame,
	smoothness: number;
}>("FollowInstance");

/************************ Player ************************/

// Player data
export const Data = component<PlayerData>("Data");

// update data
export const UpdateData = component<{
	updateFunction: (oldData: PlayerData) => PlayerData;
	bodyEntity: Entity;
	updateAll?: true;
}>("UpdateData");

// player component
export const Player = component<Player>("Player");

// player stats

export const Body = component<{
	model: Model;
	head: BasePart;
	humanoid: Humanoid;
	rootPart: BasePart;
	animator: Animator;
	rootAttachment: Attachment;
}>("Body");

/************************ Spaceship ************************/
export const Spaceship = component<{
	spaceshipModel: Model;
	spaceshipAngle: number
}>("Spaceship");
export const Occupant = component<Entity>("Occupant");

export const SpawnPoint = component<{ spawn: BasePart; point: Vector3 }>("SpawnPoint");

// ship stats
export const HealthBar = component<{ regenerateRate?: number; current: number; max: number }>("HealthBar");
export const Energy = component<{ regenerateRate: number; current: number; max: number }>("Energy");

export const Planet = component("Planet");

export const CastProjectile = component<{
	origin: Vector3;
	direction: Vector3
	speed: number;
	maxDistance: number;
	include: Array<Instance>;
	visualize: boolean,
	hit: (hitEntity: Entity) => void;
	radius?: number
}>("CastProjectile");

export const componentsToReplicate = { Body, FollowInstance };
