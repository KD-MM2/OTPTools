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
	const data = await localForage.getItem("key");
	if (!data || data === "") {
		await localForage.setItem("key", encryptKey(generateKey()));
	}
	return decryptKey(data as string).toString();
}

async function getSeeds() {
	const key = await getKey();
	const data = await localForage.getItem("seeds");
	if (!data) {
		return "[]";
	}
	return decryptData(data as string, key);
}

async function setSeeds(seeds: OTPData[]) {
	const data = encryptData(JSON.stringify(seeds), await getKey());
	return localForage.setItem("seeds", data);
}
