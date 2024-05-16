import { Button } from "@mui/material";
import { useRef } from "react";

const SelectFileButton = ({
	text,
	handleFileChange,
	mimeTypes,
}: {
	text: string;
	handleFileChange: (event: any) => void;
	mimeTypes: string;
}) => {
	const fileInputRef = useRef<HTMLInputElement>(null);

	return (
		<>
			<Button
				onClick={() => fileInputRef?.current!.click()}
				autoFocus={false}
			>
				{text}
				<input
					type="file"
					accept={mimeTypes}
					ref={fileInputRef}
					onChange={(event) => handleFileChange(event)}
					hidden
				/>
			</Button>
		</>
	);
};

export default SelectFileButton;