import { generateUUID } from "@/utils/uuid";
import localForage from "localforage";
import { useEffect, useState } from "react";

const useInstance = () => {
	const [instanceId, setInstanceId] = useState<string>("");

	const getInstanceId = async () => {
		const id = await localForage.getItem("instanceId");
		if (!id) {
			const newId = generateUUID();
			await localForage.setItem("instanceId", newId);
			setInstanceId(newId);
		} else {
			setInstanceId(id as string);
		}
	};

	const changeInstanceId = async (id: string) => {
		await localForage.setItem("instanceId", id);
		setInstanceId(id);
	};

	useEffect(() => {
		getInstanceId();
	}, []);

	return { instanceId, changeInstanceId };
};

export default useInstance;
