import { emitCustomEvent } from "react-custom-events";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import SettingsIcon from "@mui/icons-material/Settings";

const FabItems: FabItem[] = [
	{
		id: "settings",
		enabled: true,
		icon: <SettingsIcon />,
		name: "SETTINGS",
		cb: () => emitCustomEvent("OpenDialog", "OPEN_SETTINGS_DIALOG"),
	},
	{
		id: "edit",
		enabled: true,
		icon: <EditIcon />,
		name: "EDIT",
		cb: () => emitCustomEvent("OpenDialog", "OPEN_EDIT_DIALOG"),
	},
	{
		id: "add",
		enabled: true,
		icon: <AddCircleIcon />,
		name: "ADD",
		cb: () => emitCustomEvent("OpenDialog", "OPEN_ADD_NEW_OTP_DIALOG"),
	},
];

export default FabItems;
