import { useState, useRef, useEffect, RefObject, useCallback } from "react";
import { emitCustomEvent, useCustomEventListener } from "react-custom-events";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";

import {
	DialogAppbar,
	SlideUpTransition,
	Snackbar,
	NewOTPItem,
	SelectFileButton,
} from "@/components";
import { scrollIntoView, handleAddOTP, processImage } from "@/hooks";

const defaultOTP: OTPData[] = [
	{
		id: 1,
		user: "",
		issuer: "",
		secret: "",
	},
];

const AddNewOTP = () => {
	const [open, setOpen] = useState(false);
	const [otpList, setOTPList] = useState<OTPData[]>(defaultOTP);
	const listRef = useRef<HTMLDivElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (document.activeElement?.id.includes("new-otp-")) return;
		scrollIntoView(listRef);
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

	const handleOTPItemChange = useCallback(
		(index: number, updatedOTP: OTPData) => {
			const updatedOTPList = [...otpList];
			updatedOTPList[index] = updatedOTP;
			setOTPList(updatedOTPList);
		},
		[otpList]
	);

	const handleFile = useCallback((file: File) => {
		if (!file) return;
		processImage(file)
			.then((newOTP) => {
				if (!newOTP) throw new Error();
				console.log(newOTP);
				setOTPList((oldList: any) => {
					const newList = [...oldList, newOTP];
					const isFirstEntryEmpty =
						oldList.length == 1 &&
						(oldList[0].user == "" || oldList[0].secret == "");
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
			if (!file) return;
			handleFile(file);
		},
		[handleFile]
	);

	const handlePasteEvent = useCallback(
		(event: ClipboardEvent) => {
			const items = event.clipboardData?.items;
			if (items) {
				for (const item of items) {
					if (item.type.indexOf("image") !== -1) {
						handleFile(item.getAsFile() as File);
					}
				}
			}
		},
		[handleFile]
	);

	useEffect(() => {
		if (!open) return;
		document.addEventListener("paste", handlePasteEvent);
		return () => {
			document.removeEventListener("paste", handlePasteEvent);
		};
	}, [handlePasteEvent, open]);

	return (
		<Dialog
			fullScreen
			open={open}
			onClose={handleClose}
			TransitionComponent={SlideUpTransition}
		>
			<DialogAppbar
				title="ADD OTP"
				actionText="ADD"
				handleAction={() => handleAddOTP(otpList)}
				handleClose={handleClose}
			/>
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
				<SelectFileButton
					fileInputRef={fileInputRef}
					text="Select QR image"
					handleFileChange={handleFileChange}
					mimeTypes="image/*"
				/>
				<Typography variant="caption">
					(Copy-Paste works too!)
				</Typography>
			</List>
			<Snackbar />
		</Dialog>
	);
};

export default AddNewOTP;
