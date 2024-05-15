import {
	forwardRef,
	ReactElement,
	Ref,
	useState,
	useRef,
	useEffect,
	RefObject,
	useCallback,
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
import Divider from "@mui/material/Divider";
import { BrowserQRCodeReader } from "@zxing/browser";
import SnackBar from "@/components/BottomBar/SnackBar";
import { otpStringParser } from "@/utils/otp";

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
		id: 1,
		user: "",
		issuer: "",
		secret: "",
	},
];

export default function AddNewOTPDialog() {
	const [open, setOpen] = useState(false);
	const [otpList, setOTPList] = useState<OTPData[]>(defaultOTP);
	const listRef = useRef<HTMLDivElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (listRef.current) {
			if (document.activeElement?.id.includes("new-otp-")) return;
			const lastChild = listRef.current.lastChild as HTMLElement;
			lastChild?.scrollIntoView({ behavior: "smooth" });
		}
	}, [otpList]);

	const handleClickOpen = useCallback(() => setOpen(true), []);
	const handleClose = useCallback(() => setOpen(false), []);

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

	const processImage = useCallback(async (file: File) => {
		new BrowserQRCodeReader()
			.decodeFromImageUrl(URL.createObjectURL(file))
			.then((result) => {
				const newOTP = otpStringParser(result.getText());
				if (
					newOTP.secret === "" ||
					result.getText() === "" ||
					result.getText() === null
				)
					throw new Error();

				setOTPList((oldList) => {
					const newList = [...oldList, newOTP];
					const isFirstEntryEmpty =
						oldList.length === 1 &&
						(oldList[0].user === "" || oldList[0].secret === "");
					return isFirstEntryEmpty ? [newOTP] : newList;
				});
			})
			.catch(() => {
				emitCustomEvent("SnackBarEvent", {
					type: "SHOW_SNACKBAR",
					message: "Failed to extract OTP from image!",
					severity: "error",
				});
			})
			.finally(() => {
				fileInputRef.current!.value = "";
			});
	}, []);

	const handleFileChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];
			if (file) {
				processImage(file);
			}
		},
		[processImage]
	);

	const handlePaste = useCallback(
		(event: ClipboardEvent) => {
			const items = event.clipboardData?.items;
			if (items) {
				for (const item of items) {
					if (item.type.indexOf("image") !== -1) {
						const file = item.getAsFile();
						if (file) {
							processImage(file);
							break;
						}
					} else {
						emitCustomEvent("SnackBarEvent", {
							type: "SHOW_SNACKBAR",
							message: "Failed to extract image from clipboard!",
							severity: "error",
						});
					}
				}
			}
		},
		[processImage]
	);

	useEffect(() => {
		if (!open) return;
		document.addEventListener("paste", handlePaste);
		return () => {
			document.removeEventListener("paste", handlePaste);
		};
	}, [handlePaste, open]);

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
								id: otpList.length + 1,
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
				<Divider sx={{ width: "50%" }}>OR</Divider>
				<Button
					onClick={() => fileInputRef?.current!.click()}
					autoFocus={false}
				>
					Select QR image
					<input
						type="file"
						accept="image/*"
						ref={fileInputRef}
						onChange={(event) => handleFileChange(event)}
						hidden
					/>
				</Button>
				<Typography variant="caption">
					(Copy-Paste works too!)
				</Typography>
			</List>
			<SnackBar />
		</Dialog>
	);
}
