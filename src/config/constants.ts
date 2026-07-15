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

export const RANDOM_SEARCH_TERMS = [
	// Genres & Sub-genres
	"Cyberpunk",
	"Neo-noir",
	"Space Opera",
	"Psychological Thriller",
	"Dark Comedy",
	"Supernatural",
	"Kaiju",
	"Time Travel",
	"Martial Arts",
	"Post-apocalyptic",
	"Mockumentary",
	"Slasher",
	"Steampunk",
	"High Fantasy",
	"Whodunit",

	// Aesthetic & Descriptive Themes
	"Dystopian",
	"Heist",
	"Surrealist",
	"Spaghetti Western",
	"Alien Invasion",
	"Mind-bending",
	"Coming of Age",
	"Investigation",
	"Survival",
	"Mythology",

	// Iconic Filmmakers & Styles (triggers excellent targeted TMDB lists)
	"Tarantino",
	"Christopher Nolan",
	"Studio Ghibli",
	"A24",
	"Denis Villeneuve",
	"Fincher",
	"Spielberg",
	"Coen Brothers",
	"Kubrick",
	"Hitchcock",
] as const;

export const getRandomSearchTerm = (): string => {
	const randomIndex = Math.floor(Math.random() * RANDOM_SEARCH_TERMS.length);
	return RANDOM_SEARCH_TERMS[randomIndex];
};

export const TMDB_API_KEY = "d42f71e99226be1c6e1e4714c346330d";
export const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";
