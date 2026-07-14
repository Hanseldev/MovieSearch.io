import type { Country } from "../types";

export const TRENDING_TITLES: readonly string[] = [
	"Inception",
	"Interstellar",
	"The Dark Knight",
	"Breaking Bad",
	"Game of Thrones",
	"Parasite",
	"Oppenheimer",
	"The Bear",
] as const;

export const FILTERS: readonly string[] = [
	"All",
	"Movies",
	"TV Shows",
] as const;

export const COUNTRIES: readonly Country[] = [
	{ code: "NG", name: "Nigeria" },
	{ code: "US", name: "United States" },
	{ code: "GB", name: "United Kingdom" },
	{ code: "CA", name: "Canada" },
	{ code: "AU", name: "Australia" },
	{ code: "ZA", name: "South Africa" },
	{ code: "IN", name: "India" },
] as const;

export const TMDB_API_KEY = "d42f71e99226be1c6e1e4714c346330d";
export const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";
