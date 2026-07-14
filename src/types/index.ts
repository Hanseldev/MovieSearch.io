export interface Country {
	readonly code: string;
	readonly name: string;
}

export interface MediaItem {
	id: number;
	title?: string;
	name?: string;
	mediaType: "movie" | "tv";
	posterPath: string | null;
	releaseDate?: string;
	firstAirDate?: string;
	voteAverage?: number;
	voteCount?: number;
	popularity?: number;
	overview?: string;
}

export interface WatchProvider {
	providerId: number;
	providerName: string;
	logoPath: string | null;
}

export interface ProviderResult {
	link: string;
	streaming: WatchProvider[];
	rent: WatchProvider[];
	buy: WatchProvider[];
}

export interface TrailerVideo {
	key: string;
	site: string;
	type: string;
}
