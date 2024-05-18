import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { default as MuiSpeedDial } from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";

import { FabItems } from "@/components";
import { Edit, AddNewOTP, Settings } from "@/views";

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
			<AddNewOTP />
			<Edit />
			<Settings />
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
				{FabItems.map((item) => (
					<SpeedDialAction
						key={item.name}
						icon={item.icon}
						tooltipTitle={item.name}
						tooltipOpen
						onClick={item.cb}
					/>
				))}
			</MuiSpeedDial>
		</Box>
	);
};

export default SpeedDial;
