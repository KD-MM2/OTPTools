import { Box, Typography, Stack, Divider } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { generateTOTP } from "@/utils/otp";
import OTPItem from "@/components/OTPManager/OTPItem/OTPItem";
import SpeedDial from "@/components/OTPManager/SpeedDial/SpeedDial";

const OTPs: OTPData[] = [
	{
		user: "user1",
		issuer: "issuer1",
		secret: "SZWEFCVNWUJFM73B",
	},
];

const OTPManager = function () {
	const [open, setOpen] = useState(false);
	const [otps, setOtps] = useState<OTPData[]>(OTPs);
	const [progress, setProgress] = useState<number>(100);

	const UpdateOTP = useCallback(() => {
		setOtps(
			OTPs.map((otp) => {
				const newOTP = generateTOTP({
					key: otp.secret,
					now: Math.round(Date.now() / 1000.0),
				});
				return { ...otp, otp: newOTP.code };
			})
		);
		setProgress(100);
	}, []);

	useEffect(() => {
		UpdateOTP();
	}, [UpdateOTP]);

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
							<OTPItem otp={otp} />
						</div>
					))}
				</Stack>
			</Box>

			<SpeedDial open={open} setOpen={setOpen} progress={progress} />
		</>
	);
};

export default OTPManager;
