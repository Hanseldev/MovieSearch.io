import type { FC } from "react";
import { Button } from "./Button";
import type { MediaItem } from "../types";

interface MovieDetailModalProps {
	item: MediaItem | null;
	onClose: () => void;
}

export const MovieDetailModal: FC<MovieDetailModalProps> = ({
	item,
	onClose,
}) => {
	if (!item) return null;

	const title = item.title || item.name || "Unknown Title";
	const year = (item.releaseDate || item.firstAirDate || "").slice(0, 4);
	const rating = item.voteAverage ? item.voteAverage.toFixed(1) : "N/A";

	const posterUrl = item.posterPath
		? `https://image.tmdb.org/t/p/w780${item.posterPath}`
		: "https://placehold.co/780x1170/1e1e1e/938f99?text=No+Poster";

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-dark/85 backdrop-blur-sm transition-opacity duration-300">
			{/* Modal Container */}
			<div
				className="relative w-full max-w-2xl bg-surface-dark border border-dim-gold/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-none"
				role="dialog"
				aria-modal="true"
			>
				{/* Close Button */}
				<button
					onClick={onClose}
					className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-bg-dark/60 text-text-light hover:bg-bg-dark hover:text-accent-gold transition-all duration-200 cursor-pointer"
					aria-label="Close modal"
				>
					✕
				</button>

				{/* Visual Poster Cover */}
				<div className="w-full md:w-2/5 aspect-[2/3] md:aspect-auto md:h-auto bg-card-dark relative overflow-hidden">
					<img
						src={posterUrl}
						alt={title}
						className="w-full h-full object-cover"
					/>
					{item.mediaType === "tv" && (
						<span className="absolute top-4 left-4 z-10 px-3 py-1 bg-accent-red text-bg-dark text-xs font-bebas tracking-wider rounded font-bold shadow-md">
							TV SERIES
						</span>
					)}
				</div>

				{/* Details Context Panel */}
				<div className="p-6 md:p-8 w-full md:w-3/5 flex flex-col justify-between overflow-y-auto">
					<div className="space-y-4">
						<div>
							<span className="text-xs font-bold text-accent-gold uppercase tracking-wider font-sans">
								{year || "Release Unknown"}
							</span>
							<h2 className="text-2xl md:text-3xl font-display font-bold text-text-light mt-1 tracking-tight leading-tight">
								{title}
							</h2>
						</div>

						{/* Ratings & Metadata */}
						<div className="flex items-center gap-4 text-sm text-muted-gold font-sans">
							<span className="flex items-center gap-1.5 text-accent-gold font-semibold">
								★ {rating}{" "}
								<span className="text-dim-gold text-xs font-normal">/ 10</span>
							</span>
							<span className="w-1.5 h-1.5 rounded-full bg-dim-gold/40" />
							<span className="capitalize">{item.mediaType || "movie"}</span>
						</div>

						{/* Real Description Overview */}
						<p className="text-sm text-muted-gold leading-relaxed font-sans">
							{item.overview || "No description available for this title."}
						</p>
					</div>

					{/* Action Buttons */}
					<div className="flex gap-3 pt-6 border-t border-dim-gold/5 mt-6">
						<Button
							variant="accent"
							onClick={() => alert(`Streaming availability for ${title}`)}
							className="flex-1 font-bold text-sm"
						>
							Check Availability
						</Button>
						<Button
							variant="secondary"
							onClick={onClose}
							className="px-5 text-sm"
						>
							Close
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};
