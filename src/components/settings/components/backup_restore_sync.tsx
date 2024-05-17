// Material UI Components
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import PaperBox from "./paper_box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

// Custom Components
import { SelectFileButton } from "@/components/add_new_otp";
import { ChangeID } from "@/components/settings";

// Utils
import { useCallback, useEffect, useRef, useState } from "react";
import { useInstance } from "@/hooks";
import { CopyButton } from "@/components/otp_generator";

const width = "90%";

const BackupRestoreSyncSection = () => {
	const { instanceId, changeInstanceId } = useInstance();
	const [displayInstanceId, setDisplayInstanceId] = useState<string>("N/A");
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [open, setOpen] = useState(false);
	const handleClickOpen = useCallback(() => setOpen(true), []);
	const handleClose = useCallback(() => setOpen(false), []);

	useEffect(() => {
		if (instanceId.length > 0) {
			setDisplayInstanceId(
				instanceId.slice(0, 6) + "*".repeat(instanceId.length - 6)
			);
			handleClose();
		}
	}, [handleClose, instanceId]);

	return (
		<>
			<ChangeID
				open={open}
				handleConfirm={(newId: string) => changeInstanceId(newId)}
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
				<Divider sx={{ width: width }}>Sync ・ Backup ・ Restore</Divider>
				<PaperBox>
					<Stack direction="column">
						<Button>Sync</Button>
						<Button onClick={handleClickOpen}>Change ID</Button>
					</Stack>
					<Stack direction="column" textAlign="right">
						<Typography variant="caption">
							Last sync YYYY-MM-DD HH:MM:SS X
						</Typography>
						<Typography variant="caption">
							ID {displayInstanceId}
							<CopyButton value={instanceId} />
						</Typography>
					</Stack>
				</PaperBox>

				<PaperBox>
					<Button>Backup</Button>
					<Typography variant="caption">
						Last backup YYYY-MM-DD HH:MM:SS X
					</Typography>
				</PaperBox>

				<PaperBox>
					<SelectFileButton
						fileInputRef={fileInputRef}
						text="Select file to restore"
						handleFileChange={() => {}}
						mimeTypes="application/octet-stream"
					/>
					<Typography variant="caption">
						Last restore YYYY-MM-DD HH:MM:SS X
					</Typography>
				</PaperBox>
			</Stack>
		</>
	);
};

export default BackupRestoreSyncSection;
