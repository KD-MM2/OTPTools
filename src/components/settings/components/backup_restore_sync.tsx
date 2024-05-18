import dayjs from "dayjs";

import { useCallback, useEffect, useRef, useState } from "react";

import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { SelectFileButton, ChangeID, CopyButton, PaperBox } from "@/components";
import { useInstance } from "@/hooks";

const width = "90%";

const BackupRestoreSyncSection = ({
	setting,
	dispatch,
}: {
	setting: SettingState;
	dispatch: React.Dispatch<SettingAction>;
}) => {
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

	const handleSetTime = useCallback(
		(key: string, value: number) => {
			dispatch({ type: key as any, payload: value });
		},
		[dispatch]
	);

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
				<Divider sx={{ width: width }}>
					Sync ・ Backup ・ Restore
				</Divider>
				<PaperBox>
					<Stack direction="column">
						<Button>Sync</Button>
						<Button onClick={handleClickOpen}>Change ID</Button>
					</Stack>
					<Stack direction="column" textAlign="right">
						<Typography variant="caption">
							Last sync:{" "}
							{setting.last_sync > 0
								? dayjs(setting.last_sync).format(
										"YYYY-MM-DD HH:mm:ss Z"
									)
								: "N/A"}
						</Typography>
						<Typography variant="caption">
							ID: {displayInstanceId}
							<CopyButton value={instanceId} />
						</Typography>
					</Stack>
				</PaperBox>

				<PaperBox>
					<Button>Backup</Button>
					<Typography variant="caption">
						Last backup:{" "}
						{setting.last_backup > 0
							? dayjs(setting.last_backup).format(
									"YYYY-MM-DD HH:mm:ss Z"
								)
							: "N/A"}
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
						Last restore:{" "}
						{setting.last_restore > 0
							? dayjs(setting.last_restore).format(
									"YYYY-MM-DD HH:mm:ss Z"
								)
							: "N/A"}
					</Typography>
				</PaperBox>
			</Stack>
		</>
	);
};

export default BackupRestoreSyncSection;
