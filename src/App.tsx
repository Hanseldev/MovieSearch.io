import { useState, useEffect, useRef } from "react";
import {
	searchTMDB,
	fetchWatchProviders,
	fetchTrailerVideo,
} from "./services/tmdb";
import type { MediaItem } from "./types";
import { Pill } from "./components/Pill";

export default function App() {
	const [isContactOpen, setIsContactOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close the dropdown when clicking outside of it
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

	return (
		<main className="min-h-screen relative flex flex-col">
			<header className="flex items-center justify-between bg-card-dark/20 p-4 md:py-8 md:px-8">
				<h1 className="tracking-wide md:text-3xl font-semibold font-display">
					MovieSearch.IO
				</h1>

				{/* Dropdown container */}
				<div className="relative" ref={dropdownRef}>
					<Pill
						label="Contact the developer"
						isActive={isContactOpen}
						onClick={() => setIsContactOpen((prev) => !prev)}
					/>

					{/* Animated Dropdown Menu */}
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
		</main>
	);
}
