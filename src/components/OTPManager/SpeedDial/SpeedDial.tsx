import {
	Box,
	Backdrop,
	CircularProgress,
	SpeedDialAction,
	SpeedDial as MuiSpeedDial,
} from "@mui/material";
import FabActions from "./FabActions";

const SpeedDial = ({ open, setOpen, progress }: SpeedDialProps) => {
	const handleOpen = () => setOpen(!open);

	return (
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
			<MuiSpeedDial
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
			</MuiSpeedDial>
		</Box>
	);
};

export default SpeedDial;
