import React from "react";
import { AppBar, Box, Grid, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import KeyIcon from "@mui/icons-material/Key";
import LoopIcon from "@mui/icons-material/Loop";

const CustomIconButton = ({
	label,
	ariaLabel,
	icon,
	onClick,
}: {
	label: string;
	ariaLabel: string;
	icon: React.ReactNode;
	onClick: (event: any) => void;
}) => {
	return (
		<Box
			key={ariaLabel.split("").join("")}
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				padding: 1,
			}}
			onClick={onClick}
		>
			{icon}
			<Typography variant="caption" align="center">
				{label}
			</Typography>
		</Box>
	);
};

export default function BottomAppBar() {
	const navigate = useNavigate();
	const location = useLocation();
	const { pathname } = location;

	const buttons = [
		{
			label: "OTP Manager",
			ariaLabel: "otp manager",
			path: "/",
			icon: <KeyIcon />,
		},
		{
			label: "OTP Generator",
			ariaLabel: "otp generator",
			path: "/otp-generator",
			icon: <LoopIcon />,
		},
	];

	return (
		<>
			<AppBar position="fixed" sx={{ top: "auto", bottom: 0 }}>
				<Grid container>
					{buttons.map((button, index) => (
						<Grid
							item
							xs={6}
							key={index}
							{...(pathname === button.path
								? {
										sx: {
											backgroundColor:
												"rgb(6, 31, 56, 0.5)",
										},
								  }
								: {})}
						>
							<CustomIconButton
								label={button.label}
								ariaLabel={button.ariaLabel}
								icon={button.icon}
								onClick={() =>
									pathname !== button.path &&
									navigate(button.path)
								}
							/>
						</Grid>
					))}
				</Grid>
			</AppBar>
		</>
	);
}
