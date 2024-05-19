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
import { useSetting, useSettingDispatch } from "@/hooks";
import { saveSetting } from "@/utils";

const Settings = () => {
	const setting = useSetting();
	const dispatch = useSettingDispatch();

	const [open, setOpen] = useState<boolean>(false);
	const handleClickOpen = useCallback(() => setOpen(true), []);
	const handleClose = useCallback(() => setOpen(false), []);
	const handleSave = useCallback(() => {
		saveSetting(setting);
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
			<BackupRestoreSyncSection setting={setting} dispatch={dispatch} />
			<OTPGeneratorSection setting={setting} dispatch={dispatch} />
			<OTPManagerSection setting={setting} dispatch={dispatch} />
			<Snackbar />
		</Dialog>
	);
};

export default Settings;
