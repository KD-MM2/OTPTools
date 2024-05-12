import { styled } from "@mui/material";
import Box from "@mui/material/Box";

const GridItem = styled(Box, {
	shouldForwardProp(propName) {
		return propName !== "isMobile";
	},
})<{ isMobile?: boolean }>(({ theme, isMobile }) => ({
	...theme.typography.body2,
	padding: theme.spacing(isMobile ? 1 : 2),
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	width: "50%",
	overflow: "hidden",
	textWrap: "nowrap",
}));

export default GridItem;
