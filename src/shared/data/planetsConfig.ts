const maxRadius = 30;
const planetsConfig = {
	maxRadius,
	padding: 50,
    // top, right, bottom, left
	margin: [-maxRadius, -maxRadius, -maxRadius, -maxRadius],
    nPlanets: 50,
    nCandidates: 10,
    nCirclesPerFrame: 0.1,
    failAfter: 1000,
};

export default planetsConfig;
export type planetsConfigType = typeof planetsConfig;
