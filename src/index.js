import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #050505;
    --surface: rgba(20, 12, 12, 0.68);
    --card: rgba(34, 18, 18, 0.7);
    --border: rgba(255, 209, 102, 0.16);
    --accent: #d62828;
    --accent2: #ffd166;
    --text: #f8f1e7;
    --muted: #d1af8b;
    --dim: #9b7b63;
  }

  body { background:
    radial-gradient(circle at top, rgba(255, 209, 102, 0.12) 0%, rgba(214,40,40,0.08) 22%, transparent 48%),
    radial-gradient(circle at 20% 20%, rgba(214,40,40,0.16) 0%, transparent 30%),
    linear-gradient(180deg, #160b0b 0%, #080808 46%, #000000 100%);
    color: var(--text); font-family: 'Inter', sans-serif; min-height: 100vh; }
  .app { min-height: 100vh; display: flex; flex-direction: column; }

  .header {
    padding: 24px 32px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255,209,102,0.16);
    background: linear-gradient(180deg, rgba(32, 16, 16, 0.7), rgba(8,8,8,0.38));
    box-shadow: 0 18px 42px rgba(0,0,0,0.34);
    position: relative;
    backdrop-filter: blur(18px) saturate(145%);
    -webkit-backdrop-filter: blur(18px) saturate(145%);
  }
  .header::after { content: ''; position: absolute; left: 0; right: 0; bottom: -1px; height: 2px; background: linear-gradient(90deg, transparent, rgba(255,209,102,0.65), rgba(214,40,40,0.8), rgba(255,209,102,0.65), transparent); }
  .logo { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; letter-spacing: 2.5px; color: var(--text); display: flex; align-items: center; gap: 6px; }
  .logo span { color: var(--accent); }
  .logo-dot { width: 8px; height: 8px; background: var(--accent2); border-radius: 50%; display: inline-block; margin-bottom: 2px; box-shadow: 0 0 10px rgba(255,209,102,0.5); }
  .contact-wrap { position: relative; display: flex; justify-content: flex-end; }
  .contact-button { display: inline-flex; align-items: center; gap: 10px; padding: 10px 16px; border-radius: 999px; border: 1px solid rgba(255,209,102,0.18); color: #fff7e1; text-decoration: none; font-size: 0.8rem; letter-spacing: 0.3px; background: rgba(255,255,255,0.04); box-shadow: inset 0 1px 0 rgba(255,255,255,0.07), 0 12px 26px rgba(0,0,0,0.2); backdrop-filter: blur(18px) saturate(150%); -webkit-backdrop-filter: blur(18px) saturate(150%); transition: transform 0.2s, border-color 0.2s, background 0.2s, color 0.2s; cursor: pointer; }
  .contact-button:hover { transform: translateY(-1px); border-color: rgba(255,209,102,0.42); background: rgba(255,209,102,0.1); }
  .contact-button strong { font-weight: 600; }
  .contact-button .chev { font-size: 0.72rem; color: var(--accent2); }
  .contact-menu { position: absolute; top: calc(100% + 10px); right: 0; width: 290px; padding: 12px; border-radius: 18px; border: 1px solid rgba(255,209,102,0.16); background: rgba(18, 10, 10, 0.78); box-shadow: 0 18px 36px rgba(0,0,0,0.3); backdrop-filter: blur(18px) saturate(150%); -webkit-backdrop-filter: blur(18px) saturate(150%); z-index: 10; }
  .contact-menu-title { font-size: 0.72rem; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }
  .contact-link { display: flex; align-items: center; gap: 10px; padding: 11px 12px; border-radius: 14px; border: 1px solid rgba(255,209,102,0.12); color: var(--text); text-decoration: none; font-size: 0.82rem; background: rgba(255,255,255,0.04); transition: background 0.2s, border-color 0.2s, transform 0.2s; }
  .contact-link:hover { background: rgba(255,209,102,0.08); border-color: rgba(255,209,102,0.34); transform: translateY(-1px); }
  .contact-link.whatsapp { color: #dfffe7; }
  .contact-link.email { color: #fff3d6; margin-top: 8px; }

  .hero { padding: 56px 32px 34px; text-align: center; max-width: 820px; margin: 0 auto; width: 100%; position: relative; }
  .hero::before { content: 'NOW SHOWING'; display: inline-block; font-family: 'Bebas Neue', sans-serif; letter-spacing: 4px; color: var(--accent2); font-size: 0.9rem; margin-bottom: 14px; text-shadow: 0 0 12px rgba(255,209,102,0.18); }
  .hero-title { font-family: 'DM Serif Display', serif; font-size: clamp(2rem, 5vw, 3.5rem); line-height: 1.1; margin-bottom: 12px; color: var(--text); text-align: center; }
  .hero-title .caps { font-style: normal; text-transform: uppercase; color: var(--accent2); text-shadow: 0 0 18px rgba(255,209,102,0.16); }
  .hero-sub { color: var(--muted); font-size: 1rem; margin-bottom: 34px; font-weight: 300; line-height: 1.7; }
  .search-wrap { position: relative; max-width: 620px; margin: 0 auto; }
  .search-input { width: 100%; background: rgba(19, 13, 13, 0.76); border: 1.5px solid rgba(255,209,102,0.16); border-radius: 16px; padding: 18px 60px 18px 22px; font-size: 1rem; color: var(--text); font-family: 'Inter', sans-serif; outline: none; transition: border-color 0.2s, box-shadow 0.2s, background 0.2s; backdrop-filter: blur(16px) saturate(150%); -webkit-backdrop-filter: blur(16px) saturate(150%); box-shadow: inset 0 1px 0 rgba(255,255,255,0.05), 0 16px 32px rgba(0,0,0,0.22); }
  .search-input:focus { border-color: var(--accent2); background: rgba(24, 15, 15, 0.88); box-shadow: 0 0 0 3px rgba(255,209,102,0.12), 0 16px 32px rgba(0,0,0,0.26); }
  .search-input::placeholder { color: var(--dim); }
  .search-btn { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: linear-gradient(180deg, rgba(230,57,70,0.95), rgba(183,31,42,0.95)); border: none; border-radius: 12px; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s, box-shadow 0.2s, transform 0.2s; color: #fff1d6; font-size: 1.1rem; box-shadow: 0 12px 24px rgba(214,40,40,0.22); }
  .search-btn:hover { transform: translateY(-50%) scale(1.02); background: linear-gradient(180deg, rgba(255,209,102,0.96), rgba(244,185,66,0.96)); color: #1a1111; }
  .search-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .filters { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-top: 18px; }
  .filter-btn { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,209,102,0.18); border-radius: 20px; padding: 6px 16px; font-size: 0.8rem; color: var(--muted); cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.2s; backdrop-filter: blur(12px) saturate(140%); -webkit-backdrop-filter: blur(12px) saturate(140%); }
  .filter-btn:hover, .filter-btn.active { background: rgba(214,40,40,0.35); border-color: rgba(255,209,102,0.38); color: #fff4d9; font-weight: 500; box-shadow: 0 8px 20px rgba(0,0,0,0.18); }

  .surprise-btn { background: linear-gradient(90deg, rgba(255,209,102,0.98), rgba(214,40,40,0.96)); color: #1a1111; border: none; padding: 8px 14px; border-radius: 14px; font-weight: 700; cursor: pointer; box-shadow: 0 10px 22px rgba(214,40,40,0.18); transition: transform 0.18s, box-shadow 0.18s; }
  .surprise-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(214,40,40,0.22); }

  .region-row { display: flex; justify-content: center; margin-top: 14px; }
  .region-picker { display: inline-flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 16px; border: 1px solid rgba(255,209,102,0.16); background: rgba(255,255,255,0.04); color: var(--text); backdrop-filter: blur(12px) saturate(140%); -webkit-backdrop-filter: blur(12px) saturate(140%); box-shadow: inset 0 1px 0 rgba(255,255,255,0.04); }
  .region-picker label { font-size: 0.72rem; letter-spacing: 1.3px; text-transform: uppercase; color: var(--muted); }
  .region-select { appearance: none; border: none; outline: none; background: transparent; color: var(--text); font: inherit; padding-right: 18px; cursor: pointer; }
  .region-select option { background: #160b0b; color: var(--text); }

  .results-section { flex: 1; padding: 0 32px 60px; max-width: 1200px; margin: 0 auto; width: 100%; }
  .results-label { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 2px; color: var(--muted); margin-bottom: 18px; }
  .results-label strong { color: var(--accent); font-weight: 600; }

  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 20px; }

  .movie-card { background: linear-gradient(180deg, rgba(34,18,18,0.75), rgba(18,11,11,0.78)); border-radius: 14px; overflow: hidden; cursor: pointer; border: 1px solid rgba(255,209,102,0.14); transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s; position: relative; backdrop-filter: blur(14px) saturate(145%); -webkit-backdrop-filter: blur(14px) saturate(145%); box-shadow: inset 0 1px 0 rgba(255,255,255,0.04); }
  .movie-card:hover { transform: translateY(-4px); border-color: rgba(255,209,102,0.5); box-shadow: 0 18px 34px rgba(0,0,0,0.22); }
  .movie-poster { width: 100%; aspect-ratio: 2/3; object-fit: cover; display: block; background: #261616; }
  .poster-placeholder { width: 100%; aspect-ratio: 2/3; background: linear-gradient(135deg, #2a1515, #120b0b); display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--accent2); font-size: 2rem; gap: 8px; }
  .poster-placeholder span { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); font-family: 'Inter', sans-serif; }
  .movie-info { padding: 12px; }
  .movie-title { font-size: 0.88rem; font-weight: 500; line-height: 1.3; margin-bottom: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .movie-meta { display: flex; justify-content: space-between; align-items: center; margin-top: 6px; }
  .movie-year { font-size: 0.75rem; color: var(--muted); }
  .movie-rating { display: flex; align-items: center; gap: 3px; font-size: 0.75rem; color: var(--accent2); font-weight: 600; }
  .badge { position: absolute; top: 8px; left: 8px; background: var(--accent); color: #fff1d6; font-size: 0.6rem; padding: 2px 7px; border-radius: 4px; font-weight: 600; text-transform: uppercase; box-shadow: 0 6px 16px rgba(214,40,40,0.18); z-index: 2; }

  .detail-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.72); z-index: 100; display: flex; align-items: flex-end; justify-content: center; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); padding: 20px; }
  .detail-panel { background: linear-gradient(180deg, rgba(21,16,16,0.76), rgba(13,9,9,0.9)); border-radius: 20px 20px 0 0; width: 100%; max-width: 720px; max-height: 90vh; overflow-y: auto; border: 1px solid rgba(255,209,102,0.12); border-bottom: none; scrollbar-width: none; backdrop-filter: blur(18px) saturate(150%); -webkit-backdrop-filter: blur(18px) saturate(150%); }
  .detail-panel::-webkit-scrollbar { display: none; }

  .detail-backdrop { width: 100%; height: 220px; object-fit: cover; object-position: center top; border-radius: 20px 20px 0 0; }
  .backdrop-placeholder { width: 100%; height: 220px; background: linear-gradient(135deg, rgba(214,40,40,0.92), rgba(17,17,17,0.9) 52%, rgba(255,209,102,0.88)); border-radius: 20px 20px 0 0; display: flex; align-items: center; justify-content: center; font-size: 4rem; color: #fff1d6; }
  .detail-body { padding: 24px 28px 36px; }
  .detail-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 16px; }
  .detail-title { font-family: 'DM Serif Display', serif; font-size: 1.8rem; line-height: 1.2; flex: 1; color: var(--text); }
  .close-btn { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,209,102,0.16); color: var(--muted); width: 36px; height: 36px; border-radius: 50%; font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.2s; backdrop-filter: blur(12px) saturate(140%); -webkit-backdrop-filter: blur(12px) saturate(140%); }
  .close-btn:hover { background: var(--accent); color: #fff1d6; border-color: var(--accent2); }

  .detail-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
  .chip { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,209,102,0.12); border-radius: 8px; padding: 4px 12px; font-size: 0.75rem; color: var(--text); backdrop-filter: blur(12px) saturate(140%); -webkit-backdrop-filter: blur(12px) saturate(140%); }
  .chip.accent { border-color: var(--accent2); color: var(--accent2); background: rgba(255,209,102,0.08); }

  .section-label { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 2px; color: var(--muted); margin-bottom: 8px; }
  .detail-plot { color: var(--text); font-size: 0.95rem; line-height: 1.7; margin-bottom: 24px; font-weight: 300; }

  .detail-availability-note { color: var(--muted); font-size: 0.84rem; line-height: 1.6; margin-bottom: 12px; }
  .detail-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 18px; }
  .trailer-btn { background: linear-gradient(90deg, rgba(214,40,40,0.96), rgba(255,209,102,0.92)); color: #1a1111; border: none; padding: 10px 14px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s; box-shadow: 0 10px 22px rgba(214,40,40,0.2); }
  .trailer-btn:hover { transform: translateY(-1px); box-shadow: 0 14px 28px rgba(214,40,40,0.24); }
  .trailer-btn.secondary { background: rgba(255,255,255,0.06); color: var(--text); border: 1px solid rgba(255,209,102,0.14); box-shadow: none; }
  .trailer-btn:disabled { opacity: 0.55; cursor: not-allowed; }
  .trailer-panel { margin-bottom: 22px; border-radius: 18px; overflow: hidden; border: 1px solid rgba(255,209,102,0.14); background: rgba(0,0,0,0.24); box-shadow: inset 0 1px 0 rgba(255,255,255,0.04); }
  .trailer-panel-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 14px; border-bottom: 1px solid rgba(255,209,102,0.12); }
  .trailer-panel-title { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1.8px; color: var(--accent2); }
  .trailer-frame { width: 100%; aspect-ratio: 16 / 9; border: 0; display: block; background: #000; }
  .trailer-state { padding: 16px 14px; color: var(--muted); font-size: 0.88rem; line-height: 1.6; }
  .provider-list { display: grid; gap: 14px; margin-bottom: 24px; }
  .provider-group { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,209,102,0.12); border-radius: 16px; padding: 14px; backdrop-filter: blur(14px) saturate(145%); -webkit-backdrop-filter: blur(14px) saturate(145%); box-shadow: inset 0 1px 0 rgba(255,255,255,0.04); }
  .provider-group-title-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 10px; }
  .provider-group-title { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 1.8px; color: var(--accent2); }
  .provider-group-link { font-size: 0.72rem; color: var(--muted); text-decoration: none; }
  .provider-group-link:hover { color: var(--accent2); }
  .provider-pills { display: flex; flex-wrap: wrap; gap: 10px; }
  .provider-pill { display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 999px; background: rgba(0,0,0,0.18); border: 1px solid rgba(255,255,255,0.08); color: var(--text); font-size: 0.8rem; text-decoration: none; transition: background 0.2s, border-color 0.2s, transform 0.2s; }
  .provider-pill:hover { background: rgba(255,209,102,0.08); border-color: rgba(255,209,102,0.34); transform: translateY(-1px); }
  .provider-logo { width: 22px; height: 22px; border-radius: 50%; object-fit: cover; background: rgba(255,255,255,0.08); }
  .provider-fallback { width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; background: rgba(255,209,102,0.12); color: var(--accent2); font-size: 0.7rem; }

  .stats-row { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 20px; }
  .stat { flex: 1; min-width: 80px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,209,102,0.12); border-radius: 12px; padding: 14px; text-align: center; backdrop-filter: blur(12px) saturate(140%); -webkit-backdrop-filter: blur(12px) saturate(140%); box-shadow: inset 0 1px 0 rgba(255,255,255,0.04); }
  .stat-value { font-family: 'Bebas Neue', sans-serif; font-size: 1.5rem; letter-spacing: 1px; color: var(--accent2); display: block; line-height: 1; }
  .stat-label { font-size: 0.65rem; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; display: block; }

  .state-msg { text-align: center; padding: 80px 20px; color: var(--muted); }
  .state-msg .icon { font-size: 3rem; margin-bottom: 16px; display: block; }
  .state-msg p { font-size: 1rem; line-height: 1.6; color: var(--text); }
  .state-msg strong { color: var(--text); font-weight: 500; }
  .spinner { width: 40px; height: 40px; border: 3px solid rgba(255,209,102,0.15); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 20px; box-shadow: 0 0 16px rgba(214,40,40,0.12); }
  .trending-strip { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 8px; scrollbar-width: none; margin-bottom: 32px; }
  .trending-strip::-webkit-scrollbar { display: none; }
  .trending-pill { flex-shrink: 0; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,209,102,0.14); border-radius: 20px; padding: 8px 16px; font-size: 0.8rem; color: var(--text); cursor: pointer; transition: all 0.2s; white-space: nowrap; backdrop-filter: blur(12px) saturate(140%); -webkit-backdrop-filter: blur(12px) saturate(140%); }
  .trending-pill:hover { border-color: var(--accent2); color: var(--accent2); background: rgba(255,209,102,0.08); }

  @keyframes spin { to { transform: rotate(360deg); } }
  @media (max-width: 600px) { .hero { padding: 40px 20px 28px; } .results-section { padding: 0 16px 40px; } .header { padding: 20px 20px 16px; } .detail-body { padding: 18px 18px 32px; } .grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 14px; } .detail-panel { max-width: 100%; border-radius: 20px 20px 0 0; } .detail-backdrop, .backdrop-placeholder { height: 220px; } }
