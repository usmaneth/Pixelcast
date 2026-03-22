import { CircleDot, FileVideo, Film } from "lucide-react";
import { useEffect, useState } from "react";

/** Simple relative time formatter — avoids pulling in date-fns. */
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

export function HomeScreen() {
	const [recentProjects, setRecentProjects] = useState<
		{ name: string; path: string; mtime: number }[]
	>([]);

	useEffect(() => {
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

	const handleRecordClick = () => {
		window.electronAPI?.openHudOverlay().catch((err: unknown) => {
			// The home window may be destroyed before the IPC response arrives;
			// this is expected and safe to ignore.
			console.warn("openHudOverlay IPC interrupted:", err);
		});
	};

	const handleEditClick = async () => {
		try {
			const res = await window.electronAPI?.openVideoFilePicker();
			if (res && res.success && res.path) {
				await window.electronAPI?.setCurrentVideoPath(res.path);
				// switchToEditor will destroy this window; catch the expected rejection.
				window.electronAPI?.switchToEditor().catch(() => {
					// Window destroyed before IPC response — expected.
				});
			}
		} catch (err) {
			console.error("Failed to open video for editing:", err);
		}
	};

	const handleProjectClick = async (projectPath: string) => {
		try {
			await window.electronAPI?.openSpecificProject(projectPath);
		} catch {
			// The home window is destroyed when the editor opens, so the IPC
			// response may fail to deliver.  This is expected and safe to ignore.
		}
	};

	return (
		<div
			className="flex flex-col h-screen w-full bg-[#18181A] text-[#EEEEF0] overflow-hidden items-center justify-center p-8 selection:bg-white/20"
			style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
		>
			<div
				className="flex flex-col items-center mb-16"
				style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
			>
				<div className="w-16 h-16 relative flex items-center justify-center mb-4">
					{/* klipt logo shape simulation - three rotating rectangles */}
					<div className="absolute w-7 h-7 bg-transparent border-[3px] border-white/20 rounded-[4px] transform rotate-12" />
					<div className="absolute w-7 h-7 bg-transparent border-[3px] border-white/40 rounded-[4px] transform -rotate-12" />
					<div className="absolute w-7 h-7 bg-[#FF453A] rounded-[4px] transform rotate-45" />
				</div>
				<h1 className="text-3xl font-semibold tracking-tight text-[#EEEEF0]">Klipt</h1>
				<p className="text-[13px] text-[#A1A1A6] mt-1.5 tracking-normal">
					Edit at the speed of thought
				</p>
			</div>

			<div
				className="flex items-center gap-6 w-full max-w-2xl mb-12"
				style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
			>
				<div
					onClick={handleRecordClick}
					className="flex-1 flex flex-col items-start p-6 rounded-2xl bg-[#1E1E20] border border-white/5 shadow-md cursor-pointer group hover:bg-[#252528] hover:border-white/10 transition-all duration-200 relative overflow-hidden"
				>
					<div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
					<div className="w-10 h-10 rounded-full bg-[#FF453A]/10 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300 ring-1 ring-[#FF453A]/20">
						<CircleDot className="w-5 h-5 text-[#FF453A]" />
					</div>
					<h2 className="text-[15px] font-semibold mb-1 text-[#EEEEF0]">New Recording</h2>
					<p className="text-[13px] text-[#A1A1A6] leading-relaxed">
						Capture your screen with AI-powered editing
					</p>
				</div>

				<div
					onClick={handleEditClick}
					className="flex-1 flex flex-col items-start p-6 rounded-2xl bg-[#1E1E20] border border-white/5 shadow-md cursor-pointer group hover:bg-[#252528] hover:border-white/10 transition-all duration-200 relative overflow-hidden"
				>
					<div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
					<div className="w-10 h-10 rounded-full bg-[#0A84FF]/10 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300 ring-1 ring-[#0A84FF]/20">
						<Film className="w-5 h-5 text-[#0A84FF]" />
					</div>
					<h2 className="text-[15px] font-semibold mb-1 text-[#EEEEF0]">Edit Video</h2>
					<p className="text-[13px] text-[#A1A1A6] leading-relaxed">
						Open and edit an existing recording
					</p>
				</div>
			</div>

			{recentProjects.length > 0 && (
				<div
					className="w-full max-w-2xl flex flex-col"
					style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
				>
					<h3 className="text-xs font-bold uppercase tracking-widest text-[#555] mb-4">
						Recent Projects
					</h3>
					<div className="flex flex-col gap-2">
						{recentProjects.map((project) => (
							<div
								key={project.path}
								onClick={() => handleProjectClick(project.path)}
								className="flex items-center justify-between p-3 rounded-xl bg-[#1C1C1C]/30 border border-transparent hover:border-[#2E2E2E] hover:bg-[#1C1C1C] cursor-pointer transition-all duration-200 group"
							>
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 rounded bg-[#0D0D0D] flex items-center justify-center border border-[#2E2E2E] group-hover:border-white/10 transition-colors">
										<FileVideo className="w-4 h-4 text-[#555] group-hover:text-white/80 transition-colors" />
									</div>
									<div className="flex flex-col">
										<span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
											{project.name.replace(".klipt", "")}
										</span>
										<span className="text-xs text-[#555] mt-0.5">
											{relativeTime(project.mtime)}
										</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			<div className="absolute bottom-6 flex items-center gap-4 text-[#555] font-mono text-[10px] tracking-wider pointer-events-none">
				<span>Made with klipt</span>
				<span className="w-1 h-1 rounded-full bg-[#2E2E2E]" />
				<span>v1.0.0</span>
			</div>
		</div>
	);
}
