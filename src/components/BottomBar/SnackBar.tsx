// Material UI Components
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

// Utils
import { useCustomEventListener } from "react-custom-events";
import { useState } from "react";

const SnackBar = () => {
	const [open, setOpen] = useState(false);
	const [message, setMessage] = useState("");
	const [severity, setSeverity] = useState<
		"success" | "info" | "warning" | "error"
	>("info");

	const handleClose = () => setOpen(false);

	useCustomEventListener(
		"SnackBarEvent",
		(data: {
			type: string;
			message: string;
			severity: "success" | "info" | "warning" | "error";
		}) => {
			switch (data.type) {
				case "SHOW_SNACKBAR":
					setMessage(data.message);
					setSeverity(data.severity);
					setOpen(true);
					break;
			}
		}
	);

	return (
		<Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
			<Alert
				onClose={handleClose}
				severity={severity}
				variant="filled"
				sx={{ width: "100%", whiteSpace: "pre-line", zIndex: 9999 }}
			>
				{message}
			</Alert>
		</Snackbar>
	);
};

export default SnackBar;
