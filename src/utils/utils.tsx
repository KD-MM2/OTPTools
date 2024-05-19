import { emitCustomEvent } from "react-custom-events";

const copyToClipboard = async (text: string) => {
	await navigator.clipboard.writeText(text);
	emitCustomEvent("SnackBarEvent", {
		type: "SHOW_SNACKBAR",
		message: "Copied to clipboard!",
		severity: "info",
	});
};

function stringToBinary(input: string) {
	let binaryOutput = "";
	for (let i = 0; i < input.length; i++) {
		binaryOutput += input[i].charCodeAt(0).toString(2) + " ";
	}
	return binaryOutput;
}

function binaryToString(binary: any) {
	const binaryString = binary.split(" ");
	let stringOutput = "";
	for (let i = 0; i < binaryString.length; i++) {
		stringOutput += String.fromCharCode(parseInt(binaryString[i], 2));
	}
	return stringOutput;
}

function downloadFile(data: string, filename: string, type: string) {
	const file = new Blob([data], { type: type });
	const a = document.createElement("a");
	const url = URL.createObjectURL(file);
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}

export { copyToClipboard, stringToBinary, binaryToString, downloadFile };
