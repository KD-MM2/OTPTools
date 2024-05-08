import TextField from "@mui/material/TextField";

const CustomTextField = ({
	id,
	label,
	value,
	ro,
	onChange,
}: {
	id: string;
	label: string;
	value: string | number;
	ro?: boolean;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
	<TextField
		id={id}
		label={label}
		variant="outlined"
		size="small"
		value={value}
		inputProps={{
			style: {
				fontFamily: "monospace",
			},
			readOnly: ro,
		}}
		fullWidth
		onChange={onChange}
	/>
);

export default CustomTextField;
