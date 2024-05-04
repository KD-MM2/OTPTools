import React from "react";
import {
	Button,
	Typography,
	Divider,
	Stack,
	TextField,
	Box,
	LinearProgress,
	Paper,
	Collapse,
} from "@mui/material";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import DummyQR from "@/assets/qr.svg";
import { generateKey, calculateOTP } from "@/utils/otp";
import QRCode from "qrcode";

export const OTPGenerator = function () {
	const [secret, setSecret] = React.useState<string>(generateKey());
	const [epochTime, setEpochTime] = React.useState<number>(0);
	const [epochIteration, setEpochIteration] = React.useState<string>("");
	const [hmac, setHmac] = React.useState<string>("");
	const [currentOTP, setCurrentOTP] = React.useState<string | number>("");
	const [nextOTP, setNextOTP] = React.useState<string | number>("");
	const [keyHex, setKeyHex] = React.useState<string>("");
	const [keyLength, setKeyLength] = React.useState<number>(160);
	const [accountName, setAccountName] = React.useState<string>("");
	const [issuer, setIssuer] = React.useState<string>("");
	const [qrCode, setQRCode] = React.useState<string>(DummyQR);
	const [progress, setProgress] = React.useState<number>(100);
	const displayQR = accountName.length > 0;

	const UpdateOTP = React.useCallback(() => {
		const epoch = Math.round(new Date().getTime() / 1000.0);
		const _currentOtp = calculateOTP(secret, epoch);
		const _nextOtp = calculateOTP(secret, epoch + 30);

		if (_currentOtp.success) {
			if (epochTime == 0) setEpochTime(epoch);
			setProgress(100);
			setEpochIteration(String(_currentOtp.epochIteration));
			setKeyHex(String(_currentOtp.key));
			setKeyLength(Number(_currentOtp.keyLength));
			setHmac((_currentOtp.hmac as string[]).join("|"));
			setCurrentOTP(String(_currentOtp.otp));
			setNextOTP(String(_nextOtp.otp));
		} else {
			setCurrentOTP("ERROR");
			setNextOTP("ERROR");
			setKeyHex("ERROR");
			setKeyLength(0);
			setHmac("ERROR");
		}

		if (accountName.length > 0) {
			QRCode.toDataURL(
				`otpauth://totp/${accountName}?secret=${secret}&issuer=${issuer}`,
				{
					errorCorrectionLevel: "H",
					type: "image/jpeg",
					margin: 5,
					width: 256,
					color: {
						dark: "#000000",
						light: "#FFFFFF",
					},
				},
				(err, url) => {
					if (err) {
						console.error(err);
					}
					setQRCode(url);
				}
			);
		} else if (qrCode !== DummyQR) setQRCode(DummyQR);
	}, [accountName, epochTime, issuer, qrCode, secret]);

	React.useEffect(() => {
		UpdateOTP();
	}, [UpdateOTP]);

	React.useEffect(() => {
		const timer = setInterval(() => {
			const epoch = Math.round(new Date().getTime() / 1000.0);
			setEpochTime(epoch);

			if (epoch % 30 == 0) UpdateOTP();

			setProgress((oldProgress) => {
				if (oldProgress <= 0) {
					return 100;
				}
				return Math.max(oldProgress - 100 / 30, 0);
			});
		}, 1000);
		return () => {
			clearInterval(timer);
		};
	}, [UpdateOTP, secret]);

	return (
		<>
			<Box>
				<Typography variant="h6" gutterBottom>
					One-Time Password Calculator
				</Typography>
				<Stack direction="column" spacing={2} sx={{ pt: 1 }}>
					<Divider>BASIC</Divider>
					<TextField
						id="secret-seed"
						label="Secret / Seed"
						variant="outlined"
						size="small"
						value={secret}
						inputProps={{
							style: {
								fontFamily: "monospace",
								// fontSize: "0.8em",
							},
						}}
						onChange={(e) => setSecret(e.target.value)}
					/>

					<Button
						variant="contained"
						size="small"
						startIcon={<VpnKeyIcon />}
						onClick={() => setSecret(generateKey())}
					>
						Generate
					</Button>

					<div style={{ height: "0.5em" }} />
					<Divider>RESULT</Divider>
					<Stack direction="row" spacing={1}>
						<TextField
							id="current-otp"
							label="Current OTP"
							variant="outlined"
							size="small"
							InputProps={{
								readOnly: true,
							}}
							value={currentOTP}
						/>
						<TextField
							id="Next OTP"
							label="Next OTP"
							variant="outlined"
							size="small"
							InputProps={{
								readOnly: true,
							}}
							value={nextOTP}
						/>
					</Stack>
					<LinearProgress
						variant="determinate"
						value={progress}
						color={
							progress <= 15
								? "error"
								: progress <= 40
									? "warning"
									: "success"
						}
						sx={{ borderRadius: 1, height: "0.5em" }}
					/>

					<div style={{ height: "0.5em" }} />
					<Divider>QR CODE</Divider>
					<TextField
						id="account-name"
						label="Account Name"
						variant="outlined"
						size="small"
						value={accountName}
						onChange={(e) => setAccountName(e.target.value)}
					/>
					<TextField
						id="issuer"
						label="Issuer (optional)"
						variant="outlined"
						size="small"
						value={issuer}
						onChange={(e) => setIssuer(e.target.value)}
					/>
					<Collapse in={displayQR}>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Paper
								id="qr-code"
								alt="QRCode"
								component="img"
								src={qrCode}
								sx={{
									width: "256px",
									height: "256px",
								}}
								elevation={4}
							/>
						</Box>
					</Collapse>

					<div style={{ height: "0.5em" }} />
					<Divider>ADVANCED</Divider>
					<TextField
						id="secret-key-length"
						label={`Secret Hex (${keyLength} bits)`}
						variant="outlined"
						size="small"
						InputProps={{
							readOnly: true,
						}}
						value={keyHex}
					/>
					<TextField
						id="epoch-time"
						label="Epoch time"
						variant="outlined"
						size="small"
						InputProps={{
							readOnly: true,
						}}
						value={epochTime}
					/>
					<TextField
						id="epoch-iteration"
						label="Epoch iteration"
						variant="outlined"
						size="small"
						InputProps={{
							readOnly: true,
						}}
						value={epochIteration}
					/>
					<TextField
						id="hmac"
						label="HMAC"
						variant="outlined"
						size="small"
						InputProps={{
							readOnly: true,
						}}
						value={hmac}
					/>
				</Stack>
			</Box>
		</>
	);
};
