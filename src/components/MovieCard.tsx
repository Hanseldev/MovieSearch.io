import type { FC } from "react";
// Import our clean global domain type
import type { MediaItem } from "../types";

interface MovieCardProps {
	item: MediaItem;
	onClick: () => void;
}

export const MovieCard: FC<MovieCardProps> = ({ item, onClick }) => {
	const title = item.title || item.name || "Unknown Title";
	const year = (item.releaseDate || item.firstAirDate || "").slice(0, 4);
	const rating = item.voteAverage ? item.voteAverage.toFixed(1) : "N/A";

	const posterUrl = item.posterPath
		? `https://image.tmdb.org/t/p/w500${item.posterPath}`
		: "https://placehold.co/500x750/1e1e1e/938f99?text=No+Poster";

	return (
		<div
			onClick={onClick}
			className="group flex flex-col bg-card-dark border border-dim-gold/10 rounded-xl overflow-hidden cursor-pointer hover:border-accent-gold/45 transition-all duration-300 hover:scale-[1.01]"
		>
			{/* Poster Image Frame */}
			<div className="relative aspect-[2/3] w-full overflow-hidden bg-surface-dark">
				{item.mediaType === "tv" && (
					<span className="absolute top-3 left-3 z-10 px-2.5 py-0.5 bg-accent-red text-bg-dark text-xxs font-bebas tracking-wider rounded uppercase font-bold">
						TV
					</span>
				)}
				<img
					src={posterUrl}
					alt={title}
					loading="lazy"
					className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
				/>
			</div>

			{/* Metadata Panel */}
			<div className="p-3.5 flex flex-col justify-between flex-grow gap-1">
				<h3 className="text-text-light font-display text-base font-semibold line-clamp-1 group-hover:text-accent-gold transition-colors">
					{title}
				</h3>
				<div className="flex items-center justify-between text-xs text-dim-gold font-sans">
					<span>{year || "N/A"}</span>
					<span className="text-accent-gold font-medium">★ {rating}</span>
				</div>
			</div>
		</div>
	);
};
