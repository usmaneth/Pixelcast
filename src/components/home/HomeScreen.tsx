import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

/* ------------------------------------------------------------------ */
/*  CSS keyframes injected once into <head>                            */
/* ------------------------------------------------------------------ */
const KEYFRAMES = `
@keyframes hs-breathe {
	0%, 100% { transform: scale(1); }
	50%      { transform: scale(1.02); }
}
@keyframes hs-fadeSlideUp {
	from { opacity: 0; transform: translateY(10px); }
	to   { opacity: 1; transform: translateY(0); }
}
@keyframes hs-fadeIn {
	from { opacity: 0; }
	to   { opacity: 1; }
}
@keyframes hs-scaleIn {
	from { opacity: 0; transform: scale(0.8); }
	to   { opacity: 1; transform: scale(1); }
}
@keyframes hs-typewriter {
	0%   { opacity: 0; clip-path: inset(0 100% 0 0); }
	30%  { opacity: 1; clip-path: inset(0 100% 0 0); }
	100% { opacity: 1; clip-path: inset(0 0% 0 0); }
}
@keyframes hs-drift {
	0%, 100% { transform: translateX(-20px); }
	50%      { transform: translateX(20px); }
}
`;

let stylesInjected = false;
function injectStyles() {
	if (stylesInjected) return;
	stylesInjected = true;
	const style = document.createElement("style");
	style.textContent = KEYFRAMES;
	document.head.appendChild(style);
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Simple relative time formatter -- avoids pulling in date-fns. */
function relativeTime(timestampMs: number): string {
	const seconds = Math.floor((Date.now() - timestampMs) / 1000);
	if (seconds < 60) return "just now";
	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;
	const days = Math.floor(hours / 24);
	if (days < 30) return `${days}d ago`;
	const months = Math.floor(days / 30);
	return `${months}mo ago`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function HomeScreen() {
	const [recentProjects, setRecentProjects] = useState<
		{ name: string; path: string; mtime: number }[]
	>([]);

	useEffect(() => {
		injectStyles();
		async function fetchProjects() {
			try {
				const res = await window.electronAPI?.getRecentProjects();
				if (res?.success && res.projects) {
					setRecentProjects(res.projects);
				}
			} catch (error) {
				console.error("Failed to load recent projects:", error);
			}
		}
		fetchProjects();
	}, []);

	/* ---- keyboard shortcuts ---- */
	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.metaKey && e.key === "n") {
				e.preventDefault();
				handleRecordClick();
			}
			if (e.metaKey && e.key === "o") {
				e.preventDefault();
				handleEditClick();
			}
		}
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	/* ---- handlers ---- */

	const handleRecordClick = () => {
		window.electronAPI?.openHudOverlay().catch((err: unknown) => {
			console.warn("openHudOverlay IPC interrupted:", err);
		});
	};

	const handleEditClick = async () => {
		try {
			const res = await window.electronAPI?.openVideoFilePicker();
			if (res && res.success && res.path) {
				await window.electronAPI?.setCurrentVideoPath(res.path);
				window.electronAPI?.switchToEditor().catch(() => {});
			}
		} catch (err) {
			console.error("Failed to open video for editing:", err);
		}
	};

	const handleProjectClick = async (projectPath: string) => {
		try {
			await window.electronAPI?.openSpecificProject(projectPath);
		} catch {
			// Window destroyed on editor open -- expected.
		}
	};

	/* ---- render ---- */

	return (
		<div
			className="relative flex flex-col items-center justify-center h-screen w-full overflow-hidden font-sans selection:bg-[#E0000F]/30"
			style={{
				background: "#0a0a0a",
				WebkitAppRegion: "drag",
			} as React.CSSProperties}
		>
			{/* ============ BACKGROUND ORBS ============ */}
			{/* Red ambient orb -- top center with drift */}
			<div
				className="pointer-events-none absolute"
				style={{
					top: "-100px",
					left: "50%",
					marginLeft: -200,
					width: 400,
					height: 400,
					borderRadius: "50%",
					background: "rgba(224,0,15,0.035)",
					filter: "blur(100px)",
					animation: "hs-drift 20s ease-in-out infinite",
				}}
			/>
			{/* Purple ambient orb -- bottom right */}
			<div
				className="pointer-events-none absolute"
				style={{
					bottom: "-60px",
					right: "-60px",
					width: 250,
					height: 250,
					borderRadius: "50%",
					background: "rgba(191,90,242,0.02)",
					filter: "blur(70px)",
				}}
			/>

			{/* ============ CENTERED CONTENT ============ */}
			<div
				className="relative z-10 flex flex-col items-center"
				style={{
					width: "100%",
					maxWidth: 480,
					WebkitAppRegion: "no-drag",
				} as React.CSSProperties}
			>
				{/* ---- LOGO ---- */}
				<div
					style={{
						width: 56,
						height: 56,
						position: "relative",
						animation: "hs-scaleIn 600ms cubic-bezier(0.34, 1.56, 0.64, 1) 300ms both",
					}}
				>
					<div
						style={{
							width: "100%",
							height: "100%",
							position: "relative",
							animation: "hs-breathe 4s ease-in-out infinite",
						}}
					>
						{/* Outer rectangle */}
						<div
							style={{
								position: "absolute",
								inset: 0,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<div
								style={{
									width: 28,
									height: 28,
									border: "2.5px solid rgba(255,255,255,0.06)",
									borderRadius: 5,
									transform: "rotate(5deg)",
									position: "absolute",
								}}
							/>
							{/* Middle rectangle */}
							<div
								style={{
									width: 28,
									height: 28,
									border: "2.5px solid rgba(255,255,255,0.12)",
									borderRadius: 5,
									transform: "rotate(-5deg)",
									position: "absolute",
								}}
							/>
							{/* Inner solid rectangle */}
							<div
								style={{
									width: 28,
									height: 28,
									borderRadius: 5,
									transform: "rotate(20deg)",
									background: "#E0000F",
									boxShadow: "0 0 24px rgba(224,0,15,0.25)",
									position: "absolute",
								}}
							/>
						</div>
					</div>
				</div>

				{/* ---- WORDMARK ---- */}
				<h1
					style={{
						fontFamily: "'Inter', system-ui, sans-serif",
						fontSize: 36,
						fontWeight: 500,
						letterSpacing: "-0.05em",
						color: "#FFFFFF",
						margin: 0,
						marginTop: 16,
						lineHeight: 1,
						animation: "hs-fadeSlideUp 500ms ease-out 400ms both",
					}}
				>
					klipt
				</h1>

				{/* ---- TAGLINE ---- */}
				<p
					style={{
						fontFamily: "'Inter', system-ui, sans-serif",
						fontSize: 10,
						textTransform: "uppercase",
						letterSpacing: "0.08em",
						color: "rgba(255,255,255,0.15)",
						marginTop: 8,
						fontWeight: 400,
						animation: "hs-typewriter 1200ms ease-out 600ms both",
					}}
				>
					EDIT AT THE SPEED OF THOUGHT
				</p>

				{/* ---- ACTION BUTTONS ---- */}
				<div
					className="flex gap-2"
					style={{ marginTop: 28 }}
				>
					{/* Start Recording */}
					<button
						onClick={handleRecordClick}
						className="cursor-pointer"
						style={{
							background: "#FFFFFF",
							color: "#000000",
							fontFamily: "'Inter', system-ui, sans-serif",
							fontWeight: 600,
							fontSize: 13,
							paddingLeft: 28,
							paddingRight: 28,
							paddingTop: 10,
							paddingBottom: 10,
							borderRadius: 12,
							border: "none",
							boxShadow: "0 4px 20px rgba(255,255,255,0.08)",
							animation: "hs-fadeSlideUp 500ms ease-out 800ms both",
							WebkitAppRegion: "no-drag",
						} as React.CSSProperties}
					>
						Start Recording
					</button>
					{/* Open File */}
					<button
						onClick={handleEditClick}
						className="cursor-pointer"
						style={{
							background: "transparent",
							color: "rgba(255,255,255,0.35)",
							fontFamily: "'Inter', system-ui, sans-serif",
							fontWeight: 600,
							fontSize: 13,
							paddingLeft: 28,
							paddingRight: 28,
							paddingTop: 10,
							paddingBottom: 10,
							borderRadius: 12,
							border: "1px solid rgba(255,255,255,0.06)",
							animation: "hs-fadeSlideUp 500ms ease-out 900ms both",
							WebkitAppRegion: "no-drag",
						} as React.CSSProperties}
					>
						Open File
					</button>
				</div>

				{/* ---- KEYBOARD HINTS ---- */}
				<div
					className="flex items-center gap-3"
					style={{
						marginTop: 10,
						animation: "hs-fadeIn 500ms ease-out 1000ms both",
					}}
				>
					<span className="flex items-center gap-1">
						<kbd
							style={{
								background: "rgba(255,255,255,0.03)",
								border: "1px solid rgba(255,255,255,0.06)",
								borderRadius: 3,
								paddingLeft: 5,
								paddingRight: 5,
								paddingTop: 1,
								paddingBottom: 1,
								fontFamily: "'SF Mono', 'Fira Code', monospace",
								fontSize: 8,
								color: "rgba(255,255,255,0.15)",
							}}
						>
							⌘N
						</kbd>
						<span
							style={{
								fontSize: 8,
								color: "rgba(255,255,255,0.10)",
							}}
						>
							record
						</span>
					</span>
					<span className="flex items-center gap-1">
						<kbd
							style={{
								background: "rgba(255,255,255,0.03)",
								border: "1px solid rgba(255,255,255,0.06)",
								borderRadius: 3,
								paddingLeft: 5,
								paddingRight: 5,
								paddingTop: 1,
								paddingBottom: 1,
								fontFamily: "'SF Mono', 'Fira Code', monospace",
								fontSize: 8,
								color: "rgba(255,255,255,0.15)",
							}}
						>
							⌘O
						</kbd>
						<span
							style={{
								fontSize: 8,
								color: "rgba(255,255,255,0.10)",
							}}
						>
							open
						</span>
					</span>
				</div>

				{/* ---- RECENT PROJECTS ---- */}
				{recentProjects.length > 0 && (
					<div
						className="w-full flex flex-col"
						style={{ marginTop: 36 }}
					>
						<h3
							style={{
								fontFamily: "'Inter', system-ui, sans-serif",
								fontSize: 8,
								fontWeight: 700,
								textTransform: "uppercase",
								letterSpacing: "0.12em",
								color: "rgba(255,255,255,0.10)",
								marginBottom: 6,
								marginTop: 0,
							}}
						>
							RECENT
						</h3>
						<div className="flex flex-col">
							{recentProjects.map((project, i) => (
								<div
									key={project.path}
									onClick={() => handleProjectClick(project.path)}
									className="group flex items-center justify-between cursor-pointer transition-colors duration-200"
									style={{
										padding: "7px 10px",
										borderRadius: 8,
										animation: `hs-fadeIn 400ms ease-out ${1000 + i * 80}ms both`,
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.background = "rgba(255,255,255,0.02)";
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.background = "transparent";
									}}
								>
									<div className="flex items-center gap-2">
										{/* Dot */}
										<div
											style={{
												width: 6,
												height: 6,
												borderRadius: 1,
												background: "rgba(255,255,255,0.06)",
												flexShrink: 0,
											}}
										/>
										<span
											className="transition-colors duration-200"
											style={{
												fontFamily: "'Inter', system-ui, sans-serif",
												fontSize: 11,
												fontWeight: 400,
												color: "rgba(255,255,255,0.35)",
											}}
											ref={(el) => {
												if (!el) return;
												const parent = el.closest(".group");
												if (!parent) return;
												parent.addEventListener("mouseenter", () => {
													el.style.color = "rgba(255,255,255,0.50)";
												});
												parent.addEventListener("mouseleave", () => {
													el.style.color = "rgba(255,255,255,0.35)";
												});
											}}
										>
											{project.name.replace(".klipt", "")}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<span
											style={{
												fontFamily: "'SF Mono', 'Fira Code', monospace",
												fontSize: 9,
												color: "rgba(255,255,255,0.10)",
											}}
										>
											{relativeTime(project.mtime)}
										</span>
										<ChevronRight
											className="transition-transform duration-200 group-hover:translate-x-[2px]"
											style={{
												width: 10,
												height: 10,
												color: "rgba(255,255,255,0.08)",
											}}
										/>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>

			{/* ============ FOOTER ============ */}
			<div
				className="absolute flex items-center justify-center gap-1.5 pointer-events-none"
				style={{
					bottom: 12,
					left: 0,
					right: 0,
				}}
			>
				<span
					style={{
						fontFamily: "'SF Mono', 'Fira Code', monospace",
						fontSize: 9,
						color: "rgba(255,255,255,0.08)",
					}}
				>
					klipt
				</span>
				<span
					style={{
						width: 2,
						height: 2,
						borderRadius: "50%",
						background: "rgba(255,255,255,0.08)",
						display: "inline-block",
					}}
				/>
				<span
					style={{
						fontFamily: "'SF Mono', 'Fira Code', monospace",
						fontSize: 9,
						color: "rgba(255,255,255,0.08)",
					}}
				>
					v1.0
				</span>
			</div>
		</div>
	);
}
