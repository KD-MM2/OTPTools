import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { useCallback, useEffect, useState } from "react";
import { generateTOTP } from "@/utils/otp";
import OTPItem from "@/components/OTPManager/OTPItem/OTPItem";
import SpeedDial from "@/components/OTPManager/SpeedDial/SpeedDial";
import { getSeeds, setSeeds } from "@/utils/localforage_handler";
import { emitCustomEvent, useCustomEventListener } from "react-custom-events";

const OTPManager = function () {
	const [open, setOpen] = useState(false);
	const [orgOtps, setOrgOtps] = useState<OTPData[]>([]);
	const [otps, setOtps] = useState<OTPData[]>([]);
	const [progress, setProgress] = useState<number>(100);

	const UpdateOTP = useCallback(() => {
		setOtps(
			orgOtps.map((otp) => {
				const newOTP = generateTOTP({
					key: otp.secret,
					now: Math.round(Date.now() / 1000.0),
				});
				return { ...otp, otp: newOTP.code };
			})
		);
		setProgress(100);
	}, [orgOtps]);

	useEffect(() => UpdateOTP(), [UpdateOTP]);

	useEffect(() => {
		getSeeds().then((seeds) =>
			setOrgOtps(seeds.trim() === "" ? [] : JSON.parse(seeds))
		);
	}, []);

	useEffect(() => {
		const timer = setInterval(() => {
			const epoch = Math.round(Date.now() / 1000.0);
			if (epoch % 30 == 0) UpdateOTP();

			setProgress((oldProgress) => {
				const newProgress = Math.max(oldProgress - 100 / 30, 0);
				return newProgress <= 0 ? 100 : newProgress;
			});
		}, 1000);
		return () => {
			clearInterval(timer);
		};
	}, [UpdateOTP]);

	const handleAddNewOTP = useCallback(
		(data: OTPData[]) => {
			const joined = [...orgOtps, ...data];
			setOrgOtps(joined);
			setSeeds(joined).then(() =>
				emitCustomEvent("Operations", {
					type: "NEW_OTP_RESULT",
					data: "ADDED",
				})
			);
		},
		[orgOtps]
	);

	useCustomEventListener(
		"Operations",
		(data: { type: string; data: OTPData[] }) => {
			switch (data.type) {
				case "ADD_NEW_OTP":
					handleAddNewOTP(data.data);
					break;
			}
		}
	);

	const copyToClipboard = async (text: string) => {
		await navigator.clipboard.writeText(text);
		emitCustomEvent("SnackBarEvent", {
			type: "SHOW_SNACKBAR",
			message: "Copied to clipboard!",
			severity: "info",
		});
	};

	return (
		<>
			<Box>
				<Typography variant="h6" gutterBottom>
					One-Time Password Manager
				</Typography>
				<Divider />
				<Stack direction="column" spacing={2} sx={{ pt: 1 }}>
					{otps.map((otp, index) => (
						<div key={index}>
							<OTPItem
								otp={otp}
								onClick={() => copyToClipboard(otp.otp ?? "")}
							/>
						</div>
					))}
				</Stack>
			</Box>
			<SpeedDial open={open} setOpen={setOpen} progress={progress} />
		</>
	);
};

export default OTPManager;
