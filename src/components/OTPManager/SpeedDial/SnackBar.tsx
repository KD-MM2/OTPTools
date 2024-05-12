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
					setOpen(true);
					setMessage(data.message);
					setSeverity(data.severity);
					break;
			}
		}
	);

	return (
		<Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
			<Alert
				onClose={handleClose}
				severity={severity}
				variant="filled"
				sx={{ width: "100%", whiteSpace: "pre-line" }}
			>
				{message}
			</Alert>
		</Snackbar>
	);
};

export default SnackBar;
