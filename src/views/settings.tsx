// Utils
import localForage from "localforage";

import { useState, useCallback } from "react";
import { useCustomEventListener } from "react-custom-events";

import Dialog from "@mui/material/Dialog";

import {
	DialogAppbar,
	SlideUpTransition,
	Snackbar,
	BackupRestoreSyncSection,
	OTPGeneratorSection,
	OTPManagerSection,
} from "@/components";
import { useSetting } from "@/hooks";

const Settings = () => {
	const setting = useSetting();

	const [open, setOpen] = useState<boolean>(false);
	const handleClickOpen = useCallback(() => setOpen(true), []);
	const handleClose = useCallback(() => setOpen(false), []);
	const handleSave = useCallback(() => {
		localForage.setItem("settings", JSON.stringify(setting));
		handleClose();
	}, [handleClose, setting]);

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
				handleAction={handleSave}
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
