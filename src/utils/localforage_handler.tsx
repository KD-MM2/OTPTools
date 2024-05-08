import localForage from "localforage";
import { decryptKey, encryptKey, generateKey } from "./aes";

export { initKey, getKey };

localForage.config({
	driver: localForage.INDEXEDDB,
	name: "otp-manager",
	version: 1.0,
	storeName: "otps",
});

function initKey() {
	const newKey = generateKey();
	const encryptedKey = encryptKey(newKey);
	localForage.setItem("key", encryptedKey).then(() => {
		console.log("Saved key to local storage");
		return newKey;
	});
	return null;
}

function getKey() {
	localForage.getItem("key").then((value) => {
		if (!value) {
			initKey();
			return null;
		}
		const decryptedKey = decryptKey(value as string);
		console.log("decryptedKey", decryptedKey, decryptedKey.toString());
		return decryptedKey;
	});
	return null;
}
