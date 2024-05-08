import React, { useReducer } from "react";
import {
	Button,
	Typography,
	Divider,
	Stack,
	Box,
	LinearProgress,
	Paper,
	Collapse,
} from "@mui/material";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import {
	base32toHex,
	generateTOTP,
	generateSecret,
	getCounterFromTime,
} from "@/utils/otp";
import { initialState, reducer } from "@/utils/reducer";
import QRCode from "qrcode";
import DummyQR from "@/assets/qr.svg";
import CustomTextField from "@/components/OTPGenerator/CustomTextField";

const OTPGenerator = function () {
	const [state, dispatch] = useReducer(reducer, initialState);

	const displayQR = state.accountName.length > 0;
	const trimmedSecret = state.secret.replace(/\s/g, "");

	const UpdateOTP = React.useCallback(() => {
		const epoch = Math.round(Date.now() / 1000.0);
		const _previousOtp = generateTOTP({
			key: state.secret,
			now: epoch - 30,
		});
		const _currentOtp = generateTOTP({ key: state.secret, now: epoch });
		const _nextOtp = generateTOTP({
			key: state.secret,
			now: epoch + 30,
		});

		dispatch({ type: "setProgress", payload: 100 });
		dispatch({
			type: "setEpochIteration",
			payload: getCounterFromTime({ now: epoch, timeStep: 30 })
				.toString(16)
				.padStart(16, "0"),
		});
		dispatch({ type: "setKeyHex", payload: base32toHex(trimmedSecret) });
		dispatch({
			type: "setKeyLength",
			payload: base32toHex(trimmedSecret).length * 4,
		});
		dispatch({
			type: "setHmac",
			payload: (_currentOtp.hmac as string[]).join("|"),
		});
		dispatch({
			type: "setPreviousOTP",
			payload: String(_previousOtp.code),
		});
		dispatch({ type: "setCurrentOTP", payload: String(_currentOtp.code) });
		dispatch({ type: "setNextOTP", payload: String(_nextOtp.code) });

		if (state.accountName.length > 0) {
			QRCode.toDataURL(
				`otpauth://totp/${state.accountName}?secret=${trimmedSecret}&issuer=${state.issuer}`,
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
					dispatch({ type: "setQRCode", payload: url });
				}
			);
		} else if (state.qrCode !== DummyQR)
			dispatch({ type: "setQRCode", payload: DummyQR });
	}, [
		state.accountName,
		state.issuer,
		state.qrCode,
		state.secret,
		trimmedSecret,
	]);

	React.useEffect(() => {
		UpdateOTP();
	}, [UpdateOTP]);

	React.useEffect(() => {
		const timer = setInterval(() => {
			const epoch = Math.round(Date.now() / 1000.0);
			dispatch({ type: "setEpochTime", payload: epoch });
			if (epoch % 30 == 0) UpdateOTP();
			dispatch({ type: "decrementProgress" });
		}, 1000);
		return () => {
			clearInterval(timer);
		};
	}, [UpdateOTP]);

	return (
		<>
			<Box>
				<Typography variant="h6" gutterBottom>
					One-Time Password Calculator
				</Typography>
				<Stack direction="column" spacing={2} sx={{ pt: 1 }}>
					<Divider>BASIC</Divider>
					<CustomTextField
						id="secret-seed"
						label="Secret / Seed"
						value={state.secret}
						ro={false}
						onChange={(e) =>
							dispatch({
								type: "setSecret",
								payload: e.target.value,
							})
						}
					/>

					<Button
						variant="contained"
						size="small"
						startIcon={<VpnKeyIcon />}
						onClick={() =>
							dispatch({
								type: "setSecret",
								payload: generateSecret(),
							})
						}
					>
						Generate
					</Button>

					<div style={{ height: "0.5em" }} />
					<Divider>RESULT</Divider>
					<Stack direction="row" spacing={1}>
						<CustomTextField
							id="previous-otp"
							label="Previous OTP"
							ro={true}
							value={state.previousOTP}
						/>
						<CustomTextField
							id="current-otp"
							label="Current OTP"
							ro={true}
							value={state.currentOTP}
						/>
						<CustomTextField
							id="Next OTP"
							label="Next OTP"
							ro={true}
							value={state.nextOTP}
						/>
					</Stack>
					<LinearProgress
						variant="determinate"
						value={state.progress}
						color={
							state.progress <= 15
								? "error"
								: state.progress <= 40
									? "warning"
									: "success"
						}
						sx={{ borderRadius: 1, height: "0.5em" }}
					/>

					<div style={{ height: "0.5em" }} />
					<Divider>QR CODE</Divider>
					<CustomTextField
						id="account-name"
						label="Account Name"
						value={state.accountName}
						ro={false}
						onChange={(e) =>
							dispatch({
								type: "setAccountName",
								payload: e.target.value,
							})
						}
					/>
					<CustomTextField
						id="issuer"
						label="Issuer (optional)"
						value={state.issuer}
						ro={false}
						onChange={(e) =>
							dispatch({
								type: "setIssuer",
								payload: e.target.value,
							})
						}
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
								src={state.qrCode}
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
					<CustomTextField
						id="secret-key-length"
						label={`Secret Hex (${state.keyLength} bits)`}
						ro={true}
						value={state.keyHex}
					/>
					<CustomTextField
						id="epoch-time"
						label="Epoch time"
						ro={true}
						value={state.epochTime}
					/>
					<CustomTextField
						id="epoch-iteration"
						label="Epoch iteration"
						ro={true}
						value={state.epochIteration}
					/>
					<CustomTextField
						id="hmac"
						label="HMAC"
						ro={true}
						value={state.hmac}
					/>
				</Stack>
			</Box>
		</>
	);
};

export default OTPGenerator;
