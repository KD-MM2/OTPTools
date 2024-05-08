import { AppBar, Grid } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import AnimatedGridItem from "@/components/BottomBar/AnimatedGridItem";
import IconButtonWithText from "@/components/BottomBar/IconButtonWithText";
import BottomBarButtons from "@/components/BottomBar/BottomBarButtons";

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
					{BottomBarButtons.map((button, index) => (
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
							<IconButtonWithText
								id={button.id}
								label={button.label}
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
