import { Service } from "@flamework/core";
import { BadgeService } from "@rbxts/services";
import SiftDictionary from "@rbxts/sift/out/Dictionary";
import badges, { BadgeID } from "shared/data/badges";
import { OnPlayerJoin } from "shared/decorators";

@Service()
export class PlayerBadgeService {
	@OnPlayerJoin
	public onPlayerJoin(player: Player) {
		this.grantBadge(player, badges.Welcome)
			.then(() => warn("Successfully granted badge"))
			.catch((err) => warn(`Failed to grant badge to player: ${player.UserId}`));
	}

	/**
	 * Grants a badge to the player
	 *
	 * @param player - The player to be awared to
	 * @param badgeID - The badge the player would have been granted
	 * @returns Proise
	 */
	public async grantBadge(player: Player, badgeID: BadgeID): Promise<void> {
		// checking if badge id exists
		if (!SiftDictionary.has(badges, badgeID)) {
			return;
		}

		const hasBadge = await this.checkIfPlayerHasBadge(player, badgeID);
		if (hasBadge) {
			return;
		}

		const { UserId } = player;
		BadgeService.AwardBadge(UserId, badgeID);
	}

	public async checkIfPlayerHasBadge(player: Player, badgeId: BadgeID): Promise<boolean> {
		return Promise.try(() => BadgeService.UserHasBadgeAsync(player.UserId, badgeId));
	}
}
