import * as CryptoJS from "crypto-js";

export {
	generateHOTP,
	hexToBytes,
	verifyHOTP,
	generateTOTP,
	verifyTOTP,
	generateSecret,
	base32toHex,
	getCounterFromTime,
};

function hexToBytes(hex: string) {
	return (hex.match(/.{1,2}/g) ?? []).map((char) =>
		Number.parseInt(char, 16)
	);
}

function computeHMACSha1(message: string, key: string) {
	return CryptoJS.HmacSHA1(
		CryptoJS.enc.Hex.parse(message),
		CryptoJS.enc.Hex.parse(base32toHex(key))
	).toString(CryptoJS.enc.Hex);
}

function base32toHex(base32: string) {
	const base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

	const bits = base32
		.toUpperCase()
		.replace(/=+$/, "")
		.split("")
		.map((value) => base32Chars.indexOf(value).toString(2).padStart(5, "0"))
		.join("");

	const hex = (bits.match(/.{1,8}/g) ?? [])
		.map((chunk) => Number.parseInt(chunk, 2).toString(16).padStart(2, "0"))
		.join("");

	return hex;
}

function generateHOTP({ key, counter = 0 }: { key: string; counter?: number }) {
	const digest = computeHMACSha1(counter.toString(16).padStart(16, "0"), key);
	const bytes = hexToBytes(digest);
	const offset = bytes[19] & 0xf;
	const v =
		((bytes[offset] & 0x7f) << 24) |
		((bytes[offset + 1] & 0xff) << 16) |
		((bytes[offset + 2] & 0xff) << 8) |
		(bytes[offset + 3] & 0xff);
	const code = String(v % 1000000).padStart(6, "0");

	return {
		code,
		hmac: [
			digest.substring(0, offset * 2),
			digest.substring(offset * 2, offset * 2 + 8),
			digest.substring(offset * 2 + 8),
		],
	};
}

function verifyHOTP({
	token,
	key,
	window = 0,
	counter = 0,
}: {
	token: string;
	key: string;
	window?: number;
	counter?: number;
}) {
	for (let i = counter - window; i <= counter + window; ++i) {
		if (generateHOTP({ key, counter: i }).code === token) {
			return true;
		}
	}

	return false;
}

function getCounterFromTime({
	now,
	timeStep,
}: {
	now: number;
	timeStep: number;
}) {
	return Math.floor(now / 1000 / timeStep);
}

function generateTOTP({
	key,
	now = Date.now(),
	timeStep = 30,
}: {
	key: string;
	now?: number;
	timeStep?: number;
}) {
	const counter = getCounterFromTime({ now, timeStep });

	return generateHOTP({
		key: key.replace(/\s/g, "").toUpperCase(),
		counter: counter,
	});
}

function verifyTOTP({
	key,
	token,
	window = 0,
	now = Date.now(),
	timeStep = 30,
}: {
	token: string;
	key: string;
	window?: number;
	now?: number;
	timeStep?: number;
}) {
	const counter = getCounterFromTime({ now, timeStep });

	return verifyHOTP({ token, key, window, counter });
}

function generateSecret() {
	const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
	const randomNumbers = new Uint32Array(32);
	window.crypto.getRandomValues(randomNumbers);
	const key = randomNumbers.reduce(
		(acc, num) => acc + base32chars.charAt(num % 32),
		""
	);
	return key.match(/.{8}/g)?.join(" ") ?? "";
}