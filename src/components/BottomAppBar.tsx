import React from "react";
import { AppBar, Box, Grid, styled, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import KeyIcon from "@mui/icons-material/Key";
import LoopIcon from "@mui/icons-material/Loop";

const CustomIconButton = ({
	label,
	ariaLabel,
	icon,
	onClick,
	onDoubleClick,
}: {
	label: string;
	ariaLabel: string;
	icon: React.ReactNode;
	onClick: (event: any) => void;
	onDoubleClick?: (event: any) => void;
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
			onDoubleClick={onDoubleClick}
		>
			{icon}
			<Typography variant="caption" align="center">
				{label}
			</Typography>
		</Box>
	);
};

const AnimatedGridItem = styled(Grid)(({ theme }) => ({
	transition: theme.transitions.create("background-color", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.complex,
	}),
}));

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

export default function BottomAppBar() {
	const navigate = useNavigate();
	const location = useLocation();
	const { pathname } = location;

	return (
		<>
			<AppBar
				position="fixed"
				sx={{ top: "auto", bottom: 0, userSelect: "none" }}
			>
				<Grid container>
					{buttons.map((button, index) => (
						<AnimatedGridItem
							item
							xs={6}
							key={index}
							className={
								pathname === button.path
									? "bottom-bar-active"
									: ""
							}
						>
							<CustomIconButton
								label={button.label}
								ariaLabel={button.ariaLabel}
								icon={button.icon}
								onClick={() =>
									pathname !== button.path &&
									navigate(button.path)
								}
								onDoubleClick={() => alert("Double Clicked")}
							/>
						</AnimatedGridItem>
					))}
				</Grid>
			</AppBar>
		</>
	);
}
