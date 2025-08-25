type Assets = Folder & {
	Spawn: BasePart
	Spaceships: Folder & {
		Default: Model & {
			fireOrigin: BasePart
		};
	};
	Planets: Folder & {
		Saturn: Model,
		
	}
};