`;

const TRENDING = ["Inception", "Interstellar", "The Dark Knight", "Breaking Bad", "Game of Thrones", "Parasite", "Oppenheimer", "The Bear"];
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
      `${TMDB_BASE}/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`
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
      .map((item) => ({ ...item, media_type: item.media_type || (item.title ? "movie" : "tv") }));
  } catch (e) {
    console.error("TMDB search failed", e);
    return [];
  }
}

const posterUrl = (path) => (path ? `https://image.tmdb.org/t/p/w342${path}` : null);

async function fetchWatchProviders(id, mediaType, countryCode) {
  const endpoint = mediaType === "tv" ? "tv" : "movie";
  try {
    const res = await fetch(
      `${TMDB_BASE}/${endpoint}/${id}/watch/providers?api_key=${TMDB_API_KEY}`
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
          <a className="provider-group-link" href={href} target="_blank" rel="noreferrer">
            Open watch options
          </a>
        )}
      </div>
      <div className="provider-pills">
        {items.map((provider) => (
          href ? (
            <a key={`${title}-${provider.provider_id}`} className="provider-pill" href={href} target="_blank" rel="noreferrer" title={`Open watch options for ${provider.provider_name}`}>
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
            <div key={`${title}-${provider.provider_id}`} className="provider-pill">
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
          )
        ))}
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
        `${TMDB_BASE}/${endpoint}/${selected.id}/videos?api_key=${TMDB_API_KEY}&language=en-US`
      );
      const data = await res.json();
      const videos = Array.isArray(data.results) ? data.results : [];
      const trailerVideo = videos.find(
        (video) => video.site === "YouTube" && /trailer|teaser/i.test(video.type || "")
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
          <div className="logo"><span className="logo-dot"></span>Movie<span>Search</span>.io</div>
          <div className="contact-wrap">
            <button className="contact-button" onClick={() => setContactOpen((open) => !open)}>
              <strong>Contact the developer</strong>
              <span className="chev">{contactOpen ? "▲" : "▼"}</span>
            </button>
            {contactOpen && (
              <div className="contact-menu">
                <div className="contact-menu-title">Reach out</div>
                <a className="contact-link whatsapp" href="https://wa.me/2349155020087" target="_blank" rel="noreferrer" onClick={() => setContactOpen(false)}>
                  WhatsApp 2349155020087
                </a>
                <a className="contact-link email" href="mailto:chidumebiebelebe@gmail.com" onClick={() => setContactOpen(false)}>
                  Email chidumebiebelebe@gmail.com
                </a>
              </div>
            )}
          </div>
        </header>

        <div className="hero">
          <h1 className="hero-title">Find your next <span className="caps">BIG SCREEN</span> night.</h1>
          <p className="hero-sub">Type in a movie or show and see what should play next.</p>
          <div className="search-wrap">
            <input className="search-input" placeholder="Try 'Inception' or 'Breaking Bad'..." value={query} onChange={handleQueryChange} onKeyDown={handleKey} disabled={loading} />
            <button className="search-btn" onClick={handleSearch} disabled={loading}>{loading ? "⏳" : "🔍"}</button>
          </div>
          <div className="filters">
            {FILTERS.map((f) => (
              <button key={f} className={`filter-btn${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>
                {f}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button className="surprise-btn" onClick={pickRandom}>🎲 Surprise me</button>
            <div className="region-picker">
              <label htmlFor="country-select">Country</label>
              <select id="country-select" className="region-select" value={country} onChange={(e) => setCountry(e.target.value)}>
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
                  <button key={t} className="trending-pill" onClick={() => { setQuery(t); doSearch(t); }}>
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
              <p>No results for <strong>"{query}"</strong>.</p>
            </div>
          )}

          {results.length > 0 && (
            <>
              <p className="results-label"><strong>{results.length}</strong> results for "{query}".</p>
              <div className="grid">
                {results.map((item, i) => {
                  const poster = posterUrl(item.poster_path);
                  const title = item.title || item.name;
                  const year = (item.release_date || item.first_air_date || "").slice(0, 4);
                  const rating = item.vote_average ? Number(item.vote_average).toFixed(1) : "N/A";
                  return (
                    <div key={`${item.id}-${i}`} className="movie-card" onClick={() => setSelected(item)}>
                      {item.media_type === "tv" && <span className="badge">TV</span>}
                      {poster ? (
                        <img className="movie-poster" src={poster} alt={title} onError={(e) => { e.target.style.display = "none"; }} />
                      ) : null}
                      <div className="poster-placeholder" style={{ display: poster ? "none" : "flex" }}>🎬</div>
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
          <div className="detail-overlay" onClick={(e) => e.target === e.currentTarget && setSelected(null)}>
            <div className="detail-panel">
              <div className="backdrop-placeholder">🎬</div>
              <div className="detail-body">
                <div className="detail-header">
                  <h2 className="detail-title">{selected.title || selected.name}</h2>
                  <button className="close-btn" onClick={() => setSelected(null)}>✕</button>
                </div>
                <div className="detail-chips">
                  <span className="chip">{(selected.release_date || selected.first_air_date || "").slice(0, 4)}</span>
                  <span className="chip accent">{selected.media_type === "tv" ? "TV Show" : "Movie"}</span>
                </div>
                <div className="section-label">Overview</div>
                <p className="detail-plot">{selected.overview || "No overview available."}</p>
                <div className="detail-actions">
                  <button className="trailer-btn" onClick={fetchTrailer} disabled={trailerLoading}>
                    {trailerLoading ? "Loading trailer…" : trailerOpen ? "Refresh trailer" : "Play trailer"}
                  </button>
                  {trailerOpen && (
                    <button className="trailer-btn secondary" onClick={() => setTrailerOpen(false)}>
                      Hide trailer
                    </button>
                  )}
                </div>
                {(trailerOpen || trailerError) && (
                  <div className="trailer-panel">
                    <div className="trailer-panel-header">
                      <div className="trailer-panel-title">Trailer</div>
                      {trailer && <a className="provider-group-link" href={`https://www.youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noreferrer">Open on YouTube</a>}
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
                      <div className="trailer-state">{trailerError || "Pick a title with an available trailer."}</div>
                    )}
                  </div>
                )}
                <div className="section-label">Where to watch</div>
                <p className="detail-availability-note">Availability is checked for {COUNTRIES.find((item) => item.code === country)?.name || country}. If no services appear, TMDB does not currently list providers for that title in this region.</p>
                {providersLoading && <p className="detail-availability-note">Checking streaming services…</p>}
                {!providersLoading && providers && (
                  <div className="provider-list">
                    <ProviderRow title="Streaming" items={getProviderBuckets(providers).streaming} href={providers.link} />
                    <ProviderRow title="Rent" items={getProviderBuckets(providers).rent} href={providers.link} />
                    <ProviderRow title="Buy" items={getProviderBuckets(providers).buy} href={providers.link} />
                  </div>
                )}
                {!providersLoading && !providers && (
                  <p className="detail-availability-note">No provider data found for this title right now.</p>
                )}
                <div className="stats-row">
                  <div className="stat">
                    <span className="stat-value">{selected.vote_average ? Number(selected.vote_average).toFixed(1) : "N/A"}</span>
                    <span className="stat-label">Rating</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{selected.vote_count ? (selected.vote_count / 1000).toFixed(1) + "k" : "No votes yet"}</span>
                    <span className="stat-label">Votes</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{(selected.popularity || 0).toFixed(0)}</span>
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
  root.render(<React.StrictMode><MovieSearch /></React.StrictMode>);
}
