import { getSeeds, setSeeds } from "@/utils/localforage_handler";
import { useState, useEffect, useCallback } from "react";
import SortableList from "./SortableList";
import { emitCustomEvent } from "react-custom-events";

const ChangeOrder = () => {
	const [otps, setOtps] = useState<OTPData[]>([]);

	useEffect(() => {
		getSeeds().then((seeds) =>
			setOtps(seeds.trim() === "" ? [] : JSON.parse(seeds))
		);
	}, []);

	const handleChange = useCallback((updated: OTPData[]) => {
		setOtps(updated);
		setSeeds(updated).then(() =>
			emitCustomEvent("SnackBarEvent", {
				type: "SHOW_SNACKBAR",
				message: "Sorted list saved!",
				severity: "success",
			})
		);
	}, []);

	return (
		<>
			<SortableList
				items={otps}
				onChange={handleChange}
				renderItem={(item) => (
					<SortableList.Item id={item.id}>
						{item.user}
						<SortableList.DragHandle />
					</SortableList.Item>
				)}
			/>
		</>
	);
};

export default ChangeOrder;
