import { useCallback, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { CustomTextField } from "@/components";

const ChangeID = ({
	open,
	handleClose,
	handleConfirm,
}: {
	open: boolean;
	handleClose: () => void;
	handleConfirm: (newId: string) => void;
}) => {
	const [newID, setNewID] = useState<string>("");
	const [isInputError, setIsInputError] = useState<boolean>(false);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setNewID(e.target.value);
			const v4 = new RegExp(
				/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
			);
			if (!v4.test(e.target.value)) setIsInputError(true);
			else isInputError && setIsInputError(false);
		},
		[isInputError]
	);

	return (
		<Dialog
			keepMounted
			open={open}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">Change ID</DialogTitle>
			<DialogContent sx={{ padding: "2rem", margin: "1rem" }}>
				<Box p="1rem 0">
					<CustomTextField
						id="new-id-input"
						label="New ID"
						value={newID ?? ""}
						onChange={handleChange}
						props={{
							error: isInputError,
							autoComplete: "off",
							autoCorrect: "off",
						}}
					/>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={() => {
						handleClose();
						setNewID("");
						setIsInputError(false);
					}}
					color="primary"
				>
					Cancel
				</Button>
				<Button
					onClick={() => {
						handleConfirm(newID);
						setNewID("");
						setIsInputError(false);
					}}
					color={isInputError ? "error" : "primary"}
					disabled={newID == "" || isInputError}
					autoFocus
				>
					Confirm
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ChangeID;
