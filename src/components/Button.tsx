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
		"inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-text-light";

	const variants = {
		primary:
			"bg-card-dark py-2 px-6 shadow-md border border-accent-gold !text-accent-gold hover:shadow-surface-dark hover:bg-card-dark/50",
		secondary:
			"bg-surface-dark py-2 px-6 border border-dim-gold/20 hover:bg-card-dark hover:border-dim-gold/40",
		accent:
			"bg-accent-red text-bg-dark hover:bg-accent-red/80 py-2 px-4 text-sm font-bold shadow-md",
	};

	return (
		<button
			className={`${baseStyles} ${variants[variant]} ${className}`}
			{...props}
		>
			{children}
		</button>
	);
};
