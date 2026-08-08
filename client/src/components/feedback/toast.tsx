import { CircleCheck, CircleX } from "lucide-react";
import { useEffect } from "react";

interface ToastProps {
	type: "success" | "error";
	message: string;
	onClose: () => void;
}

export function Toast({ type, message, onClose }: ToastProps) {
	useEffect(() => {
		const timeoutId = window.setTimeout(onClose, 3500);
		return () => window.clearTimeout(timeoutId);
	}, [onClose]);

	return (
		<div
			className={`fixed top-6 right-6 z-20 flex w-max max-w-[calc(100vw_-_48px)] animate-[toast-in_180ms_ease-out] items-center gap-[10px] rounded-lg px-4 py-[14px] text-white shadow-[0_8px_24px_rgb(0_0_0_/_18%)] motion-reduce:animate-none max-[560px]:right-3 max-[560px]:max-w-[calc(100vw_-_24px)] ${type === "success" ? "bg-success" : "bg-danger"}`}
			role={type === "error" ? "alert" : "status"}
		>
			{type === "success" ? (
				<CircleCheck size={22} aria-hidden="true" />
			) : (
				<CircleX size={22} aria-hidden="true" />
			)}
			<span>{message}</span>
		</div>
	);
}
