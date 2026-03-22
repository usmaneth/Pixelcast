import type { RowDefinition } from "dnd-timeline";
import { useRow } from "dnd-timeline";

interface RowProps extends RowDefinition {
	children: React.ReactNode;
	label?: string;
	hint?: string;
	isEmpty?: boolean;
	labelColor?: string;
}

export default function Row({ id, children, label, hint, isEmpty, labelColor }: RowProps) {
	const { setNodeRef, rowWrapperStyle, rowStyle } = useRow({ id });

	return (
		<div
			className="border-b border-white/[0.02] bg-transparent relative"
			style={{ ...rowWrapperStyle, minHeight: 32, marginBottom: 0 }}
		>
			{label && (
				<div
					className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[8px] font-mono uppercase tracking-wider z-20 pointer-events-none select-none text-white/15"
					style={labelColor ? { color: labelColor } : undefined}
				>
					{label}
				</div>
			)}
			{isEmpty && hint && (
				<div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10">
					<span className="text-[9px] text-white/[0.08] font-mono">{hint}</span>
				</div>
			)}
			<div ref={setNodeRef} style={rowStyle}>
				{children}
			</div>
		</div>
	);
}
