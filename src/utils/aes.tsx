import CryptoJS from "crypto-js";

export { generateKey, encryptKey, decryptKey, encryptData, decryptData };

function generateKey(len: number = 24) {
	return CryptoJS.lib.WordArray.random(len);
}

function encryptKey(key: CryptoJS.lib.WordArray) {
	return CryptoJS.enc.Base64.stringify(key);
}

function decryptKey(encryptedKey: string) {
	return CryptoJS.enc.Base64.parse(encryptedKey);
}

function encryptData(data: string, key: string) {
	return CryptoJS.AES.encrypt(data, key).toString();
}

function decryptData(data: string, key: string) {
	return CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8);
}
