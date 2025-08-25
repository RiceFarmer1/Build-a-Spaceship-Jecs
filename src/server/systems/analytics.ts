import { AnalyticsService } from "@rbxts/services";

export function logTutorial(player: Player, tutorial_step: string, step?: number) {
	const session = `${player.UserId}`;
	AnalyticsService.LogFunnelStepEvent(player, tutorial_step, session, step);
}
