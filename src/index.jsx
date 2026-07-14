import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./assets/main.css";

const TRENDING = [
	"Inception",
	"Interstellar",
	"The Dark Knight",
	"Breaking Bad",
	"Game of Thrones",
	"Parasite",
	"Oppenheimer",
	"The Bear",
];
const FILTERS = ["All", "Movies", "TV Shows"];
const COUNTRIES = [
	{ code: "NG", name: "Nigeria" },
	{ code: "US", name: "United States" },
	{ code: "GB", name: "United Kingdom" },
	{ code: "CA", name: "Canada" },
	{ code: "AU", name: "Australia" },
	{ code: "ZA", name: "South Africa" },
	{ code: "IN", name: "India" },
];

// TMDB key is hardcoded directly here since this is a static frontend-only
// app deployed on GitHub Pages with no backend to hide it behind. It will be
// visible in the deployed JS bundle — that's expected and fine for TMDB's
// rate-limited public API.
const TMDB_API_KEY = "d42f71e99226be1c6e1e4714c346330d";
const TMDB_BASE = "https://api.themoviedb.org/3";

async function searchTMDB(query, mediaType) {
	if (!query || !query.trim()) return [];

	// map UI filter to TMDB search type
	let type = "multi";
	if (mediaType === "Movies") type = "movie";
	else if (mediaType === "TV Shows") type = "tv";

	try {
		const res = await fetch(
			`${TMDB_BASE}/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`,
		);
		const data = await res.json();
		const results = data.results || [];

		if (type === "movie") {
			return results.map((item) => ({ ...item, media_type: "movie" }));
		}

		if (type === "tv") {
			return results.map((item) => ({ ...item, media_type: "tv" }));
		}

		return results
			.filter((item) => item.media_type !== "person")
			.map((item) => ({
				...item,
				media_type: item.media_type || (item.title ? "movie" : "tv"),
			}));
	} catch (e) {
		console.error("TMDB search failed", e);
		return [];
	}
}

const posterUrl = (path) =>
	path ? `https://image.tmdb.org/t/p/w342${path}` : null;

async function fetchWatchProviders(id, mediaType, countryCode) {
	const endpoint = mediaType === "tv" ? "tv" : "movie";
	try {
		const res = await fetch(
			`${TMDB_BASE}/${endpoint}/${id}/watch/providers?api_key=${TMDB_API_KEY}`,
		);
		const data = await res.json();
		return data.results?.[countryCode] || null;
	} catch (e) {
		console.error("watch providers fetch failed", e);
		return null;
	}
}

function getProviderBuckets(providers) {
	if (!providers) return { streaming: [], rent: [], buy: [] };

	return {
		streaming: providers.flatrate || [],
		rent: providers.rent || [],
		buy: providers.buy || [],
	};
}

function ProviderRow({ title, items, href }) {
	if (!items || items.length === 0) return null;

	return (
		<div className="provider-group">
			<div className="provider-group-title-row">
				<div className="provider-group-title">{title}</div>
				{href && (
					<a
						className="provider-group-link"
						href={href}
						target="_blank"
						rel="noreferrer"
					>
						Open watch options
					</a>
				)}
			</div>
			<div className="provider-pills">
				{items.map((provider) =>
					href ? (
						<a
							key={`${title}-${provider.provider_id}`}
							className="provider-pill"
							href={href}
							target="_blank"
							rel="noreferrer"
							title={`Open watch options for ${provider.provider_name}`}
						>
							{provider.logo_path ? (
								<img
									className="provider-logo"
									src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
									alt={provider.provider_name}
								/>
							) : (
								<span className="provider-fallback">▶</span>
							)}
							<span>{provider.provider_name}</span>
						</a>
					) : (
						<div
							key={`${title}-${provider.provider_id}`}
							className="provider-pill"
						>
							{provider.logo_path ? (
								<img
									className="provider-logo"
									src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
									alt={provider.provider_name}
								/>
							) : (
								<span className="provider-fallback">▶</span>
							)}
							<span>{provider.provider_name}</span>
						</div>
					),
				)}
			</div>
		</div>
	);
}

