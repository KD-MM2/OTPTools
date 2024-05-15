// Material UI Components
import { styled } from "@mui/material";
import Grid from "@mui/material/Grid";

const AnimatedGridItem = styled(Grid)(({ theme }) => ({
	transition: theme.transitions.create("background-color", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.complex,
	}),
}));

export default AnimatedGridItem;
