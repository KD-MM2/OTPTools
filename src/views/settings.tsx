// Material UI Components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

// Material UI Icons

// Custom Components
import { DialogAppbar, SlideUpTransition, Snackbar } from "@/components/common";
import {
	BackupRestoreSyncSection,
	OTPGeneratorSection,
	OTPManagerSection,
} from "@/components/settings";

// Utils
import { useState, useEffect, useCallback } from "react";
import { useCustomEventListener } from "react-custom-events";
import Divider from "@mui/material/Divider";

const page_width = "90%";

const Settings = () => {
	const [open, setOpen] = useState<boolean>(false);
	const handleClickOpen = useCallback(() => setOpen(true), []);
	const handleClose = useCallback(() => setOpen(false), []);

	useCustomEventListener("OpenDialog", (data: string) => {
		switch (data) {
			case "OPEN_SETTINGS_DIALOG":
				if (!open) handleClickOpen();
				else handleClose();
				break;
		}
	});

	return (
		<Dialog
			fullScreen
			open={open}
			onClose={handleClose}
			TransitionComponent={SlideUpTransition}
		>
			<DialogAppbar
				title="SETTINGS"
				actionText="SAVE"
				handleAction={() => {}}
				handleClose={handleClose}
			/>
			<BackupRestoreSyncSection />
			<OTPGeneratorSection />
			<OTPManagerSection />
			<Snackbar />
		</Dialog>
	);
};

export default Settings;
