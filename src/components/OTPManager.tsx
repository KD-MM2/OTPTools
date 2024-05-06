import {
	Box,
	CircularProgress,
	Paper,
	styled,
	Typography,
	Grid,
	SpeedDial,
	Backdrop,
	SpeedDialAction,
	Stack,
	Divider,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import { generateTOTP } from "@/utils/otp";

const Item = styled(Box)<{ isMobile?: boolean }>(({ theme, isMobile }) => ({
	...theme.typography.body2,
	padding: theme.spacing(isMobile ? 1 : 2),
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	width: "50%",
	overflow: "hidden",
	textWrap: "nowrap",
}));

const FabActions = [
	{
		id: "settings",
		enabled: true,
		icon: <SettingsIcon />,
		name: "SETTINGS",
		cb: () => {},
	},
	{
		id: "add",
		enabled: true,
		icon: <AddCircleIcon />,
		name: "ADD",
		cb: () => {},
	},
];

interface OTPData {
	user: string;
	issuer: string;
	secret: string;
	otp?: string;
}

const OTPs: OTPData[] = [
	{
		user: "user1",
		issuer: "issuer1",
		secret: "SZWEFCVNWUJFM73B",
	},
];

const OTPItem = ({ otp }: { otp: OTPData }) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	const accountElmRef = useRef<HTMLDivElement>(null);
	const issuerElmRef = useRef<HTMLDivElement>(null);
	const isAccountElmOverflow =
		(accountElmRef.current?.scrollWidth ?? 0) >
		(accountElmRef.current?.offsetWidth ?? 0);
	const isIssuerElmOverflow =
		(issuerElmRef.current?.scrollWidth ?? 0) >
		(issuerElmRef.current?.offsetWidth ?? 0);

	return (
		<Paper>
			<Grid container sx={{ justifyContent: "space-between" }}>
				<Item isMobile={isMobile}>
					<Typography
						ref={accountElmRef}
						fontFamily="monospace"
						variant="subtitle1"
						sx={{ textAlign: "left" }}
						{...(isMobile ? { p: "0 1em" } : {})}
						className={isAccountElmOverflow ? "scroll-text" : ""}
					>
						{otp.user}
					</Typography>
					<Typography
						ref={issuerElmRef}
						fontFamily="monospace"
						variant="subtitle2"
						sx={{ textAlign: "left" }}
						{...(isMobile ? { p: "0 1em" } : {})}
						className={isIssuerElmOverflow ? "scroll-text" : ""}
					>
						{otp.issuer}
					</Typography>
				</Item>
				<Item isMobile={isMobile}>
					<Typography
						fontFamily="monospace"
						variant={isMobile ? "h5" : "h4"}
						textAlign={isMobile ? "center" : "right"}
						sx={{ letterSpacing: 5 }}
					>
						{otp.otp?.match(/.{3}/g)?.join(" ")}
					</Typography>
				</Item>
			</Grid>
		</Paper>
	);
};

export const OTPManager = function () {
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(!open);
	const [otps, setOtps] = useState<OTPData[]>(OTPs);
	const [progress, setProgress] = useState<number>(100);

	const UpdateOTP = useCallback(() => {
		setOtps(
			otps.map((otp) => {
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
			{/* OTPs */}
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

			{/* FAB */}
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					position: "fixed",
					zIndex: 9999,
					right: "1rem",
					bottom: "4.5rem",
				}}
			>
				<Backdrop open={open} />
				<SpeedDial
					ariaLabel="SpeedDial"
					sx={{
						position: "absolute",
						bottom: 0,
						right: 0,
					}}
					className="speed-dial"
					FabProps={{ size: "small" }}
					icon={
						<CircularProgress
							thickness={22}
							value={progress}
							variant="determinate"
							size={40}
							color={
								progress <= 15
									? "error"
									: progress <= 40
										? "warning"
										: "success"
							}
						/>
					}
					onClick={handleOpen}
					open={open}
				>
					{FabActions.map((action) => (
						<SpeedDialAction
							key={action.name}
							icon={action.icon}
							tooltipTitle={action.name}
							tooltipOpen
							onClick={action.cb}
						/>
					))}
				</SpeedDial>
			</Box>
		</>
	);
};
