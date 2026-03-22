import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "cmdk";
import {
	Download,
	Film,
	FolderOpen,
	Image,
	Mic,
	Pencil,
	Play,
	Redo2,
	Save,
	Scissors,
	Search,
	Timer,
	Undo2,
	Upload,
	ZoomIn,
} from "lucide-react";
import { useEffect, useRef } from "react";

export type CommandPaletteCallbacks = {
	onExportMp4: () => void;
	onExportGif: () => void;
	onAddZoomRegion: () => void;
	onAddTrimRegion: () => void;
	onAddSpeedRegion: () => void;
	onAddAnnotation: () => void;
	onPlayPause: () => void;
	onUndo: () => void;
	onRedo: () => void;
	onEnhanceAudio: () => void;
	onGenerateThumbnails: () => void;
	onSaveProject: () => void;
	onLoadProject: () => void;
	onOpenRecordingsFolder: () => void;
};

type CommandPaletteProps = {
	open: boolean;
	onClose: () => void;
} & CommandPaletteCallbacks;

function Kbd({ children }: { children: React.ReactNode }) {
	return (
		<kbd className="ml-auto text-[11px] font-mono text-white/30 bg-white/[0.06] px-1.5 py-0.5 rounded">
			{children}
		</kbd>
	);
}

export function CommandPalette({
	open,
	onClose,
	onExportMp4,
	onExportGif,
	onAddZoomRegion,
	onAddTrimRegion,
	onAddSpeedRegion,
	onAddAnnotation,
	onPlayPause,
	onUndo,
	onRedo,
	onEnhanceAudio,
	onGenerateThumbnails,
	onSaveProject,
	onLoadProject,
	onOpenRecordingsFolder,
}: CommandPaletteProps) {
	const overlayRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				e.preventDefault();
				onClose();
			}
		};
		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	}, [open, onClose]);

	if (!open) return null;

	const run = (action: () => void) => {
		onClose();
		action();
	};

	return (
		<div
			ref={overlayRef}
			className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[20vh]"
			onClick={(e) => {
				if (e.target === overlayRef.current) onClose();
			}}
		>
			<Command
				className="w-full max-w-md rounded-2xl overflow-hidden"
				style={{
					background: "#111113",
					border: "1px solid rgba(255,255,255,0.08)",
					boxShadow: "0 16px 64px rgba(0,0,0,0.6)",
				}}
				label="Command Palette"
			>
				<div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
					<Search className="w-4 h-4 text-white/30 flex-shrink-0" />
					<CommandInput
						placeholder="Type a command..."
						className="w-full bg-transparent text-white text-sm placeholder:text-white/30 outline-none border-none"
						autoFocus
					/>
				</div>

				<CommandList className="max-h-[320px] overflow-y-auto p-1.5">
					<CommandEmpty className="py-6 text-center text-sm text-white/30">
						No results found.
					</CommandEmpty>

					<CommandGroup
						heading="Actions"
						className="[&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-white/40 [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5"
					>
						<CommandItem
							onSelect={() => run(onExportMp4)}
							className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-white/80 cursor-pointer data-[selected=true]:bg-white/[0.04] transition-colors"
						>
							<Download className="w-4 h-4 text-white/40" />
							Export as MP4
							<Kbd>{"\u2318"}E</Kbd>
						</CommandItem>
						<CommandItem
							onSelect={() => run(onExportGif)}
							className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-white/80 cursor-pointer data-[selected=true]:bg-white/[0.04] transition-colors"
						>
							<Film className="w-4 h-4 text-white/40" />
							Export as GIF
						</CommandItem>
						<CommandItem
							onSelect={() => run(onPlayPause)}
							className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-white/80 cursor-pointer data-[selected=true]:bg-white/[0.04] transition-colors"
						>
							<Play className="w-4 h-4 text-white/40" />
							Play / Pause
							<Kbd>Space</Kbd>
						</CommandItem>
						<CommandItem
							onSelect={() => run(onUndo)}
							className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-white/80 cursor-pointer data-[selected=true]:bg-white/[0.04] transition-colors"
						>
							<Undo2 className="w-4 h-4 text-white/40" />
							Undo
							<Kbd>{"\u2318"}Z</Kbd>
						</CommandItem>
						<CommandItem
							onSelect={() => run(onRedo)}
							className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-white/80 cursor-pointer data-[selected=true]:bg-white/[0.04] transition-colors"
						>
							<Redo2 className="w-4 h-4 text-white/40" />
							Redo
							<Kbd>{"\u2318\u21E7"}Z</Kbd>
						</CommandItem>
					</CommandGroup>

					<CommandSeparator className="my-1 h-px bg-white/[0.06]" />

					<CommandGroup
						heading="Timeline"
						className="[&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-white/40 [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5"
					>
						<CommandItem
							onSelect={() => run(onAddZoomRegion)}
							className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-white/80 cursor-pointer data-[selected=true]:bg-white/[0.04] transition-colors"
						>
							<ZoomIn className="w-4 h-4 text-white/40" />
							Add Zoom Region
							<Kbd>Z</Kbd>
						</CommandItem>
						<CommandItem
							onSelect={() => run(onAddTrimRegion)}
							className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-white/80 cursor-pointer data-[selected=true]:bg-white/[0.04] transition-colors"
						>
							<Scissors className="w-4 h-4 text-white/40" />
							Add Trim Region
							<Kbd>T</Kbd>
						</CommandItem>
						<CommandItem
							onSelect={() => run(onAddSpeedRegion)}
							className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-white/80 cursor-pointer data-[selected=true]:bg-white/[0.04] transition-colors"
						>
							<Timer className="w-4 h-4 text-white/40" />
							Add Speed Region
						</CommandItem>
						<CommandItem
							onSelect={() => run(onAddAnnotation)}
							className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-white/80 cursor-pointer data-[selected=true]:bg-white/[0.04] transition-colors"
						>
							<Pencil className="w-4 h-4 text-white/40" />
							Add Annotation
							<Kbd>A</Kbd>
						</CommandItem>
					</CommandGroup>

					<CommandSeparator className="my-1 h-px bg-white/[0.06]" />

					<CommandGroup
						heading="AI Features"
						className="[&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-white/40 [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5"
					>
						<CommandItem
							onSelect={() => run(onEnhanceAudio)}
							className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-white/80 cursor-pointer data-[selected=true]:bg-white/[0.04] transition-colors"
						>
							<Mic className="w-4 h-4 text-white/40" />
							Enhance Audio
						</CommandItem>
						<CommandItem
							onSelect={() => run(onGenerateThumbnails)}
							className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-white/80 cursor-pointer data-[selected=true]:bg-white/[0.04] transition-colors"
						>
							<Image className="w-4 h-4 text-white/40" />
							Generate Thumbnails
						</CommandItem>
					</CommandGroup>

					<CommandSeparator className="my-1 h-px bg-white/[0.06]" />

					<CommandGroup
						heading="Project"
						className="[&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-white/40 [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5"
					>
						<CommandItem
							onSelect={() => run(onSaveProject)}
							className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-white/80 cursor-pointer data-[selected=true]:bg-white/[0.04] transition-colors"
						>
							<Save className="w-4 h-4 text-white/40" />
							Save Project
							<Kbd>{"\u2318"}S</Kbd>
						</CommandItem>
						<CommandItem
							onSelect={() => run(onLoadProject)}
							className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-white/80 cursor-pointer data-[selected=true]:bg-white/[0.04] transition-colors"
						>
							<Upload className="w-4 h-4 text-white/40" />
							Load Project
						</CommandItem>
						<CommandItem
							onSelect={() => run(onOpenRecordingsFolder)}
							className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-white/80 cursor-pointer data-[selected=true]:bg-white/[0.04] transition-colors"
						>
							<FolderOpen className="w-4 h-4 text-white/40" />
							Open Recordings Folder
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</Command>
		</div>
	);
}
