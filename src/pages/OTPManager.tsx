import { Box, Typography, Stack, Divider } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { generateTOTP } from "@/utils/otp";
import OTPItem from "@/components/OTPManager/OTPItem/OTPItem";
import SpeedDial from "@/components/OTPManager/SpeedDial/SpeedDial";
import localForage from "localforage";
import { generateKey, encryptKey, decryptKey } from "@/utils/aes";

const OTPs: OTPData[] = [
	{
		user: "user1",
		issuer: "issuer1",
		secret: "SZWEFCVNWUJFM73B",
	},
];

localForage.config({
	driver: localForage.INDEXEDDB,
	name: "otp-manager",
	version: 1.0,
	storeName: "otps",
});

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
		// testLf();
		setProgress(100);
	}, []);

	useEffect(() => {
		UpdateOTP();
	}, [UpdateOTP]);

	// const testLf = () => {
	// 	// lf.setItem("otps", otps).then(() => {
	// 	// 	console.log("Saved OTPs to local storage");
	// 	// });

	// 	lf.getItem("otps").then((value) => {
	// 		if (value) console.log("otps", value);
	// 	});

	// 	const k1 = generateRandomKey();
	// 	console.log("k1", k1);
	// 	// const k2 = encryptKey(k1);
	// 	// console.log("k2", k2);
	// 	// const k3 = decryptKey(k2);
	// 	// console.log("k3", k3);
	// };

	useEffect(() => {
		// lf.getItem("key").then((value) => {
		// 	if (!value) {
		// 		const key = generateKey();
		// 		console.log("keyyy", key);
		// 		lf.setItem("key", key).then(() => {
		// 			console.log("Saved key to local storage");
		// 		});
		// 		const encryptedKey = encryptKey(key);
		// 		console.log("encryptedKey", encryptedKey);
		// 		lf.setItem("encryptedKey", encryptedKey).then(() => {
		// 			console.log("Saved encrypted key to local storage");
		// 		});
		// 	} else {
		// 		console.log("key", value);
		// 		const decryptedKey = decryptKey(value as string);
		// 		console.log("decryptedKey", decryptedKey);
		// 	}
		// });
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
