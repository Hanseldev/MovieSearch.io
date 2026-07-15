import type { FC } from "react";
import { MovieCard } from "./MovieCard";
import type { MediaItem } from "../types";

interface MovieGridProps {
	items: readonly MediaItem[];
	loading: boolean;
	onItemClick: (item: MediaItem) => void;
}

export const MovieGrid: FC<MovieGridProps> = ({
	items,
	loading,
	onItemClick,
}) => {
	// 1. Loading Skeleton state
	if (loading) {
		return (
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
				{Array.from({ length: 10 }).map((_, idx) => (
					<div
						key={idx}
						className="flex flex-col bg-card-dark border border-dim-gold/5 rounded-xl overflow-hidden animate-pulse"
					>
						<div className="aspect-2/3 w-full bg-surface-dark" />
						<div className="p-3.5 space-y-2">
							<div className="h-4 bg-surface-dark rounded-md w-3/4" />
							<div className="flex justify-between">
								<div className="h-3 bg-surface-dark rounded-md w-1/4" />
								<div className="h-3 bg-surface-dark rounded-md w-1/4" />
							</div>
						</div>
					</div>
				))}
			</div>
		);
	}

	// 2. Fallback empty state
	if (items.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto">
				<span className="text-4xl mb-4">🎬</span>
				<h3 className="text-text-light font-display text-lg font-semibold mb-1">
					No matches found
				</h3>
				<p className="text-dim-gold text-sm font-sans">
					We couldn't find any titles matching your search. Try checking your
					spelling or adjusting your country filter!
				</p>
			</div>
		);
	}

	// 3. Render loaded movies
	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
			{items.map((item) => (
				<MovieCard
					key={item.id}
					item={item}
					onClick={() => onItemClick(item)}
				/>
			))}
		</div>
	);
};
