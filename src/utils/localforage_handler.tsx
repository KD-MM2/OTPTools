import localForage from "localforage";
import {
	generateKey,
	encryptKey,
	decryptKey,
	encryptData,
	decryptData,
} from "@/utils/aes";

export { getSeeds, setSeeds };

localForage.config({
	driver: localForage.INDEXEDDB,
	name: "otp-manager",
	storeName: "otps",
	version: 1.0,
});

async function getKey() {
	let data = await localForage.getItem("key");
	if (!data) {
		data = encryptKey(generateKey());
		await localForage.setItem("key", data);
	}
	return decryptKey(data as string).toString();
}

async function getSeeds() {
	const data = await localForage.getItem("seeds");
	if (!data) {
		return "[]";
	}
	return decryptData(data as string, await getKey());
}

async function setSeeds(seeds: OTPData[]) {
	const data = encryptData(JSON.stringify(seeds), await getKey());
	return localForage.setItem("seeds", data);
}
