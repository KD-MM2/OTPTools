import { useCallback, useEffect, useState } from "react";
import { emitCustomEvent, useCustomEventListener } from "react-custom-events";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { OTPItem } from "@/components";
import { generateTOTP, getSeeds, setSeeds, copyToClipboard } from "@/utils";
import { SpeedDial } from "@/views";

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

	const refreshSeedList = useCallback(() => {
		getSeeds().then((seeds) =>
			setOrgOtps(seeds.trim() === "" ? [] : JSON.parse(seeds))
		);
	}, []);

	useEffect(() => {
		refreshSeedList();
	}, [refreshSeedList]);

	useEffect(() => {
		const timer = setInterval(() => {
			const epoch = Math.round(Date.now() / 1000.0);
			if (epoch % 30 == 0) UpdateOTP();

			setProgress((oldProgress) => {
				const newProgress = Math.max(oldProgress - 100 / 150, 0);
				return newProgress <= 0 ? 100 : newProgress;
			});
		}, 200);
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
					handleAddNewOTP(
						data.data.map((otp, idx) => {
							return {
								...otp,
								id: orgOtps.length + (idx + 1),
							};
						})
					);
					break;

				case "REFRESH_OTP_LIST":
					refreshSeedList();
					break;
			}
		}
	);

	return (
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
			<SpeedDial open={open} setOpen={setOpen} progress={progress} />
		</Box>
	);
};

export default OTPManager;
