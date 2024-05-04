import jsSHA from "jssha";

export const dec2hex = function (dec: number): string {
	return (dec < 15.5 ? "0" : "") + Math.round(dec).toString(16);
};

export const hex2dec = function (hex: string): number {
	return parseInt(hex, 16);
};

const leftPad = function (str: string, len: number, pad: string): string {
	return str.padStart(len, pad);
};

export const base32ToHex = function (base32: string): string | boolean {
	const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
	const bits: string[] = [];
	const hex: string[] = [];

	for (let i = 0; i < base32.length; i++) {
		const val = base32chars.indexOf(base32.charAt(i).toUpperCase());
		if (val == -1) {
			return false;
		}
		bits.push(leftPad(val.toString(2), 5, "0"));
	}

	const bitsString = bits.join("");
	for (let i = 0; i + 4 <= bitsString.length; i += 4) {
		const chunk = bitsString.substring(i, i + 4);
		hex.push(parseInt(chunk, 2).toString(16));
	}
	return hex.join("");
};

export const generateKey = function (): string {
	const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
	const randomNumbers = new Uint32Array(32);
	window.crypto.getRandomValues(randomNumbers);
	const key = randomNumbers.reduce(
		(acc, num) => acc + base32chars.charAt(num % 32),
		""
	);
	return (key.match(/.{8}/g) || []).join(" ");
};

export const calculateOTP = function (
	secret: string,
	epoch: number
): OTPOutput {
	const time = leftPad(dec2hex(Math.floor(epoch / 30)), 16, "0");

	try {
		const key = base32ToHex(secret.replace(/\s/g, ""));
		const shaObj = new jsSHA("SHA-1", "HEX");
		shaObj.setHMACKey(String(key), "HEX");
		shaObj.update(time);
		const hmac = shaObj.getHMAC("HEX");
		const offset = hex2dec(hmac.substring(hmac.length - 1));
		let otp =
			(hex2dec(hmac.substring(offset * 2, offset * 2 + 8)) &
				hex2dec("7fffffff")) +
			"";
		otp = otp.substring(otp.length - 6);

		return {
			success: true,
			otp: otp,
			key: key,
			keyLength: typeof key === "string" && key.length * 4,
			epoch: epoch,
			epochIteration: time,
			hmac: [
				hmac.substring(0, offset * 2),
				hmac.substring(offset * 2, offset * 2 + 8),
				hmac.substring(offset * 2 + 8),
			],
		};
	} catch (err) {
		return {
			success: false,
			otp: null,
			key: null,
			keyLength: null,
			epoch: epoch,
			epochIteration: time,
			hmac: null,
		};
	}
};
