import { useState } from "react";
import { Button } from "./components/Button";
import { Pill } from "./components/Pill";
import { Select } from "./components/Select";
import { SearchBar } from "./components/SearchBar";
import { MovieGrid } from "./components/MovieGrid";
import { MovieDetailModal } from "./components/MovieDetailModal";
import type { MediaItem } from "./components/MovieCard";

const MOCK_MEDIA_ITEMS: MediaItem[] = [
	{
		id: 1,
		title: "Inception",
		poster_path: "/o067vCCb66Yw69BBmGC6478646R.jpg",
		media_type: "movie",
		release_date: "2010-07-16",
		vote_average: 8.4,
	},
	{
		id: 2,
		name: "Breaking Bad",
		poster_path: "/ztkUQv63U7v696v269m6GC64786.jpg",
		media_type: "tv",
		first_air_date: "2008-01-20",
		vote_average: 9.5,
	},
	{
		id: 3,
		title: "Interstellar",
		poster_path: null,
		media_type: "movie",
		release_date: "2014-11-07",
		vote_average: 8.3,
	},
	{
		id: 4,
		title: "The Dark Knight",
		poster_path: "/qJ2tW6WMUDgBeSgSsc7W7Y79asg.jpg",
		media_type: "movie",
		release_date: "2008-07-18",
		vote_average: 9.0,
	},
	{
		id: 5,
		name: "Stranger Things",
		poster_path: "/49W0xoL96Y6Yg9Af7nocN68o7i0.jpg",
		media_type: "tv",
		first_air_date: "2016-07-15",
		vote_average: 8.6,
	},
];

function App() {
	// Search & Filter States
	const [query, setQuery] = useState("");
	const [activeFilter, setActiveFilter] = useState("All");
	const [country, setCountry] = useState("NG");

	// State to manage modal presentation
	const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

	// Grid Debug Toggles (For Previewing States)
	const [viewMode, setViewMode] = useState<"loaded" | "loading" | "empty">(
		"loaded",
	);

	const handleSearch = () => {
		alert(`Searching for "${query}"`);
	};

	const handleSurprise = () => {
		// Picks a random movie item from our mock dataset
		const randomIndex = Math.floor(Math.random() * MOCK_MEDIA_ITEMS.length);
		setSelectedItem(MOCK_MEDIA_ITEMS[randomIndex]);
	};

	// Determine items layout depending on our preview state
	const displayedItems =
		viewMode === "loaded" ? MOCK_MEDIA_ITEMS : viewMode === "empty" ? [] : [];

	return (
		<main className="min-h-screen bg-bg-dark text-text-light font-sans p-8 flex flex-col gap-10">
			{/* 1. STATE CONTROLLER PANEL */}
			<section className="bg-surface-dark border border-dim-gold/10 p-4 rounded-xl max-w-xl space-y-3">
				<p className="text-xs font-bold uppercase tracking-widest text-accent-gold">
					Preview States:
				</p>
				<div className="flex gap-2">
					<Button
						onClick={() => setViewMode("loaded")}
						variant={viewMode === "loaded" ? "accent" : "secondary"}
						className="text-xs px-3 py-1.5"
					>
						Loaded (5 Cards)
					</Button>
					<Button
						onClick={() => setViewMode("loading")}
						variant={viewMode === "loading" ? "accent" : "secondary"}
						className="text-xs px-3 py-1.5"
					>
						Loading (Skeletons)
					</Button>
					<Button
						onClick={() => setViewMode("empty")}
						variant={viewMode === "empty" ? "accent" : "secondary"}
						className="text-xs px-3 py-1.5"
					>
						Empty Results
					</Button>
				</div>
			</section>

			{/* 2. SEARCH BAR CONTAINER */}
			<section className="space-y-4">
				<h2 className="text-xs uppercase tracking-widest text-dim-gold font-bold">
					Composed Search Interface
				</h2>
				<div className="p-6 border border-dim-gold/5 rounded-xl bg-surface-dark/30 max-w-3xl">
					<SearchBar
						query={query}
						onQueryChange={setQuery}
						activeFilter={activeFilter}
						onFilterChange={setActiveFilter}
						country={country}
						onCountryChange={setCountry}
						onSearch={handleSearch}
						onSurpriseMe={handleSurprise}
					/>
				</div>
			</section>

			<hr className="border-dim-gold/5 max-w-5xl" />

			{/* 3. RESPONSIVE MOVIE GRID */}
			<section className="space-y-4 max-w-5xl">
				<h2 className="text-xs uppercase tracking-widest text-dim-gold font-bold">
					Search Results ({viewMode.toUpperCase()})
				</h2>
				<MovieGrid
					items={displayedItems}
					loading={viewMode === "loading"}
					onItemClick={(item) => setSelectedItem(item)}
				/>
			</section>

			<hr className="border-dim-gold/5 max-w-5xl" />

			{/* 4. ATOMIC PRIMITIVES GUIDE */}
			<section className="space-y-6">
				<h2 className="text-xs uppercase tracking-widest text-dim-gold font-bold">
					UI Component Library
				</h2>

				{/* Buttons */}
				<div className="space-y-2">
					<p className="text-xs text-dim-gold">Buttons</p>
					<div className="flex flex-wrap gap-4">
						<Button variant="primary">Primary</Button>
						<Button variant="secondary">Secondary</Button>
						<Button variant="accent">Accent</Button>
					</div>
				</div>

				{/* Pills */}
				<div className="space-y-2">
					<p className="text-xs text-dim-gold">Pills</p>
					<div className="flex flex-wrap gap-3">
						<Pill label="Active Filter" isActive={true} onClick={() => {}} />
						<Pill label="Inactive Filter" isActive={false} onClick={() => {}} />
						<Pill
							label="Trending"
							prefix="🔥"
							isActive={false}
							onClick={() => {}}
						/>
					</div>
				</div>

				{/* Select */}
				<div className="space-y-2">
					<p className="text-xs text-dim-gold">Select</p>
					<Select
						label="Region"
						value={country}
						options={[
							{ value: "NG", label: "Nigeria" },
							{ value: "US", label: "United States" },
						]}
						onChange={(val) => setCountry(val)}
					/>
				</div>
			</section>

			{/* 5. INTERACTIVE DETAIL OVERLAY */}
			<MovieDetailModal
				item={selectedItem}
				onClose={() => setSelectedItem(null)}
			/>
		</main>
	);
}

export default App;
