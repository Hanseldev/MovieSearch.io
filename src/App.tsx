import { useState, useEffect, useRef, useCallback } from "react";
import { searchTMDB } from "./services/tmdb";
import type { MediaItem } from "./types";
import { Pill } from "./components/Pill";
import { SearchBar } from "./components/SearchBar";
import { MovieGrid } from "./components/MovieGrid";
import { MovieDetailModal } from "./components/MovieDetailModal";
import {
	FILTERS,
	COUNTRIES,
	TRENDING_TITLES,
	getRandomSearchTerm,
} from "./config/constants";

export default function App() {
	// UI Layout state
	const [isContactOpen, setIsContactOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Modal state
	const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

	// Search & Filtering state
	const [query, setQuery] = useState("");
	const [activeFilter, setActiveFilter] = useState<string>(FILTERS[0]);
	const [country, setCountry] = useState<string>(COUNTRIES[0].code); // Defaults to first in constants ("NG")
	const [items, setItems] = useState<MediaItem[]>([]);
	const [loading, setLoading] = useState(false);

	// Fetch trending titles concurrently to populate Spotlight mode
	const loadSpotlightItems = useCallback(async (filter: string) => {
		setLoading(true);
		try {
			const requests = TRENDING_TITLES.map((title) =>
				searchTMDB(title, filter),
			);
			const resultsArray = await Promise.all(requests);

			// Flatten results, pulling the top match for each trending title
			const spotlight = resultsArray
				.map((results) => results[0])
				.filter((item): item is MediaItem => !!item);

			setItems(spotlight);
		} catch (error) {
			console.error("Failed to load trending spotlight:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	// Core Search Executor
	const handleSearch = useCallback(
		async (searchQuery: string, filter: string) => {
			const trimmedQuery = searchQuery.trim();
			if (!trimmedQuery) {
				loadSpotlightItems(filter);
				return;
			}

			setLoading(true);
			try {
				const results = await searchTMDB(trimmedQuery, filter);
				setItems(results);
			} catch (error) {
				console.error("Failed to execute media search:", error);
			} finally {
				setLoading(false);
			}
		},
		[loadSpotlightItems],
	);

	// Handle initial mount
	useEffect(() => {
		loadSpotlightItems(activeFilter);
	}, [loadSpotlightItems, activeFilter]);

	// Typing debounce logic
	useEffect(() => {
		const timer = setTimeout(() => {
			handleSearch(query, activeFilter);
		}, 300);

		return () => clearTimeout(timer);
	}, [query, activeFilter, handleSearch]);

	// Close contact dropdown on click-outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsContactOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Trigger random title from configuration lists
	const handleSurpriseMe = () => {
		const randomTerm = getRandomSearchTerm();
		setQuery(randomTerm);
		handleSearch(randomTerm, activeFilter);
	};

	const handleItemClick = (item: MediaItem) => {
		setSelectedItem(item);
	};

	return (
		<main className="min-h-screen relative flex flex-col bg-bg-dark text-text-light">
			<header className="flex gap-4 items-center justify-between bg-card-dark/20 p-4 md:py-8 md:px-8 mb-8 md:mb-16">
				<p
					className="tracking-wide md:text-3xl font-semibold font-display cursor-pointer"
					onClick={() => {
						setQuery("");
						loadSpotlightItems(activeFilter);
					}}
				>
					MovieSearch.IO
				</p>

				<div className="relative" ref={dropdownRef}>
					<Pill
						label="Contact the developer"
						isActive={isContactOpen}
						onClick={() => setIsContactOpen((prev) => !prev)}
					/>

					<div
						className={`absolute right-0 w-fit bg-surface-dark flex flex-col mt-2 rounded-xl py-4 px-4 gap-2 border border-white/5 shadow-2xl transition-all duration-100 ease-out origin-top-right z-50 ${
							isContactOpen
								? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
								: "opacity-0 scale-95 -translate-y-2 pointer-events-none"
						}`}
					>
						<p className="bg-card-dark p-2 text-sm rounded-lg flex justify-between gap-6 items-center">
							<span>Whatsapp:</span>{" "}
							<a
								href="https://wa.me/2349155020087"
								target="_blank"
								rel="noopener noreferrer"
								className="font-bebas text-dim-gold hover:text-accent-gold transition-colors cursor-pointer"
							>
								+2349155020087
							</a>
						</p>
						<p className="bg-card-dark p-2 text-sm text-nowrap rounded-lg flex justify-between gap-6 items-center">
							<span>Email:</span>
							<a
								href="mailto:chidumebiebelebe@gmail.com"
								className="font-bebas text-dim-gold hover:text-accent-gold transition-colors cursor-pointer"
							>
								chidumebiebelebe@gmail.com
							</a>
						</p>
					</div>
				</div>
			</header>

			<section className="flex flex-col items-center px-4 mb-12">
				<div className="flex flex-col items-center">
					<h1 className="text-2xl md:text-4xl lg:text-6xl font-bebas mb-2 text-center">
						Find your next{" "}
						<span className="font-display text-accent-gold">BIG SCREEN</span>{" "}
						night
					</h1>
					<p className="text-sm md:text-base w-80 md:w-fit text-center mb-8 text-dim-gold">
						Type in a movie or show and see what we should play next
					</p>
					<SearchBar
						query={query}
						onQueryChange={setQuery}
						activeFilter={activeFilter}
						onFilterChange={setActiveFilter}
						country={country}
						onCountryChange={setCountry}
						onSearch={() => handleSearch(query, activeFilter)}
						onSurpriseMe={handleSurpriseMe}
						loading={loading}
					/>
				</div>
			</section>

			<section className="px-4 md:px-8 max-w-7xl mx-auto w-full pb-16">
				<div className="mb-6 flex items-center justify-between">
					<h2 className="text-lg md:text-2xl font-display font-bold text-text-light">
						{query.trim() ? "Search Results" : "Featured Spotlight"}
					</h2>
				</div>
				<MovieGrid
					items={items}
					loading={loading}
					onItemClick={handleItemClick}
				/>
			</section>

			{/* Render the Detail Modal and pass selected country down */}
			{selectedItem && (
				<MovieDetailModal
					item={selectedItem}
					countryCode={country}
					onClose={() => setSelectedItem(null)}
				/>
			)}
		</main>
	);
}
