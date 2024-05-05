import React, { useReducer } from "react";
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
import {
	base32toHex,
	generateTOTP,
	generateSecret,
	getCounterFromTime,
} from "@/utils/otp";
import { initialState, reducer } from "@/utils/reducer";
import QRCode from "qrcode";
import DummyQR from "@/assets/qr.svg";

export const OTPGenerator = function () {
	const [state, dispatch] = useReducer(reducer, initialState);

	const displayQR = state.accountName.length > 0;
	const trimmedSecret = state.secret.replace(/\s/g, "");

	const UpdateOTP = React.useCallback(() => {
		const epoch = Date.now();
		const _previousOtp = generateTOTP({
			key: state.secret,
			now: epoch - 30000,
		});
		const _currentOtp = generateTOTP({ key: state.secret, now: epoch });
		const _nextOtp = generateTOTP({
			key: state.secret,
			now: epoch + 30000,
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
			const epoch = Math.round(new Date().getTime() / 1000.0);
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
					<TextField
						id="secret-seed"
						label="Secret / Seed"
						variant="outlined"
						size="small"
						value={state.secret}
						inputProps={{
							style: {
								fontFamily: "monospace",
								// fontSize: "0.8em",
							},
						}}
						fullWidth
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
						<TextField
							id="previous-otp"
							label="Previous OTP"
							variant="outlined"
							size="small"
							InputProps={{
								readOnly: true,
							}}
							fullWidth
							value={state.previousOTP}
						/>
						<TextField
							id="current-otp"
							label="Current OTP"
							variant="outlined"
							size="small"
							InputProps={{
								readOnly: true,
							}}
							fullWidth
							value={state.currentOTP}
						/>
						<TextField
							id="Next OTP"
							label="Next OTP"
							variant="outlined"
							size="small"
							InputProps={{
								readOnly: true,
							}}
							fullWidth
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
					<TextField
						id="account-name"
						label="Account Name"
						variant="outlined"
						size="small"
						value={state.accountName}
						fullWidth
						onChange={(e) =>
							dispatch({
								type: "setAccountName",
								payload: e.target.value,
							})
						}
					/>
					<TextField
						id="issuer"
						label="Issuer (optional)"
						variant="outlined"
						size="small"
						value={state.issuer}
						fullWidth
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
					<TextField
						id="secret-key-length"
						label={`Secret Hex (${state.keyLength} bits)`}
						variant="outlined"
						size="small"
						InputProps={{
							readOnly: true,
						}}
						fullWidth
						value={state.keyHex}
					/>
					<TextField
						id="epoch-time"
						label="Epoch time"
						variant="outlined"
						size="small"
						InputProps={{
							readOnly: true,
						}}
						fullWidth
						value={state.epochTime}
					/>
					<TextField
						id="epoch-iteration"
						label="Epoch iteration"
						variant="outlined"
						size="small"
						InputProps={{
							readOnly: true,
						}}
						fullWidth
						value={state.epochIteration}
					/>
					<TextField
						id="hmac"
						label="HMAC"
						variant="outlined"
						size="small"
						InputProps={{
							readOnly: true,
						}}
						fullWidth
						value={state.hmac}
					/>
				</Stack>
			</Box>
		</>
	);
};
