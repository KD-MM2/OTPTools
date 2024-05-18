import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const ConfirmRemoveDialog = ({
	open,
	handleClose,
	handleConfirm,
}: {
	open: boolean;
	handleClose: () => void;
	handleConfirm: () => void;
}) => (
	<Dialog
		keepMounted
		open={open}
		aria-labelledby="alert-dialog-title"
		aria-describedby="alert-dialog-description"
	>
		<DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
		<DialogContent>
			<DialogContentText id="alert-dialog-description">
				Are you sure you want to delete this item?
			</DialogContentText>
		</DialogContent>
		<DialogActions>
			<Button onClick={handleClose} color="primary">
				Cancel
			</Button>
			<Button onClick={handleConfirm} color="primary" autoFocus>
				Confirm
			</Button>
		</DialogActions>
	</Dialog>
);

export default ConfirmRemoveDialog;
