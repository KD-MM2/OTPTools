import localForage from "localforage";

import {
	generateKey,
	encryptKey,
	decryptKey,
	encryptData,
	decryptData,
} from "@/utils";

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

async function getAllItems() {
	const items: any[] = [];
	await localForage.iterate((value, key) => {
		items.push({ key, value });
	});
	return items;
}

async function clearAllItems() {
	await localForage.clear();
}

async function addAllItems(items: any[]) {
	for (const item of items) {
		await localForage.setItem(item.key, item.value);
	}
}

async function saveSetting(value: any) {
	await localForage.setItem("settings", JSON.stringify(value));
}

async function getSetting() {
	return localForage.getItem("settings");
}

export {
	getSeeds,
	setSeeds,
	getAllItems,
	clearAllItems,
	addAllItems,
	saveSetting,
	getSetting,
};
