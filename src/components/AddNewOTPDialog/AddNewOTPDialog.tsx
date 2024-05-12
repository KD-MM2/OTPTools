import {
	forwardRef,
	ReactElement,
	Ref,
	useState,
	useRef,
	useEffect,
	RefObject,
} from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import List from "@mui/material/List";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { emitCustomEvent, useCustomEventListener } from "react-custom-events";
import NewOTPItem from "./NewOTPItem";

const Transition = forwardRef(function Transition(
	props: TransitionProps & {
		children: ReactElement;
	},
	ref: Ref<unknown>
) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const defaultOTP: OTPData[] = [
	{
		user: "",
		issuer: "",
		secret: "",
	},
];

export default function AddNewOTPDialog() {
	const [open, setOpen] = useState(false);
	const [otpList, setOTPList] = useState<OTPData[]>(defaultOTP);
	const listRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (listRef.current) {
			if (document.activeElement?.id.includes("new-otp-")) return;
			const lastChild = listRef.current.lastChild as HTMLElement;
			lastChild?.scrollIntoView({ behavior: "smooth" });
		}
	}, [otpList]);

	const handleClickOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	useCustomEventListener("OpenDialog", (data: string) => {
		switch (data) {
			case "OPEN_ADD_NEW_OTP_DIALOG":
				if (!open) handleClickOpen();
				else handleClose();
				break;
		}
	});

	useCustomEventListener(
		"Operations",
		(data: { type: string; data: string }) => {
			switch (data.type) {
				case "NEW_OTP_RESULT":
					if (data.data === "ADDED") {
						setOTPList(defaultOTP);
						emitCustomEvent("SnackBarEvent", {
							type: "SHOW_SNACKBAR",
							message: "New OTP has been added successfully!",
							severity: "success",
						});
						handleClose();
						break;
					} else {
						emitCustomEvent("SnackBarEvent", {
							type: "SHOW_SNACKBAR",
							message: "Failed to add new OTP! Please try again.",
							severity: "error",
						});
						break;
					}
			}
		}
	);

	const handleOTPItemChange = (index: number, updatedOTP: OTPData) => {
		const updatedOTPList = [...otpList];
		updatedOTPList[index] = updatedOTP;
		setOTPList(updatedOTPList);
	};

	const handleAddOTP = () => {
		const isOTPListValid = otpList.every(
			(otp) => otp.user !== "" && otp.secret !== ""
		);
		if (!isOTPListValid) {
			emitCustomEvent("SnackBarEvent", {
				type: "SHOW_SNACKBAR",
				message: "Please fill all the required fields!",
				severity: "error",
			});
			return;
		}
		emitCustomEvent("Operations", {
			type: "ADD_NEW_OTP",
			data: otpList.map((otp) => ({
				...otp,
				secret: otp.secret.replace(/\s/g, ""),
			})),
		});
	};

	return (
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
						ADD NEW OTP
					</Typography>
					<Button
						autoFocus
						color="inherit"
						onClick={() => handleAddOTP()}
					>
						SAVE
					</Button>
				</Toolbar>
			</AppBar>
			<List
				ref={listRef as unknown as RefObject<HTMLUListElement>}
				sx={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					marginTop: "1rem",
					gap: "1rem",
				}}
			>
				{otpList.map((otp, index) => (
					<NewOTPItem
						key={`new-otp-${index}`}
						otp={otp}
						index={index}
						onChange={(updated: OTPData) =>
							handleOTPItemChange(index, updated)
						}
						onRemove={() =>
							setOTPList((oldList) =>
								oldList.filter((_, i) => i !== index)
							)
						}
					/>
				))}
				<Button
					onClick={() =>
						setOTPList((otpList) => [
							...otpList,
							{
								user: "",
								issuer: "",
								secret: "",
							},
						])
					}
					autoFocus={false}
				>
					Add more
				</Button>
			</List>
		</Dialog>
	);
}
