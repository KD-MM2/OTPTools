// Material UI Icons
import KeyIcon from "@mui/icons-material/Key";
import LoopIcon from "@mui/icons-material/Loop";

const BottomBarButtons: BottomBarButton[] = [
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

export default BottomBarButtons;
