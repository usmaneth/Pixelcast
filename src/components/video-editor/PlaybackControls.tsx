import { Pause, Play } from "lucide-react";
import { memo } from "react";
import { useScopedT } from "@/contexts/I18nContext";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface PlaybackControlsProps {
	isPlaying: boolean;
	currentTime: number;
	duration: number;
	onTogglePlayPause: () => void;
	onSeek: (time: number) => void;
}

const PlaybackControls = memo(function PlaybackControls({
	isPlaying,
	currentTime,
	duration,
	onTogglePlayPause,
	onSeek,
}: PlaybackControlsProps) {
	const t = useScopedT("editor");
	function formatTime(seconds: number) {
		if (!isFinite(seconds) || isNaN(seconds) || seconds < 0) return "0:00";
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	}

	function handleSeekChange(e: React.ChangeEvent<HTMLInputElement>) {
		onSeek(parseFloat(e.target.value));
	}

	const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

	return (
		<div className="flex items-center gap-4 px-4 py-2 bg-transparent w-full max-w-2xl mx-auto">
			<Button
				onClick={onTogglePlayPause}
				size="icon"
				className={cn(
					"w-12 h-12 rounded-full transition-all duration-150 flex-shrink-0 flex items-center justify-center shadow-sm",
					isPlaying
						? "bg-white/10 text-white hover:bg-white/15"
						: "bg-white text-black hover:scale-105",
				)}
				aria-label={isPlaying ? t("playback.pause") : t("playback.play")}
			>
				{isPlaying ? (
					<Pause className="w-5 h-5 fill-current" />
				) : (
					<Play className="w-5 h-5 fill-current ml-0.5" />
				)}
			</Button>

			<span className="text-[13px] font-mono text-white tabular-nums w-[40px] text-right tracking-tight">
				{formatTime(currentTime)}
			</span>

			<div className="flex-1 relative h-8 flex items-center group cursor-pointer">
				{/* Track */}
				<div className="absolute left-0 right-0 h-1 bg-white/10 rounded-full overflow-hidden">
					<div
						className="h-full rounded-full bg-white"
						style={{ width: `${progress}%` }}
					/>
				</div>

				{/* Interactive Input */}
				<input
					type="range"
					min="0"
					max={duration || 100}
					value={currentTime}
					onChange={handleSeekChange}
					step="0.01"
					className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
				/>

				{/* Thumb */}
				<div
					className="absolute w-3 h-3 bg-white rounded-full shadow-sm pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150"
					style={{
						left: `${progress}%`,
						transform: "translate(-50%, 0)",
					}}
				/>
			</div>

			<span className="text-[13px] font-mono text-white/30 tabular-nums w-[40px] tracking-tight">
				{formatTime(duration)}
			</span>
		</div>
	);
});

export default PlaybackControls;
