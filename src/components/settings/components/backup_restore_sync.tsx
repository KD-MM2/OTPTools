import dayjs from "dayjs";

import { useCallback, useEffect, useRef, useState } from "react";

import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { SelectFileButton, ChangeID, CopyButton, PaperBox } from "@/components";
import { useInstance } from "@/hooks";
import {
	getAllItems,
	base64Encode,
	clearAllItems,
	addAllItems,
	downloadFile,
} from "@/utils";

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

	const handleBackup = useCallback(() => {
		const time = dayjs().unix();
		dispatch({ type: "set_last_backup", payload: time });

		getAllItems().then((items) => {
			downloadFile(
				JSON.stringify(items),
				`backup_${dayjs.unix(time).format("YYYYMMDD-HHmmss")}.json`,
				"application/json"
			);
		});
	}, [dispatch]);

	const handleRestore = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];
			if (!file) return;

			const fileReader = new FileReader();
			fileReader.onload = () => {
				const fileContent = fileReader.result as string;
				const items = JSON.parse(fileContent);

				clearAllItems().then(() => {
					addAllItems(items).then(() => {
						dispatch({
							type: "set_last_restore",
							payload: dayjs().unix(),
						});
					});
				});
			};
			fileReader.readAsText(file);
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
								? dayjs
										.unix(setting.last_sync)
										.format("YYYY-MM-DD HH:mm:ss Z")
								: "N/A"}
						</Typography>
						<Typography variant="caption">
							ID: {displayInstanceId}
							<CopyButton value={instanceId} />
						</Typography>
					</Stack>
				</PaperBox>

				<PaperBox>
					<Button onClick={handleBackup}>Backup</Button>
					<Typography variant="caption">
						Last backup:{" "}
						{setting.last_backup > 0
							? dayjs
									.unix(setting.last_backup)
									.format("YYYY-MM-DD HH:mm:ss Z")
							: "N/A"}
					</Typography>
				</PaperBox>

				<PaperBox>
					<SelectFileButton
						fileInputRef={fileInputRef}
						text="Select file to restore"
						handleFileChange={handleRestore}
						mimeTypes="application/json"
					/>
					<Typography variant="caption">
						Last restore:{" "}
						{setting.last_restore > 0
							? dayjs
									.unix(setting.last_restore)
									.format("YYYY-MM-DD HH:mm:ss Z")
							: "N/A"}
					</Typography>
				</PaperBox>
			</Stack>
		</>
	);
};

export default BackupRestoreSyncSection;
