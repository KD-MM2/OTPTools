import CryptoJS from "crypto-js";

function generateKey(len: number = 24) {
	return CryptoJS.lib.WordArray.random(len);
}

function encryptKey(key: CryptoJS.lib.WordArray) {
	return CryptoJS.enc.Base64.stringify(key);
}

function decryptKey(encryptedKey: string) {
	if (!encryptedKey) return "";
	return CryptoJS.enc.Base64.parse(encryptedKey);
}

function encryptData(data: string, key: string) {
	return CryptoJS.AES.encrypt(data, key).toString();
}

function decryptData(data: string, key: string) {
	return CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8);
}

function base64Encode(data: string) {
	return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data));
}

function base64Decode(data: string) {
	return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(data));
}

export {
	generateKey,
	encryptKey,
	decryptKey,
	encryptData,
	decryptData,
	base64Encode,
	base64Decode,
};
