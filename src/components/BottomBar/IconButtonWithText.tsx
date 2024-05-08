import { Box, Typography } from "@mui/material";

const IconButtonWithText = ({
	id,
	label,
	icon,
	onClick,
	onDoubleClick,
}: IconButtonWithTextProps) => {
	return (
		<Box
			key={id}
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

export default IconButtonWithText;
