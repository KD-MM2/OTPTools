import { otpStringParser } from "@/utils";
import { BrowserQRCodeReader } from "@zxing/browser/esm/readers/BrowserQRCodeReader";
import { emitCustomEvent } from "react-custom-events";

const scrollIntoView = (ref: React.RefObject<HTMLElement>) => {
	if (ref.current) {
		const lastChild = ref.current.lastChild as HTMLElement;
		lastChild?.scrollIntoView({ behavior: "smooth" });
	}
};

const handleAddOTP = (otpList: OTPData[]) => {
	const isOTPListValid = otpList.every(
		(otp) => otp.user !== "" && otp.secret !== ""
	);
	if (!isOTPListValid) {
		emitCustomEvent("SnackBarEvent", {
			type: "SHOW_SNACKBAR",
			message: "Please fill all the required fields!",
			severity: "error",
		});
		return;
	}
	emitCustomEvent("Operations", {
		type: "ADD_NEW_OTP",
		data: otpList.map((otp) => ({
			...otp,
			secret: otp.secret.replace(/\s/g, ""),
		})),
	});
};

const processImage = async (file: File) => {
	try {
		const result = (
			await new BrowserQRCodeReader().decodeFromImageUrl(
				URL.createObjectURL(file)
			)
		).getText();
		if (result != null || result != "") {
			const newOTP = otpStringParser(result);
			if (newOTP.secret != null || newOTP.secret != "") {
				return newOTP;
			} else throw new Error();
		} else throw new Error();
	} catch (e) {
		emitCustomEvent("SnackBarEvent", {
			type: "SHOW_SNACKBAR",
			message: "Failed to extract OTP from image!",
			severity: "error",
		});
		return undefined;
	}
};

export { scrollIntoView, handleAddOTP, processImage };
