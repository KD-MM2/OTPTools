import { emitCustomEvent } from "react-custom-events";

const copyToClipboard = async (text: string) => {
	await navigator.clipboard.writeText(text);
	emitCustomEvent("SnackBarEvent", {
		type: "SHOW_SNACKBAR",
		message: "Copied to clipboard!",
		severity: "info",
	});
};

export { copyToClipboard };
