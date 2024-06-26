import QRCode from "qrcode";

import { useCallback, useEffect, useReducer } from "react";
import { emitCustomEvent } from "react-custom-events";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import EnhancedEncryptionIcon from "@mui/icons-material/EnhancedEncryption";
import VpnKeyIcon from "@mui/icons-material/VpnKey";

import DummyQR from "@/assets/qr.svg";
import { CustomTextField, CopyButton } from "@/components";
import { useSetting } from "@/hooks";
import {
	otpgenInitialState as initialState,
	otpgenReducer as reducer,
	base32toHex,
	generateTOTP,
	generateSecret,
	getCounterFromTime,
	getSeeds,
	setSeeds,
} from "@/utils";

const OTPGenerator = function () {
	const setting = useSetting();
	const [state, dispatch] = useReducer(reducer, initialState);

	const displayQR = state.accountName.length > 0;
	const trimmedSecret =
		setting.otpgen_key_split_delimiter != ""
			? state.secret.replace(
					new RegExp(`\\${setting.otpgen_key_split_delimiter}`, "g"),
					""
				)
			: state.secret;

	useEffect(() => {
		if (trimmedSecret.length === 0)
			dispatch({
				type: "setSecret",
				payload: generateSecret(
					setting.otpgen_key_length,
					setting.otpgen_key_split_length,
					setting.otpgen_key_split_delimiter
				),
			});
	}, [
		setting.otpgen_key_length,
		setting.otpgen_key_split_delimiter,
		setting.otpgen_key_split_length,
		trimmedSecret.length,
	]);

	const UpdateOTP = useCallback(() => {
		const epoch = Math.round(Date.now() / 1000.0);
		const _previousOtp = generateTOTP({
			key: trimmedSecret,
			now: epoch - 30,
		});
		const _currentOtp = generateTOTP({ key: trimmedSecret, now: epoch });
		const _nextOtp = generateTOTP({
			key: trimmedSecret,
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
	}, [state.accountName, state.issuer, state.qrCode, trimmedSecret]);

	useEffect(() => {
		UpdateOTP();
	}, [UpdateOTP]);

	useEffect(() => {
		const timer = setInterval(() => {
			const epoch = Math.round(Date.now() / 1000.0);
			dispatch({ type: "setEpochTime", payload: epoch });
			if (epoch % 30 == 0) UpdateOTP();
			dispatch({ type: "decrementProgress" });
		}, 200);
		return () => {
			clearInterval(timer);
		};
	}, [UpdateOTP]);

	const handleAddToOTPList = useCallback(() => {
		if (state.accountName.length === 0) {
			emitCustomEvent("SnackBarEvent", {
				type: "SHOW_SNACKBAR",
				message: "Please fill Account Name field!",
				severity: "error",
			});
			return;
		}

		getSeeds().then((seeds) => {
			const oldSeeds: OTPData[] = JSON.parse(seeds);
			setSeeds([
				...oldSeeds,
				{
					id: oldSeeds.length + 1,
					user: state.accountName,
					issuer: state.issuer,
					secret: state.secret.replace(
						new RegExp(
							`\\${setting.otpgen_key_split_delimiter}`,
							"g"
						),
						""
					),
				},
			]).then(() =>
				emitCustomEvent("SnackBarEvent", {
					type: "SHOW_SNACKBAR",
					message: "Added new OTP to OTP List!",
					severity: "success",
				})
			);
		});
	}, [
		setting.otpgen_key_split_delimiter,
		state.accountName,
		state.issuer,
		state.secret,
	]);

	return (
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
					props={{
						InputProps: {
							endAdornment: <CopyButton value={trimmedSecret} />,
						},
					}}
				/>

				<Button
					variant="contained"
					size="small"
					startIcon={<VpnKeyIcon />}
					onClick={() =>
						dispatch({
							type: "setSecret",
							payload: generateSecret(
								setting.otpgen_key_length,
								setting.otpgen_key_split_length,
								setting.otpgen_key_split_delimiter
							),
						})
					}
				>
					Generate
				</Button>
				<Button
					variant="contained"
					size="small"
					startIcon={<EnhancedEncryptionIcon />}
					onClick={() => handleAddToOTPList()}
				>
					Add to OTP Manager
				</Button>

				<div style={{ height: "0.5em" }} />
				<Divider>RESULT</Divider>
				<Stack direction="row" spacing={1}>
					<CustomTextField
						id="previous-otp"
						label="Previous OTP"
						ro={true}
						value={state.previousOTP}
						props={{
							InputProps: {
								endAdornment: (
									<CopyButton
										value={String(state.previousOTP)}
									/>
								),
							},
						}}
					/>
					<CustomTextField
						id="current-otp"
						label="Current OTP"
						ro={true}
						value={state.currentOTP}
						props={{
							InputProps: {
								endAdornment: (
									<CopyButton
										value={String(state.currentOTP)}
									/>
								),
							},
						}}
					/>
					<CustomTextField
						id="Next OTP"
						label="Next OTP"
						ro={true}
						value={state.nextOTP}
						props={{
							InputProps: {
								endAdornment: (
									<CopyButton value={String(state.nextOTP)} />
								),
							},
						}}
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
							elevation={5}
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
					props={{
						InputProps: {
							endAdornment: <CopyButton value={state.keyHex} />,
						},
					}}
				/>
				<CustomTextField
					id="epoch-time"
					label="Epoch time"
					ro={true}
					value={state.epochTime}
					props={{
						InputProps: {
							endAdornment: (
								<CopyButton value={String(state.epochTime)} />
							),
						},
					}}
				/>
				<CustomTextField
					id="epoch-iteration"
					label="Epoch iteration"
					ro={true}
					value={state.epochIteration}
					props={{
						InputProps: {
							endAdornment: (
								<CopyButton value={state.epochIteration} />
							),
						},
					}}
				/>
				<CustomTextField
					id="hmac"
					label="HMAC"
					ro={true}
					value={state.hmac}
					props={{
						InputProps: {
							endAdornment: <CopyButton value={state.hmac} />,
						},
					}}
				/>
			</Stack>
		</Box>
	);
};

export default OTPGenerator;
