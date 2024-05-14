import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Box, useTheme } from "@mui/material";
import { useRef } from "react";
import GridItem from "@/components/OTPManager/OTPItem/GridItem";
import TouchRipple from "@mui/material/ButtonBase/TouchRipple";
import useTouchRipple from "@mui/material/useTouchRipple";

const OTPItem = ({ otp, onClick }: { otp: OTPData; onClick: any }) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const rippleRef = useRef(null);
	const { getRippleHandlers } = useTouchRipple({
		disabled: false,
		focusVisible: false,
		rippleRef,
	});

	const accountElmRef = useRef<HTMLDivElement>(null);
	const issuerElmRef = useRef<HTMLDivElement>(null);
	const isAccountElmOverflow =
		(accountElmRef.current?.scrollWidth ?? 0) >
		(accountElmRef.current?.offsetWidth ?? 0);
	const isIssuerElmOverflow =
		(issuerElmRef.current?.scrollWidth ?? 0) >
		(issuerElmRef.current?.offsetWidth ?? 0);

	return (
		<Paper
			component={Box}
			sx={{ position: "relative" }}
			{...getRippleHandlers()}
			onClick={onClick}
		>
			<TouchRipple ref={rippleRef} center={false} />
			<Grid container sx={{ justifyContent: "space-between" }}>
				<GridItem
					{...(isMobile && { is_mobile: isMobile.toString() })}
					flexGrow={2}
				>
					<Typography
						ref={accountElmRef}
						fontFamily="monospace"
						variant="subtitle1"
						sx={{
							textAlign: "left",
							p: isMobile ? "0 1em" : "inherit",
						}}
						className={isAccountElmOverflow ? "scroll-text" : ""}
					>
						{otp.user}
					</Typography>
					<Typography
						ref={issuerElmRef}
						fontFamily="monospace"
						variant="subtitle2"
						sx={{
							textAlign: "left",
							p: isMobile ? "0 1em" : "inherit",
						}}
						className={isIssuerElmOverflow ? "scroll-text" : ""}
					>
						{otp.issuer}
					</Typography>
				</GridItem>
				<GridItem
					{...(isMobile && { is_mobile: isMobile.toString() })}
					flexGrow={1}
				>
					<Typography
						fontFamily="monospace"
						variant={isMobile ? "h5" : "h4"}
						textAlign={isMobile ? "center" : "right"}
						sx={{ letterSpacing: 5 }}
					>
						{otp.otp?.match(/.{3}/g)?.join(" ")}
					</Typography>
				</GridItem>
			</Grid>
		</Paper>
	);
};

export default OTPItem;
