import { useState, useEffect } from "react";
import { searchTMDB, fetchWatchProviders, fetchTrailerVideo } from "./services/tmdb";
import type { MediaItem } from "./types";

export default function App() {
    // Layout state goes here

    return (
        <main className="min-h-screen relative flex flex-col">
            <header className="flex items-center justify-between bg-card-dark/20 py-4 px-8">
                <h1 className="tracking-widest text-3xl ">MovieSearch.IO</h1>
            </header>
        </main>
    );
}