export default function MovieSearch() {
	const [query, setQuery] = useState("");
	const [filter, setFilter] = useState("All");
	const [country, setCountry] = useState("NG");
	const [results, setResults] = useState([]);
	const [selected, setSelected] = useState(null);
	const [providers, setProviders] = useState(null);
	const [providersLoading, setProvidersLoading] = useState(false);
	const [trailer, setTrailer] = useState(null);
	const [trailerLoading, setTrailerLoading] = useState(false);
	const [trailerError, setTrailerError] = useState("");
	const [trailerOpen, setTrailerOpen] = useState(false);
	const [searched, setSearched] = useState(false);
	const [loading, setLoading] = useState(false);
	const [contactOpen, setContactOpen] = useState(false);

	useEffect(() => {
		let isActive = true;

		if (!selected) {
			setProviders(null);
			setProvidersLoading(false);
			setTrailer(null);
			setTrailerLoading(false);
			setTrailerError("");
			setTrailerOpen(false);
			return undefined;
		}

		setProviders(null);
		setProvidersLoading(true);
		setTrailer(null);
		setTrailerLoading(false);
		setTrailerError("");
		setTrailerOpen(false);

		fetchWatchProviders(selected.id, selected.media_type, country)
			.then((data) => {
				if (!isActive) return;
				setProviders(data);
			})
			.finally(() => {
				if (isActive) setProvidersLoading(false);
			});

		return () => {
			isActive = false;
		};
	}, [selected, country]);

	const fetchTrailer = async () => {
		if (!selected || trailerLoading) return;

		setTrailerLoading(true);
		setTrailerError("");

		try {
			const endpoint = selected.media_type === "tv" ? "tv" : "movie";
			const res = await fetch(
				`${TMDB_BASE}/${endpoint}/${selected.id}/videos?api_key=${TMDB_API_KEY}&language=en-US`,
			);
			const data = await res.json();
			const videos = Array.isArray(data.results) ? data.results : [];
			const trailerVideo =
				videos.find(
					(video) =>
						video.site === "YouTube" &&
						/trailer|teaser/i.test(video.type || ""),
				) || videos.find((video) => video.site === "YouTube");

			if (trailerVideo) {
				setTrailer(trailerVideo);
				setTrailerOpen(true);
			} else {
				setTrailerError("No trailer found for this title.");
				setTrailerOpen(false);
			}
		} catch (error) {
			console.error("trailer fetch failed", error);
			setTrailerError("Unable to load trailer right now.");
			setTrailerOpen(false);
		} finally {
			setTrailerLoading(false);
		}
	};

	const doSearch = async (q) => {
		if (!q.trim()) {
			setSearched(false);
			setResults([]);
			return;
		}
		setLoading(true);
		setSearched(true);
		const data = await searchTMDB(q, filter);
		setResults(data);
		setLoading(false);
	};

	const handleQueryChange = (e) => {
		const nextQuery = e.target.value;
		setQuery(nextQuery);

		if (!nextQuery.trim()) {
			setSearched(false);
			setResults([]);
			setSelected(null);
			setProviders(null);
			setProvidersLoading(false);
		}
	};

	const handleSearch = () => doSearch(query);
	const handleKey = (e) => e.key === "Enter" && doSearch(query);

	const pickRandom = async () => {
		try {
			if (query.trim() && results && results.length > 0) {
				const choice = results[Math.floor(Math.random() * results.length)];
				setSelected(choice);
				return;
			}

			const seed = TRENDING[Math.floor(Math.random() * TRENDING.length)];
			setQuery(seed);
			setLoading(true);
			const data = await searchTMDB(seed, filter);
			setResults(data);
			setLoading(false);
			if (data && data.length > 0) {
				const choice = data[Math.floor(Math.random() * data.length)];
				setSelected(choice);
			}
		} catch (err) {
			console.error("Surprise pick failed", err);
			setLoading(false);
		}
	};

	return (
		<>
			<style>{STYLES}</style>
			<div className="app">
				<header className="header">
					<div className="logo">
						<span className="logo-dot"></span>Movie<span>Search</span>.io
					</div>
					<div className="contact-wrap">
						<button
							className="contact-button"
							onClick={() => setContactOpen((open) => !open)}
						>
							<strong>Contact the developer</strong>
							<span className="chev">{contactOpen ? "▲" : "▼"}</span>
						</button>
						{contactOpen && (
							<div className="contact-menu">
								<div className="contact-menu-title">Reach out</div>
								<a
									className="contact-link whatsapp"
									href="https://wa.me/2349155020087"
									target="_blank"
									rel="noreferrer"
									onClick={() => setContactOpen(false)}
								>
									WhatsApp 2349155020087
								</a>
								<a
									className="contact-link email"
									href="mailto:chidumebiebelebe@gmail.com"
									onClick={() => setContactOpen(false)}
								>
									Email chidumebiebelebe@gmail.com
								</a>
							</div>
						)}
					</div>
				</header>

				<div className="hero">
					<h1 className="hero-title">
						Find your next <span className="caps">BIG SCREEN</span> night.
					</h1>
					<p className="hero-sub">
						Type in a movie or show and see what should play next.
					</p>
					<div className="search-wrap">
						<input
							className="search-input"
							placeholder="Try 'Inception' or 'Breaking Bad'..."
							value={query}
							onChange={handleQueryChange}
							onKeyDown={handleKey}
							disabled={loading}
						/>
						<button
							className="search-btn"
							onClick={handleSearch}
							disabled={loading}
						>
							{loading ? "⏳" : "🔍"}
						</button>
					</div>
					<div className="filters">
						{FILTERS.map((f) => (
							<button
								key={f}
								className={`filter-btn${filter === f ? " active" : ""}`}
								onClick={() => setFilter(f)}
							>
								{f}
							</button>
						))}
					</div>
					<div
						style={{
							marginTop: 12,
							display: "flex",
							justifyContent: "center",
							gap: 10,
							flexWrap: "wrap",
						}}
					>
						<button className="surprise-btn" onClick={pickRandom}>
							🎲 Surprise me
						</button>
						<div className="region-picker">
							<label htmlFor="country-select">Country</label>
							<select
								id="country-select"
								className="region-select"
								value={country}
								onChange={(e) => setCountry(e.target.value)}
							>
								{COUNTRIES.map((item) => (
									<option key={item.code} value={item.code}>
										{item.name}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>

				<div className="results-section">
					{!searched && (
						<>
							<p className="section-label">Coming attractions</p>
							<div className="trending-strip">
								{TRENDING.map((t) => (
									<button
										key={t}
										className="trending-pill"
										onClick={() => {
											setQuery(t);
											doSearch(t);
										}}
									>
										🔥 {t}
									</button>
								))}
							</div>
						</>
					)}

					{loading && (
						<div className="state-msg">
							<div className="spinner"></div>
							<p>Searching…</p>
						</div>
					)}

					{!loading && searched && results.length === 0 && (
						<div className="state-msg">
							<span className="icon">🎟️</span>
							<p>
								No results for <strong>"{query}"</strong>.
							</p>
						</div>
					)}

					{results.length > 0 && (
						<>
							<p className="results-label">
								<strong>{results.length}</strong> results for "{query}".
							</p>
							<div className="grid">
								{results.map((item, i) => {
									const poster = posterUrl(item.poster_path);
									const title = item.title || item.name;
									const year = (
										item.release_date ||
										item.first_air_date ||
										""
									).slice(0, 4);
									const rating = item.vote_average
										? Number(item.vote_average).toFixed(1)
										: "N/A";
									return (
										<div
											key={`${item.id}-${i}`}
											className="movie-card"
											onClick={() => setSelected(item)}
										>
											{item.media_type === "tv" && (
												<span className="badge">TV</span>
											)}
											{poster ? (
												<img
													className="movie-poster"
													src={poster}
													alt={title}
													onError={(e) => {
														e.target.style.display = "none";
													}}
												/>
											) : null}
											<div
												className="poster-placeholder"
												style={{ display: poster ? "none" : "flex" }}
											>
												🎬
											</div>
											<div className="movie-info">
												<div className="movie-title">{title}</div>
												<div className="movie-meta">
													<span className="movie-year">{year}</span>
													<span className="movie-rating">★ {rating}</span>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</>
					)}
				</div>

				{selected && (
					<div
						className="detail-overlay"
						onClick={(e) => e.target === e.currentTarget && setSelected(null)}
					>
						<div className="detail-panel">
							<div className="backdrop-placeholder">🎬</div>
							<div className="detail-body">
								<div className="detail-header">
									<h2 className="detail-title">
										{selected.title || selected.name}
									</h2>
									<button
										className="close-btn"
										onClick={() => setSelected(null)}
									>
										✕
									</button>
								</div>
								<div className="detail-chips">
									<span className="chip">
										{(
											selected.release_date ||
											selected.first_air_date ||
											""
										).slice(0, 4)}
									</span>
									<span className="chip accent">
										{selected.media_type === "tv" ? "TV Show" : "Movie"}
									</span>
								</div>
								<div className="section-label">Overview</div>
								<p className="detail-plot">
									{selected.overview || "No overview available."}
								</p>
								<div className="detail-actions">
									<button
										className="trailer-btn"
										onClick={fetchTrailer}
										disabled={trailerLoading}
									>
										{trailerLoading
											? "Loading trailer…"
											: trailerOpen
												? "Refresh trailer"
												: "Play trailer"}
									</button>
									{trailerOpen && (
										<button
											className="trailer-btn secondary"
											onClick={() => setTrailerOpen(false)}
										>
											Hide trailer
										</button>
									)}
								</div>
								{(trailerOpen || trailerError) && (
									<div className="trailer-panel">
										<div className="trailer-panel-header">
											<div className="trailer-panel-title">Trailer</div>
											{trailer && (
												<a
													className="provider-group-link"
													href={`https://www.youtube.com/watch?v=${trailer.key}`}
													target="_blank"
													rel="noreferrer"
												>
													Open on YouTube
												</a>
											)}
										</div>
										{trailerOpen && trailer ? (
											<iframe
												className="trailer-frame"
												src={`https://www.youtube.com/embed/${trailer.key}?rel=0&modestbranding=1`}
												title={`${selected.title || selected.name} trailer`}
												allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
												allowFullScreen
											/>
										) : (
											<div className="trailer-state">
												{trailerError ||
													"Pick a title with an available trailer."}
											</div>
										)}
									</div>
								)}
								<div className="section-label">Where to watch</div>
								<p className="detail-availability-note">
									Availability is checked for{" "}
									{COUNTRIES.find((item) => item.code === country)?.name ||
										country}
									. If no services appear, TMDB does not currently list
									providers for that title in this region.
								</p>
								{providersLoading && (
									<p className="detail-availability-note">
										Checking streaming services…
									</p>
								)}
								{!providersLoading && providers && (
									<div className="provider-list">
										<ProviderRow
											title="Streaming"
											items={getProviderBuckets(providers).streaming}
											href={providers.link}
										/>
										<ProviderRow
											title="Rent"
											items={getProviderBuckets(providers).rent}
											href={providers.link}
										/>
										<ProviderRow
											title="Buy"
											items={getProviderBuckets(providers).buy}
											href={providers.link}
										/>
									</div>
								)}
								{!providersLoading && !providers && (
									<p className="detail-availability-note">
										No provider data found for this title right now.
									</p>
								)}
								<div className="stats-row">
									<div className="stat">
										<span className="stat-value">
											{selected.vote_average
												? Number(selected.vote_average).toFixed(1)
												: "N/A"}
										</span>
										<span className="stat-label">Rating</span>
									</div>
									<div className="stat">
										<span className="stat-value">
											{selected.vote_count
												? (selected.vote_count / 1000).toFixed(1) + "k"
												: "No votes yet"}
										</span>
										<span className="stat-label">Votes</span>
									</div>
									<div className="stat">
										<span className="stat-value">
											{(selected.popularity || 0).toFixed(0)}
										</span>
										<span className="stat-label">Popularity</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
}

const rootElement = document.getElementById("root");
if (rootElement) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<React.StrictMode>
			<MovieSearch />
		</React.StrictMode>,
	);
}
