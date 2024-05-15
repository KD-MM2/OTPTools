// Material UI Components
import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { default as MuiSpeedDial } from "@mui/material/SpeedDial";

// Custom Components
import FabActions from "@/components/SpeedDial/FabActions";
import EditList from "@/components/EditList/EditList";
import AddNewOTPDialog from "@/components/AddNewOTPDialog/AddNewOTPDialog";

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
			<AddNewOTPDialog />
			<EditList />
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