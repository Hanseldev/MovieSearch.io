import {
	TMDB_API_KEY,
	TMDB_BASE_URL,
	TMDB_IMAGE_BASE,
} from "../config/constants";
import type {
	MediaItem,
	ProviderResult,
	WatchProvider,
	TrailerVideo,
} from "../types";

// Helper to generate mapped poster URLs
export const getPosterUrl = (
	path: string | null,
	width = "w342",
): string | null => (path ? `${TMDB_IMAGE_BASE}/${width}${path}` : null);

export const getProviderLogoUrl = (
	path: string | null,
	width = "w92",
): string | null => (path ? `${TMDB_IMAGE_BASE}/${width}${path}` : null);

// Adapter: raw TMDB snake_case payload -> clean camelCase MediaItem
function adaptMediaItem(item: any, forceType?: "movie" | "tv"): MediaItem {
	return {
		id: item.id,
		title: item.title,
		name: item.name,
		mediaType: forceType || item.media_type || (item.title ? "movie" : "tv"),
		posterPath: item.poster_path || null,
		releaseDate: item.release_date,
		firstAirDate: item.first_air_date,
		voteAverage: item.vote_average,
		voteCount: item.vote_count,
		popularity: item.popularity,
		overview: item.overview,
	};
}

// Adapter: Raw TMDB providers -> Clean mapped ProviderResult
function adaptProviderResult(data: any): ProviderResult {
	const link = data?.link || "";

	const mapProvider = (provider: any): WatchProvider => ({
		providerId: provider.provider_id,
		providerName: provider.provider_name,
		logoPath: provider.logo_path || null,
	});

	return {
		link,
		streaming: (data?.flatrate || []).map(mapProvider),
		rent: (data?.rent || []).map(mapProvider),
		buy: (data?.buy || []).map(mapProvider),
	};
}

/**
 * Searches TMDB for movies, TV shows, or both based on filter type.
 */
export async function searchTMDB(
	query: string,
	mediaFilter: string,
): Promise<MediaItem[]> {
	if (!query || !query.trim()) return [];

	let type = "multi";
	if (mediaFilter === "Movies") type = "movie";
	else if (mediaFilter === "TV Shows") type = "tv";

	try {
		const res = await fetch(
			`${TMDB_BASE_URL}/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`,
		);
		if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

		const data = await res.json();
		const results = data.results || [];

		if (type === "movie") {
			return results.map((item: any) => adaptMediaItem(item, "movie"));
		}
		if (type === "tv") {
			return results.map((item: any) => adaptMediaItem(item, "tv"));
		}

		// "multi" search returns people, movies, and TV. Filter out people.
		return results
			.filter((item: any) => item.media_type !== "person")
			.map((item: any) => adaptMediaItem(item));
	} catch (e) {
		console.error("TMDB search request failed:", e);
		return [];
	}
}

/**
 * Fetches region-specific watch options (Streaming, Rent, Buy).
 */
export async function fetchWatchProviders(
	id: number,
	mediaType: "movie" | "tv",
	countryCode: string,
): Promise<ProviderResult | null> {
	const endpoint = mediaType === "tv" ? "tv" : "movie";
	try {
		const res = await fetch(
			`${TMDB_BASE_URL}/${endpoint}/${id}/watch/providers?api_key=${TMDB_API_KEY}`,
		);
		if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

		const data = await res.json();
		const regionData = data.results?.[countryCode];

		return regionData ? adaptProviderResult(regionData) : null;
	} catch (e) {
		console.error("Watch providers request failed:", e);
		return null;
	}
}

/**
 * Retrieves the primary video trailer path for a title.
 */
export async function fetchTrailerVideo(
	id: number,
	mediaType: "movie" | "tv",
): Promise<TrailerVideo | null> {
	const endpoint = mediaType === "tv" ? "tv" : "movie";
	try {
		const res = await fetch(
			`${TMDB_BASE_URL}/${endpoint}/${id}/videos?api_key=${TMDB_API_KEY}&language=en-US`,
		);
		if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

		const data = await res.json();
		const videos: any[] = Array.isArray(data.results) ? data.results : [];

		const trailerVideo =
			videos.find(
				(video) =>
					video.site === "YouTube" && /trailer|teaser/i.test(video.type || ""),
			) || videos.find((video) => video.site === "YouTube");

		if (trailerVideo) {
			return {
				key: trailerVideo.key,
				site: trailerVideo.site,
				type: trailerVideo.type,
			};
		}
		return null;
	} catch (e) {
		console.error("Trailer fetch request failed:", e);
		return null;
	}
}
