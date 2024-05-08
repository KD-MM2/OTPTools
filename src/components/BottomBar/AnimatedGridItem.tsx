import { Grid, styled } from "@mui/material";

const AnimatedGridItem = styled(Grid)(({ theme }) => ({
	transition: theme.transitions.create("background-color", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.complex,
	}),
}));

export default AnimatedGridItem;
