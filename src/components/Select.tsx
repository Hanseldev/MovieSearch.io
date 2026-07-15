import type { FC, SelectHTMLAttributes } from "react";

interface Option {
	value: string;
	label: string;
}

interface SelectProps extends Omit<
	SelectHTMLAttributes<HTMLSelectElement>,
	"onChange"
> {
	label?: string;
	options: readonly Option[];
	value: string;
	onChange: (value: string) => void;
}

export const Select: FC<SelectProps> = ({
	label,
	options,
	value,
	onChange,
	className = "",
	id,
	...props
}) => {
	return (
		<div className="flex items-center gap-2">
			{label && (
				<label
					htmlFor={id}
					className="text-muted-gold text-xs font-semibold uppercase tracking-wider"
				>
					{label}
				</label>
			)}
			<select
				id={id}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className={`bg-surface-dark text-text-light text-sm border border-dim-gold/20 rounded-lg px-3 py-1.5 focus:outline-none focus:border-accent-gold transition-colors cursor-pointer ${className}`}
				{...props}
			>
				{options.map((opt) => (
					<option key={opt.value} value={opt.value}>
						{opt.label}
					</option>
				))}
			</select>
		</div>
	);
};
