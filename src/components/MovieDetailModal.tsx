import { useState, useEffect, type FC } from "react";
import { Button } from "./Button";
import type { MediaItem, ProviderResult, TrailerVideo } from "../types";
import {
	fetchWatchProviders,
	fetchTrailerVideo,
	getProviderLogoUrl,
} from "../services/tmdb";

interface MovieDetailModalProps {
	item: MediaItem | null;
	countryCode: string;
	onClose: () => void;
}

export const MovieDetailModal: FC<MovieDetailModalProps> = ({
	item,
	countryCode,
	onClose,
}) => {
	const [providers, setProviders] = useState<ProviderResult | null>(null);
	const [trailer, setTrailer] = useState<TrailerVideo | null>(null);
	const [loadingDetails, setLoadingDetails] = useState(false);

	useEffect(() => {
		if (!item) return;

		const loadMediaDetails = async () => {
			setLoadingDetails(true);
			try {
				const [providersData, trailerData] = await Promise.all([
					fetchWatchProviders(
						item.id,
						item.mediaType as "movie" | "tv",
						countryCode,
					),
					fetchTrailerVideo(item.id, item.mediaType as "movie" | "tv"),
				]);
				setProviders(providersData);
				setTrailer(trailerData);
			} catch (error) {
				console.error("Error loading detail modal data:", error);
			} finally {
				setLoadingDetails(false);
			}
		};

		loadMediaDetails();
	}, [item, countryCode]);

	if (!item) return null;

	const title = item.title || item.name || "Unknown Title";
	const year = (item.releaseDate || item.firstAirDate || "").slice(0, 4);
	const rating = item.voteAverage ? item.voteAverage.toFixed(1) : "N/A";

	const posterUrl = item.posterPath
		? `https://image.tmdb.org/t/p/w780${item.posterPath}`
		: "https://placehold.co/780x1170/1e1e1e/938f99?text=No+Poster";

	// Flatten streaming, renting, and buying options to show them inside the modal
	const streams = providers?.streaming || [];
	const rents = providers?.rent || [];
	const buys = providers?.buy || [];

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-dark/85 backdrop-blur-sm transition-opacity duration-300">
			{/* Modal Container */}
			<div
				className="relative w-full max-w-3xl bg-surface-dark border border-dim-gold/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]"
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
				<div className="w-full md:w-[40%] aspect-2/3 md:aspect-auto md:h-auto bg-card-dark relative overflow-hidden">
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
				<div className="p-6 md:p-8 w-full md:w-[60%] flex flex-col justify-between overflow-y-auto">
					<div className="space-y-6">
						<div>
							<span className="text-xs font-bold text-accent-gold uppercase tracking-wider font-sans">
								{year || "Release Unknown"}
							</span>
							<h2 className="text-2xl md:text-3xl font-display font-bold text-text-light mt-1 tracking-tight leading-tight">
								{title}
							</h2>
						</div>

						{/* Ratings & Metadata */}
						<div className="flex items-center gap-4 text-sm text-dim-gold font-sans">
							<span className="flex items-center gap-1.5 text-accent-gold font-semibold">
								★ {rating}{" "}
								<span className="text-dim-gold/60 text-xs font-normal">
									/ 10
								</span>
							</span>
							<span className="w-1.5 h-1.5 rounded-full bg-dim-gold/40" />
							<span className="capitalize">{item.mediaType || "movie"}</span>
						</div>

						{/* Real Description Overview */}
						<p className="text-sm text-dim-gold leading-relaxed font-sans max-h-32 overflow-y-auto pr-1">
							{item.overview || "No description available for this title."}
						</p>

						{/* Watch Providers Sections */}
						<div className="space-y-4 pt-2 border-t border-dim-gold/10">
							{loadingDetails ? (
								<p className="text-xs text-dim-gold animate-pulse">
									Loading watch options...
								</p>
							) : !providers ||
							  (!streams.length && !rents.length && !buys.length) ? (
								<p className="text-xs text-dim-gold/60 italic">
									No streaming providers registered for region "{countryCode}".
								</p>
							) : (
								<div className="space-y-3">
									{streams.length > 0 && (
										<div className="flex flex-col gap-1.5">
											<span className="text-[11px] font-bold uppercase tracking-wider text-accent-gold">
												Stream on:
											</span>
											<div className="flex flex-wrap gap-2">
												{streams.map((p) => (
													<div
														key={p.providerId}
														className="flex items-center gap-1.5 bg-card-dark/60 p-1 pr-2.5 rounded-lg border border-dim-gold/5"
														title={p.providerName}
													>
														<img
															src={getProviderLogoUrl(p.logoPath) || ""}
															alt={p.providerName}
															className="w-5 h-5 rounded-md object-cover"
														/>
														<span className="text-xxs font-medium text-text-light">
															{p.providerName}
														</span>
													</div>
												))}
											</div>
										</div>
									)}

									{(rents.length > 0 || buys.length > 0) && (
										<div className="flex flex-col gap-1.5">
											<span className="text-[11px] font-bold uppercase tracking-wider text-dim-gold">
												Rent/Buy:
											</span>
											<div className="flex flex-wrap gap-2">
												{[...rents, ...buys]
													.reduce((acc: any[], current) => {
														if (
															!acc.some(
																(x) => x.providerId === current.providerId,
															)
														) {
															acc.push(current);
														}
														return acc;
													}, [])
													.slice(0, 5)
													.map((p) => (
														<div
															key={p.providerId}
															className="flex items-center gap-1.5 bg-card-dark/40 p-1 pr-2.5 rounded-lg border border-dim-gold/5"
															title={p.providerName}
														>
															<img
																src={getProviderLogoUrl(p.logoPath) || ""}
																alt={p.providerName}
																className="w-5 h-5 rounded-md object-cover"
															/>
															<span className="text-xxs font-medium text-dim-gold">
																{p.providerName}
															</span>
														</div>
													))}
											</div>
										</div>
									)}
								</div>
							)}
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex gap-3 pt-6 border-t border-dim-gold/5 mt-6">
						{trailer ? (
							<a
								href={`https://www.youtube.com/watch?v=${trailer.key}`}
								target="_blank"
								rel="noopener noreferrer"
								className="flex-1"
							>
								<Button
									variant="accent"
									onClick={() => {}}
									className="w-full font-bold text-sm h-full flex items-center justify-center"
								>
									Watch Trailer
								</Button>
							</a>
						) : (
							<Button
								variant="accent"
								disabled
								onClick={() => {}}
								className="flex-1 font-bold text-sm opacity-50 cursor-not-allowed"
							>
								Trailer Unavailable
							</Button>
						)}
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
