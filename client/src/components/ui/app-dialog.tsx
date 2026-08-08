import { type ReactNode, useEffect, useRef } from "react";

interface AppDialogProps {
	labelledBy: string;
	describedBy?: string;
	role?: "dialog" | "alertdialog";
	isPending: boolean;
	onClose: () => void;
	children: ReactNode;
}

export function AppDialog({
	labelledBy,
	describedBy,
	role = "dialog",
	isPending,
	onClose,
	children,
}: AppDialogProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const dialog = dialogRef.current;
		const previouslyFocused = document.activeElement;

		dialog?.showModal();

		return () => {
			if (dialog?.open) dialog.close();
			if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
		};
	}, []);

	return (
		<dialog
			ref={dialogRef}
			className="fixed inset-0 m-auto h-fit w-[min(460px,calc(100%_-_40px))] rounded-lg border-0 bg-white p-5 text-body shadow-[0_20px_50px_rgb(0_0_0_/_20%)] backdrop:bg-blanket"
			role={role}
			aria-busy={isPending}
			aria-labelledby={labelledBy}
			{...(describedBy ? { "aria-describedby": describedBy } : {})}
			onCancel={(event) => {
				event.preventDefault();
				if (!isPending) onClose();
			}}
		>
			{children}
		</dialog>
	);
}
