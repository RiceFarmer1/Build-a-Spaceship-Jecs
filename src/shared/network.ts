import ByteNet, { bool, defineNamespace, definePacket, optional, struct } from "@rbxts/bytenet";
import { Entity } from "@rbxts/jecs";
import { componentsToReplicate, FollowInstance } from "./utils/jecs/components";
import { ComponentDataFromEntity, MappedComponents } from "./utils/functions/jecsHelpFunctions";
import { SpaceshipData } from "./data/spaceshipData";

export type packet<T extends ByteNetType<unknown>> = ReturnType<typeof ByteNet.definePacket<T>>;
export type optional<T extends ByteNetType<unknown>> = ReturnType<typeof ByteNet.optional<T>>;
export type struct<T extends { [index: string]: ByteNetType<unknown> }> = ReturnType<typeof ByteNet.struct<T>>;
export type ByteNetType<T> = {
	value: T;
};
type Vector3Net = ReturnType<typeof ByteNet.vec3> & ByteNetType<Vector3>;

export type MapTableToByteNet<T> = T extends Vector3
	? ByteNetType<Vector3>
	: T extends CFrame
		? ByteNetType<CFrame>
		: T extends Instance
			? ByteNetType<T>
			: T extends Array<unknown>
				? ByteNetType<MapTableToByteNet<T[keyof T]>>
				: T extends object
					? struct<{ [newKey in keyof T]: MapTableToByteNet<T[newKey]> }>
					: ByteNetType<T>;

export const packets = defineNamespace("Packets", () => {
	return {
		/*************** Spaceship ***************/
		updateShipStats: definePacket({
			value: ByteNet.struct({
				statName: ByteNet.string as ByteNetType<"Energy" | "Health" | "Defence">,
				statValue: struct({
					current: ByteNet.int16,
					max: ByteNet.int16,
				}),
			}),
			reliabilityType: "reliable",
		}),

		shipSpawn: definePacket({
			value: ByteNet.nothing,
			reliabilityType: "reliable",
		}),

		shipMove: definePacket({
			value: ByteNet.float32,
			reliabilityType: "reliable",
		}),

		shipSwitch: definePacket({
			value: ByteNet.unknown as ByteNetType<SpaceshipData>,
			reliabilityType: "reliable",
		}),

		// Q-Key to accelerate
		shipAccelerate: definePacket({
			value: struct({
				duration: ByteNet.int8,
			}),
			reliabilityType: "reliable",
		}),

		shipShoot: definePacket({
			value: struct({
				direction: ByteNet.vec3,
				speed: ByteNet.int8,
				maxDistance: ByteNet.float32,
				visualize: ByteNet.bool,
			}),
			reliabilityType: "reliable",
		}),

		// notify when the ship has been spawned
		shipSpawned: definePacket({
			value: ByteNet.nothing,
			reliabilityType: "reliable"
		}),

		// for replicating to all players
		getReplicatedComponents: definePacket({
			value: ByteNet.nothing,
			reliabilityType: "reliable",
		}),

		deleteReplicatedEntity: definePacket({
			value: ByteNet.unknown as ByteNetType<Entity>,
			reliabilityType: "reliable",
		}),

		...({
			Body: definePacket({
				value: struct({
					serverEntity: ByteNet.unknown as ByteNetType<Entity>,
					data: optional(
						struct({
							model: ByteNet.inst as ByteNetType<Model>,
							humanoid: ByteNet.inst as ByteNetType<Humanoid>,
							rootPart: ByteNet.inst as ByteNetType<BasePart>,
							head: ByteNet.inst as ByteNetType<BasePart>,
							rootAttachment: ByteNet.inst as ByteNetType<Attachment>,
							animator: ByteNet.inst as ByteNetType<Animator>,
						}),
					),
				}),
				reliabilityType: "reliable",
			}),
			FollowInstance: definePacket({
				value: struct({
					serverEntity: ByteNet.unknown as ByteNetType<Entity>,
					data: optional(
						struct({
							instanceToFollow: ByteNet.inst as ByteNetType<BasePart>,
							offset: ByteNet.vec3 as ByteNetType<Vector3>,
							rotation: ByteNet.cframe as ByteNetType<CFrame>,
							smoothness: ByteNet.int8,
						}),
					),
				}),
				reliabilityType: "reliable",
			}),
		} satisfies {
			[k in keyof typeof componentsToReplicate]: packet<
				struct<{
					serverEntity: ByteNetType<Entity>;
					data: optional<MapTableToByteNet<ComponentDataFromEntity<MappedComponents[k]>>>;
				}>
			>;
		}),
	};
});

export const routes = {} as { [key in keyof typeof packets]: (typeof packets)[key] };

for (const [key, packet] of pairs(packets)) {
	const toBeCalled = new Set<(...args: unknown[]) => void>();

	const routeFaked = routes as unknown as Record<string, unknown>;

	routeFaked[key] = {
		wait: packet.wait,
		send: packet.send,
		sendToAll: packet.sendToAll,
		sendTo: packet.sendTo,
		sendToList: packet.sendToList,
		sendToAllExcept: packet.sendToAllExcept,
		listen: (callback: (...args: unknown[]) => void) => {
			toBeCalled.add(callback);
			return () => toBeCalled.delete(callback);
		},
	};

	packet.listen((...T: unknown[]) => {
		toBeCalled.forEach((callback: Callback) => callback(...T));
	});
}
