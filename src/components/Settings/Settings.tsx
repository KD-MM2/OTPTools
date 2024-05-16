// Material UI Components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

// Material UI Icons

// Custom Components
import SnackBar from "@/components/BottomBar/SnackBar";
import DialogAppbar from "@/components/FullscreenDialogAppbar/FullscreenDialogAppbar";
import Transition from "@/components/FullscreenDialogAppbar/SlideUpTransition";

// Utils
import { useState, useEffect, useCallback } from "react";
import { getSeeds, setSeeds } from "@/utils/localforage_handler";
import { emitCustomEvent, useCustomEventListener } from "react-custom-events";
import Divider from "@mui/material/Divider";
import SelectFileButton from "../AddNewOTPDialog/select_file_button";
import Typography from "@mui/material/Typography";
import PaperBox from "./paper_box";

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
		<>
			<Dialog
				fullScreen
				open={open}
				onClose={handleClose}
				TransitionComponent={Transition}
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
					<Stack spacing={2} direction="column" width={page_width}>
						<PaperBox>
							<Button>Backup</Button>
							<Typography>
								Last backup: YYYY-MM-DD HH:MM:SS X
							</Typography>
						</PaperBox>

						<PaperBox>
							<SelectFileButton
								text="Select backup file"
								handleFileChange={() => {}}
								mimeTypes="application/octet-stream"
							/>
							<Typography>
								Last restore: YYYY-MM-DD HH:MM:SS X
							</Typography>
						</PaperBox>
					</Stack>
					<Divider sx={{ width: page_width }}>OTP Generator</Divider>
					<Divider sx={{ width: page_width }}>OTP Manager</Divider>
				</Stack>
				<SnackBar />
			</Dialog>
		</>
	);
};

export default Settings;
