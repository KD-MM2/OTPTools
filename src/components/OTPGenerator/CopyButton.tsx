import IconButton from "@mui/material/IconButton";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import { copyToClipboard } from "@/utils/utils";

const CopyButton = ({ value }: { value: string }) => {
	return (
		<IconButton
			sx={{ p: 1, m: 0 }}
			size="small"
			color="primary"
			onClick={() => copyToClipboard(value)}
		>
			<CopyAllIcon fontSize="inherit" />
		</IconButton>
	);
};

export default CopyButton;
