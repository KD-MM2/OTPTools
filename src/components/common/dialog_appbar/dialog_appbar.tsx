// Material UI Components
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

// Material UI Icons
import CloseIcon from "@mui/icons-material/Close";

const DialogAppbar = ({
	handleClose,
	handleAction,
	title,
	actionText,
}: {
	handleClose: () => void;
	handleAction: () => void;
	title: string;
	actionText: string;
}) => (
	<AppBar sx={{ position: "sticky" }}>
		<Toolbar>
			<IconButton
				edge="start"
				color="inherit"
				onClick={handleClose}
				aria-label="close"
			>
				<CloseIcon />
			</IconButton>
			<Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
				{title}
			</Typography>
			<Button autoFocus color="inherit" onClick={handleAction}>
				{actionText}
			</Button>
		</Toolbar>
	</AppBar>
);

export default DialogAppbar;
