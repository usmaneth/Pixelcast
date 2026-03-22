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
			className="border-b border-white/[0.03] bg-transparent relative"
			style={{ ...rowWrapperStyle, minHeight: 44, marginBottom: 2 }}
		>
			{label && (
				<div
					className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[10px] font-mono uppercase tracking-wider z-20 pointer-events-none select-none text-white/20"
					style={labelColor ? { color: labelColor } : undefined}
				>
					{label}
				</div>
			)}
			{isEmpty && hint && (
				<div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10">
					<span className="text-[10px] text-white/10 font-mono">{hint}</span>
				</div>
			)}
			<div ref={setNodeRef} style={rowStyle}>
				{children}
			</div>
		</div>
	);
}
