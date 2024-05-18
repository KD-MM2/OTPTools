import { useNavigate, useLocation } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";

import {
	AnimatedGrid,
	IconButtonWithText,
	BottomBarItems,
	Snackbar,
} from "@/components";

const BottomBar = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { pathname } = location;

	return (
		<AppBar
			position="fixed"
			sx={{ top: "auto", bottom: 0, userSelect: "none" }}
		>
			<Grid container>
				{BottomBarItems.map((item, index) => (
					<AnimatedGrid
						item
						xs={6}
						key={index}
						className={
							pathname === item.path ? "bottom-bar-active" : ""
						}
					>
						<IconButtonWithText
							id={item.id}
							label={item.label}
							icon={item.icon}
							onClick={() =>
								pathname !== item.path && navigate(item.path)
							}
							onDoubleClick={() => alert("Double Clicked")}
						/>
					</AnimatedGrid>
				))}
			</Grid>
			<Snackbar />
		</AppBar>
	);
};

export default BottomBar;
