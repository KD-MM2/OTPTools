import * as CryptoJS from "crypto-js";
import { mixCharacters, unmixCharacters } from "./string_mixer";

export { generateRandomKey, generateKey, encryptKey, decryptKey };

function generateRandomKey(len: number = 24) {
	const key = generateKey(len);
	const encryptedKey = encryptKey(key);
	const decryptedKey = decryptKey(encryptedKey);

	console.log("Original key: ", key.toString());
	console.log("Encrypted key: ", encryptedKey);
	console.log("Decrypted key: ", decryptedKey.toString());

	return key;
}

function generateKey(len: number = 24) {
	return CryptoJS.lib.WordArray.random(len);
}

function encryptKey(key: CryptoJS.lib.WordArray) {
	return CryptoJS.enc.Base64.stringify(key);
}

function decryptKey(encryptedKey: string) {
	return CryptoJS.enc.Base64.parse(encryptedKey);
}
