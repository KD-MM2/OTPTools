import { useState } from "react";
import { useCustomEventListener } from "react-custom-events";

import { Snackbar as MuiSnackbar } from "@mui/material";
import Alert from "@mui/material/Alert";

const Snackbar = () => {
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
		<MuiSnackbar open={open} autoHideDuration={2000} onClose={handleClose}>
			<Alert
				onClose={handleClose}
				severity={severity}
				variant="filled"
				sx={{ width: "100%", whiteSpace: "pre-line", zIndex: 9999 }}
			>
				{message}
			</Alert>
		</MuiSnackbar>
	);
};

export default Snackbar;
