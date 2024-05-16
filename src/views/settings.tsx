// Material UI Components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

// Material UI Icons

// Custom Components
import { DialogAppbar, SlideUpTransition, Snackbar } from "@/components/common";

// Utils
import { useState, useEffect, useCallback, useRef } from "react";
import { getSeeds, setSeeds } from "@/utils/localforage_handler";
import { emitCustomEvent, useCustomEventListener } from "react-custom-events";
import Divider from "@mui/material/Divider";
import SelectFileButton from "../components/add_new_otp/components/select_file_button";
import Typography from "@mui/material/Typography";
import PaperBox from "../components/settings/components/paper_box";

const page_width = "90%";

const Settings = () => {
	const [open, setOpen] = useState<boolean>(false);
	const handleClickOpen = useCallback(() => setOpen(true), []);
	const handleClose = useCallback(() => setOpen(false), []);
	const fileInputRef = useRef<HTMLInputElement>(null);

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
			<Stack
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "column",
					pt: 2,
				}}
				spacing={2}
			>
				<Divider sx={{ width: page_width }}>
					Backup / Restore / Sync
				</Divider>
				<PaperBox>
					<Button>Backup</Button>
					<Typography>Last backup: YYYY-MM-DD HH:MM:SS X</Typography>
				</PaperBox>

				<PaperBox>
					<SelectFileButton
						fileInputRef={fileInputRef}
						text="Select backup file"
						handleFileChange={() => {}}
						mimeTypes="application/octet-stream"
					/>
					<Typography>Last restore: YYYY-MM-DD HH:MM:SS X</Typography>
				</PaperBox>

				<Divider sx={{ width: page_width }}>OTP Generator</Divider>
				<Divider sx={{ width: page_width }}>OTP Manager</Divider>
			</Stack>
			<Snackbar />
		</Dialog>
	);
};

export default Settings;
