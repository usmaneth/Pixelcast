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
		<div className="flex items-center gap-4 px-4 py-2 rounded-2xl bg-[#1E1E20] border border-black/50 shadow-[0_1px_0_rgba(255,255,255,0.02)] transition-all duration-300 w-full max-w-xl mx-auto">
			<Button
				onClick={onTogglePlayPause}
				size="icon"
				className={cn(
					"w-10 h-10 rounded-full transition-colors flex-shrink-0 flex items-center justify-center",
					isPlaying
						? "bg-white/5 text-[#EEEEF0] hover:bg-white/10"
						: "bg-[#EEEEF0] text-black hover:bg-white",
				)}
				aria-label={isPlaying ? t("playback.pause") : t("playback.play")}
			>
				{isPlaying ? (
					<Pause className="w-5 h-5 fill-current" />
				) : (
					<Play className="w-5 h-5 fill-current ml-1" />
				)}
			</Button>

			<span className="text-[12px] font-mono font-medium text-[#EEEEF0] tabular-nums w-[40px] text-right tracking-tight">
				{formatTime(currentTime)}
			</span>

			<div className="flex-1 relative h-8 flex items-center group cursor-pointer">
				{/* Custom Track Background */}
				<div className="absolute left-0 right-0 h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/5">
					<div
						className="h-full rounded-full bg-[#EEEEF0] relative"
						style={{ width: `${progress}%` }}
					></div>
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

				{/* Custom Thumb (visual only, follows progress) */}
				<div
					className="absolute w-3.5 h-3.5 bg-white rounded-full shadow-sm pointer-events-none transition-transform duration-200 ease-out flex items-center justify-center scale-95 group-hover:scale-110"
					style={{
						left: `${progress}%`,
						transform: "translate(-50%, 0)",
					}}
				></div>
			</div>

			<span className="text-[12px] font-mono font-medium text-[#A1A1A6] tabular-nums w-[40px] tracking-tight">
				{formatTime(duration)}
			</span>
		</div>
	);
});

export default PlaybackControls;
