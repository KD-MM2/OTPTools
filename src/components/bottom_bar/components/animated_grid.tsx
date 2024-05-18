import Grid from "@mui/material/Grid";
import styled from "@mui/material/styles/styled";

const AnimatedGrid = styled(Grid)(({ theme }) => ({
	transition: theme.transitions.create("background-color", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.complex,
	}),
}));

export default AnimatedGrid;
