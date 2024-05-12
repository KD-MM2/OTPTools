import AddCircleIcon from "@mui/icons-material/AddCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import { emitCustomEvent } from "react-custom-events";

const FabActions: FabAction[] = [
	{
		id: "settings",
		enabled: true,
		icon: <SettingsIcon />,
		name: "SETTINGS",
		cb: () => emitCustomEvent("OpenDialog", "OPEN_SETTINGS_DIALOG"),
	},
	{
		id: "add",
		enabled: true,
		icon: <AddCircleIcon />,
		name: "ADD",
		cb: () => emitCustomEvent("OpenDialog", "OPEN_ADD_NEW_OTP_DIALOG"),
	},
];

export default FabActions;
