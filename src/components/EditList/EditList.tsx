// Material UI Components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";

// Material UI Icons
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

// Custom Components
import SnackBar from "@/components/BottomBar/SnackBar";
import SortableList from "@/components/EditList/SortableList";
import ConfirmRemoveDialog from "@/components/EditList/ConfirmRemoveDialog";
import DialogAppbar from "@/components/FullscreenDialogAppbar/FullscreenDialogAppbar";
import Transition from "@/components/FullscreenDialogAppbar/SlideUpTransition";

// Utils
import { useState, useEffect, useCallback } from "react";
import { getSeeds, setSeeds } from "@/utils/localforage_handler";
import { emitCustomEvent, useCustomEventListener } from "react-custom-events";

const EditList = () => {
	const [open, setOpen] = useState<boolean>(false);
	const [otps, setOtps] = useState<OTPData[]>([]);
	const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
	const [deleteId, setDeleteId] = useState<number>(-1);

	const handleConfirmOpen = useCallback((id: number) => {
		setDeleteId(id);
		setConfirmOpen(true);
	}, []);
	const handleConfirmClose = useCallback(() => setConfirmOpen(false), []);
	const handleClickOpen = useCallback(() => setOpen(true), []);
	const handleClose = useCallback(() => setOpen(false), []);

	useCustomEventListener("OpenDialog", (data: string) => {
		switch (data) {
			case "OPEN_EDIT_DIALOG":
				if (!open) handleClickOpen();
				else handleClose();
				break;
		}
	});

	useEffect(() => {
		getSeeds().then((seeds) =>
			setOtps(seeds.trim() === "" ? [] : JSON.parse(seeds))
		);
	}, [open]);

	const handleChange = useCallback((updated: OTPData[]) => {
		setOtps(updated);
	}, []);

	const handleSave = useCallback(() => {
		setSeeds(otps)
			.then(() => {
				emitCustomEvent("Operations", {
					type: "REFRESH_OTP_LIST",
					data: [],
				});
				emitCustomEvent("SnackBarEvent", {
					type: "SHOW_SNACKBAR",
					message: "Changes saved!",
					severity: "success",
				});
			})
			.catch((err) => {
				emitCustomEvent("SnackBarEvent", {
					type: "SHOW_SNACKBAR",
					message: `Error: ${err}`,
					severity: "error",
				});
			})
			.finally(() => {
				handleClose();
			});
	}, [handleClose, otps]);

	const handleConfirmDelete = useCallback(() => {
		setOtps(otps.filter((otp) => otp.id !== deleteId));
		setDeleteId(-1);
		setConfirmOpen(false);
	}, [deleteId, otps]);

	return (
		<>
			<Dialog
				fullScreen
				open={open}
				onClose={handleClose}
				TransitionComponent={Transition}
			>
				<DialogAppbar
					title="EDIT OTP LIST"
					actionText="SAVE"
					handleAction={handleSave}
					handleClose={handleClose}
				/>
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<SortableList
						items={otps}
						onChange={handleChange}
						renderItem={(item) => (
							<SortableList.Item id={item.id} key={item.id}>
								{item.user}
								<br />
								{item.issuer}
								<Box>
									<Button
										sx={{ p: "15px" }}
										color="error"
										onClick={() =>
											handleConfirmOpen(item.id)
										}
									>
										<DeleteForeverIcon />
									</Button>
									<SortableList.DragHandle />
								</Box>
							</SortableList.Item>
						)}
					/>
				</Box>
				<ConfirmRemoveDialog
					open={confirmOpen}
					handleClose={handleConfirmClose}
					handleConfirm={handleConfirmDelete}
				/>
				<SnackBar />
			</Dialog>
		</>
	);
};

export default EditList;
