"use client";
import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useCustomEventListener } from "react-custom-events";

const SnackBar = () => {
	const [open, setOpen] = React.useState(false);
	const [message, setMessage] = React.useState("");
	const [severity, setSeverity] = React.useState<
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
