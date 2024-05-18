import TextField from "@mui/material/TextField";

const CustomTextField = ({
	id,
	label,
	value,
	ro,
	onChange,
	required,
	pointer,
	props,
}: {
	id: string;
	label: string;
	value: string | number;
	ro?: boolean;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	required?: boolean;
	pointer?: boolean;
	props?: any;
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
				cursor: pointer ? "pointer" : "default",
			},
			readOnly: ro,
		}}
		required={required}
		fullWidth
		onChange={onChange}
		{...props}
	/>
);

export default CustomTextField;
