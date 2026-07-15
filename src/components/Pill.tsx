import type { FC } from "react";

interface PillProps {
	label: string;
	isActive?: boolean;
	onClick: () => void;
	prefix?: string;
}

export const Pill: FC<PillProps> = ({
	label,
	isActive = false,
	onClick,
	prefix,
}) => {
	return (
		<button
			onClick={onClick}
			className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm md:text-lg font-medium transition-all duration-200 cursor-pointer border ${
				isActive
					? "bg-card-dark border-dim-gold text-dim-gold shadow-sm"
					: "bg-surface-dark border-dim-gold/10 text-muted-gold hover:text-text-light hover:border-dim-gold/30"
			}`}
		>
			{prefix && <span>{prefix}</span>}
			{label}
		</button>
	);
};
