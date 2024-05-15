import { getSeeds, setSeeds } from "@/utils/localforage_handler";
import {
	useState,
	useEffect,
	useCallback,
	forwardRef,
	ReactElement,
	Ref,
} from "react";
import SortableList from "./SortableList";
import { emitCustomEvent, useCustomEventListener } from "react-custom-events";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import {
	AppBar,
	Box,
	Button,
	IconButton,
	Slide,
	Toolbar,
	Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import SnackBar from "@/components/BottomBar/SnackBar";

const Transition = forwardRef(function Transition(
	props: TransitionProps & {
		children: ReactElement;
	},
	ref: Ref<unknown>
) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const ChangeOrder = () => {
	const [open, setOpen] = useState<boolean>(false);
	const [otps, setOtps] = useState<OTPData[]>([]);

	const handleClickOpen = useCallback(() => setOpen(true), []);
	const handleClose = useCallback(() => setOpen(false), []);

	useCustomEventListener("OpenDialog", (data: string) => {
		switch (data) {
			case "OPEN_CHANGE_ORDER_DIALOG":
				if (!open) handleClickOpen();
				else handleClose();
				break;
		}
	});

	useEffect(() => {
		getSeeds().then((seeds) =>
			setOtps(seeds.trim() === "" ? [] : JSON.parse(seeds))
		);
	}, []);

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
					message: "Sorted list saved!",
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

	return (
		<>
			<Dialog
				fullScreen
				open={open}
				onClose={handleClose}
				TransitionComponent={Transition}
			>
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
						<Typography
							sx={{ ml: 2, flex: 1 }}
							variant="h6"
							component="div"
						>
							CHANGE LIST ORDER
						</Typography>
						<Button
							autoFocus
							color="inherit"
							onClick={() => handleSave()}
						>
							SAVE
						</Button>
					</Toolbar>
				</AppBar>
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
								<SortableList.DragHandle />
							</SortableList.Item>
						)}
					/>
				</Box>
				<SnackBar />
			</Dialog>
		</>
	);
};

export default ChangeOrder;
