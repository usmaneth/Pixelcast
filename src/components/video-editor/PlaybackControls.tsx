import { ChevronsLeft, ChevronsRight, Pause, Play } from "lucide-react";
import { memo, useCallback, useState, useEffect } from "react";
import { useScopedT } from "@/contexts/I18nContext";

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
	const [isScrubbing, setIsScrubbing] = useState(false);
	const [scrubSpeed, setScrubSpeed] = useState(0);

	// Calculate scrub speed for dynamic warp intensity
	useEffect(() => {
		if (!isScrubbing) {
			setScrubSpeed(0);
			return;
		}
		let lastTime = currentTime;
		const interval = setInterval(() => {
			const diff = Math.abs(currentTime - lastTime);
			setScrubSpeed(Math.min(diff * 10, 1)); // Cap at 1
			lastTime = currentTime;
		}, 50);
		return () => clearInterval(interval);
	}, [currentTime, isScrubbing]);


	function formatTime(seconds: number) {
		if (!isFinite(seconds) || isNaN(seconds) || seconds < 0) return "0:00";
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	}

	function formatRemaining(current: number, total: number) {
		const remaining = Math.max(0, total - current);
		return `-${formatTime(remaining)}`;
	}

	function handleSeekChange(e: React.ChangeEvent<HTMLInputElement>) {
		onSeek(parseFloat(e.target.value));
	}

	const handleSkipBack = useCallback(() => {
		onSeek(Math.max(0, currentTime - 5));
	}, [onSeek, currentTime]);

	const handleSkipForward = useCallback(() => {
		onSeek(Math.min(duration, currentTime + 5));
	}, [onSeek, currentTime, duration]);

	const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

	return (
		<div className="flex flex-col items-center gap-0 w-full max-w-md mx-auto px-4">
			{/* Scrubber */}
			<div className="relative w-full h-6 flex items-center group cursor-pointer">
				{/* Track */}
				<div className="absolute left-0 right-0 h-1 bg-white/[0.06] rounded-full overflow-hidden">
					<div
						className="h-full rounded-full"
						style={{
							width: `${progress}%`,
							background: "linear-gradient(90deg, #E0000F, #FF4500)",
						}}
					/>
				</div>

				{/* Interactive Input */}
				<input
					type="range"
					onMouseDown={() => setIsScrubbing(true)}
					onMouseUp={() => setIsScrubbing(false)}
					onTouchStart={() => setIsScrubbing(true)}
					onTouchEnd={() => setIsScrubbing(false)}

					min="0"
					max={duration || 100}
					value={currentTime}
					onChange={handleSeekChange}
					step="0.01"
					className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
				/>

				{/* Time-Warp Scrubbing Ripple Effect */}
				<div
					className="absolute pointer-events-none transition-all duration-300 z-0 rounded-full"
					style={{
						width: 120,
						height: 120,
						left: `${progress}%`,
						top: "50%",
						transform: `translate(-50%, -50%) scale(${isScrubbing ? 1 + scrubSpeed * 2 : 0})`,
						opacity: isScrubbing ? 0.8 : 0,
						background: "rgba(255,255,255,0.02)",
						backdropFilter: `blur(${10 + scrubSpeed * 30}px) hue-rotate(${scrubSpeed * 90}deg) contrast(${1 + scrubSpeed})`,
						WebkitBackdropFilter: `blur(${10 + scrubSpeed * 30}px) hue-rotate(${scrubSpeed * 90}deg) contrast(${1 + scrubSpeed})`,
						boxShadow: isScrubbing ? `0 0 ${30 + scrubSpeed * 50}px rgba(224,0,15,${0.2 + scrubSpeed * 0.5})` : "none",
					}}
				/>

				{/* Thumb */}
				<div
					className={`absolute pointer-events-none transition-opacity duration-150 ${isScrubbing ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
					style={{
						width: isScrubbing ? 24 : 14,
						height: isScrubbing ? 24 : 14,
						transition: "width 0.2s, height 0.2s, opacity 0.15s",
						borderRadius: "50%",
						backgroundColor: "#fff",
						boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
						border: "1px solid rgba(0,0,0,0.1)",
						left: `${progress}%`,
						transform: "translate(-50%, 0)",
					}}
				/>
			</div>

			{/* Controls row */}
			<div className="flex items-center justify-between w-full mt-2">
				{/* Elapsed time */}
				<span className="font-mono text-white/35 text-[14px] tabular-nums w-[50px]">
					{formatTime(currentTime)}
				</span>

				{/* Center controls */}
				<div className="flex items-center gap-4">
					<button
						type="button"
						onClick={handleSkipBack}
						className="text-white/35 hover:text-white/60 transition-colors cursor-pointer"
						aria-label="Skip back"
					>
						<ChevronsLeft className="w-6 h-6" />
					</button>

					<button
						type="button"
						onClick={onTogglePlayPause}
						className="flex items-center justify-center rounded-full transition-all duration-150 cursor-pointer"
						style={{
							width: 56,
							height: 56,
							background: "rgba(224,0,15,0.08)",
							border: isPlaying
								? "2px solid rgba(224,0,15,0.4)"
								: "2px solid rgba(224,0,15,0.25)",
							boxShadow: isPlaying
								? "0 0 32px rgba(224,0,15,0.2)"
								: "0 0 24px rgba(224,0,15,0.12)",
						}}
						aria-label={isPlaying ? t("playback.pause") : t("playback.play")}
					>
						{isPlaying ? (
							<Pause className="w-6 h-6 text-white fill-current" />
						) : (
							<Play className="w-6 h-6 text-white fill-current ml-0.5" />
						)}
					</button>

					<button
						type="button"
						onClick={handleSkipForward}
						className="text-white/35 hover:text-white/60 transition-colors cursor-pointer"
						aria-label="Skip forward"
					>
						<ChevronsRight className="w-6 h-6" />
					</button>
				</div>

				{/* Remaining time */}
				<span className="font-mono text-white/15 text-[14px] tabular-nums w-[50px] text-right">
					{formatRemaining(currentTime, duration)}
				</span>
			</div>
		</div>
	);
});

export default PlaybackControls;
