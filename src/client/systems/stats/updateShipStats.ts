import { World } from "@rbxts/jecs";
import { useRoute } from "shared/utils/jecs/plugins/hooks/use-route";
import pageStates from "shared/utils/ui/state";

export default (world: World) => {
   useRoute("shipSpawned", () => {
        pageStates.openPage("hud")
   })
}