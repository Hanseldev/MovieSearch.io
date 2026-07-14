import type { FC, KeyboardEvent, ChangeEvent } from "react";
import { Button } from "./Button";
import { Pill } from "./Pill";
import { Select } from "./Select";
import { FILTERS, COUNTRIES } from "../config/constants";

interface SearchBarProps {
	query: string;
	onQueryChange: (query: string) => void;
	activeFilter: string;
	onFilterChange: (filter: string) => void;
	country: string;
	onCountryChange: (country: string) => void;
	onSearch: () => void;
	onSurpriseMe: () => void;
	loading: boolean;
}

export const SearchBar: FC<SearchBarProps> = ({
	query,
	onQueryChange,
	activeFilter,
	onFilterChange,
	country,
	onCountryChange,
	onSearch,
	onSurpriseMe,
	loading,
}) => {
	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && !loading) {
			onSearch();
		}
	};

	const countryOptions = COUNTRIES.map((c) => ({
		value: c.code,
		label: c.name,
	}));

	return (
		<div className="w-full max-w-3xl mx-auto space-y-6">
			{/* Search Input Bar Group */}
			<div className="relative flex items-center justify-between bg-surface-dark border border-dim-gold/10 rounded-xl pl-4 py-2 shadow-lg focus-within:border-dim-gold transition-all duration-300">
				<input
					type="text"
					value={query}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						onQueryChange(e.target.value)
					}
					onKeyDown={handleKeyDown}
					placeholder="Try 'Inception' or 'Breaking Bad'..."
					disabled={loading}
					className="flex-1 bg-transparent text-text-light placeholder-dim-gold/50 focus:outline-none  font-sans text-base mr-12"
				/>
                <div className="w-18"></div>
				<button
					onClick={onSearch}
					disabled={loading}
					
					className="absolute right-0 px-6 py-1.5 min-w-[44px] h-[40px] rounded-xl cursor-pointer bg-card-dark hover:bg-card-dark/70"
					aria-label="Search "
				>
					{loading ? (
						<div className="w-5 h-5 border-2 border-text-light border-t-transparent rounded-full animate-spin" />
					) : (
						"Search"
					)}
				</button>
			</div>

			{/* Media Type Filter Pills */}
			<div className="flex flex-wrap justify-center gap-2">
				{FILTERS.map((f) => (
					<Pill
						key={f}
						label={f}
						isActive={activeFilter === f}
						onClick={() => onFilterChange(f)}
					/>
				))}
			</div>

			{/* Extra Interactive Controls: Region Dropdown & Surprise Action */}
			<div className="flex flex-wrap items-center justify-center gap-4 pt-2 border-t border-dim-gold/5">
				<Button
					variant="secondary"
					onClick={onSurpriseMe}
					disabled={loading}
					className="flex items-center gap-2 text-sm py-2 px-4 border border-dim-gold/20"
				>
					<span>🎲</span> Surprise me
				</Button>

				<Select
					id="region-picker"
					label="Country"
					options={countryOptions}
					value={country}
					onChange={onCountryChange}
				/>
			</div>
		</div>
	);
};
