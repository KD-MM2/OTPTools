import KeyIcon from "@mui/icons-material/Key";
import LoopIcon from "@mui/icons-material/Loop";

const BottomBarItems: BottomBarItem[] = [
	{
		id: "otp-manager",
		label: "OTP Manager",
		path: "/",
		icon: <KeyIcon />,
	},
	{
		id: "otp-generator",
		label: "OTP Generator",
		path: "/otp-generator",
		icon: <LoopIcon />,
	},
];

export default BottomBarItems;
