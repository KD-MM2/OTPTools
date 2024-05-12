import TextField from "@mui/material/TextField";

const CustomTextField = ({
	id,
	label,
	value,
	ro,
	onChange,
	required,
}: {
	id: string;
	label: string;
	value: string | number;
	ro?: boolean;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	required?: boolean;
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
		required={required}
		fullWidth
		onChange={onChange}
	/>
);

export default CustomTextField;
