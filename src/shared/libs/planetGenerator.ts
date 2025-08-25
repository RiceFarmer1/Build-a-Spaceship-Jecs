import planetsConfig from "shared/data/planetsConfig";

class PlanetGenerator {
	private readonly circles: [number, number, number][] = [];

	public constructor(
		private readonly x0: Vector2,
		private readonly x1: Vector2,
	) {}

	public GetPosition(): [number, number, number] | undefined {
		let [bestX, bestY, bestDistance] = [0, 0, 0];

		for (let i = 0; i < planetsConfig.nCandidates; i++) {
			const x = (this.x1.X - this.x0.X) * math.random() + this.x0.X;
			const y = (this.x1.Y - this.x0.Y) * math.random() + this.x0.Y;

			let minDistance = planetsConfig.maxRadius;
			for (let j = 0; j < this.circles.size() && minDistance > 0; j++) {
				const circle = this.circles[j];
				const dSquared = this.GetDistance(x, y, circle[0], circle[1]);
				if (dSquared < circle[2] ** 2) minDistance = 0;
				const d = math.sqrt(dSquared) - circle[2];
				if (d < minDistance) minDistance = d;
			}

			if (minDistance > bestDistance) {
				bestX = x;
				bestY = y;
				bestDistance = minDistance;
			}
		}

		if (bestDistance > 0) {
			const bestPos: [number, number, number] = [bestX, bestY, bestDistance];
			this.circles.push(bestPos);
			return bestPos;
		} else return undefined;
	}

	private GetDistance(x0: number, y0: number, x1: number, y1: number): number {
		return (x0 - x1) ** 2 + (y0 - y1) ** 2;
	}
}

export default PlanetGenerator;
