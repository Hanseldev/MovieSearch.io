import type { FC, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "accent";
}

export const Button: FC<ButtonProps> = ({
	children,
	variant = "primary",
	className = "",
	...props
}) => {
	const baseStyles =
		"inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

	const variants = {
		primary:
			// "bg-amber-400 text-zinc-950 hover:bg-amber-300 px-5 py-2.5 shadow-md shadow-amber-400/10",
            "bg-card-dark py-2 px-6 shadow-md hover:shadow-surface-dark hover:bg-card-dark/50 transition-all duration-200",
		secondary: "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 px-5 py-2.5",
		accent: "bg-red-600 text-white hover:bg-red-500 px-4 py-2 text-sm",
	};

	return (
		<button
			className={`${baseStyles} ${variants[variant]} ${className} bg-accent-red`}
			{...props}
		>
			{children}
		</button>
	);
};
