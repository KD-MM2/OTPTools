import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

const PaperBox = ({ children }: { children: React.ReactNode }) => (
	<Box
		component={Paper}
		display="flex"
		justifyContent="space-between"
		alignItems="center"
		flexDirection="row"
		width="90%"
		sx={{
			p: 3,
		}}
	>
		{children}
	</Box>
);

export default PaperBox;
