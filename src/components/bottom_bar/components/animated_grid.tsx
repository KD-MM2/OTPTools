// Material UI Components
import styled from "@mui/material/styles/styled";
import Grid from "@mui/material/Grid";

const AnimatedGrid = styled(Grid)(({ theme }) => ({
	transition: theme.transitions.create("background-color", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.complex,
	}),
}));

export default AnimatedGrid;
