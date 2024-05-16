import { Button } from "@mui/material";
import { RefObject } from "react";

const SelectFileButton = ({
	fileInputRef,
	text,
	handleFileChange,
	mimeTypes,
}: {
	fileInputRef: RefObject<HTMLInputElement>;
	text: string;
	handleFileChange: (event: any) => void;
	mimeTypes: string;
}) => (
	<Button onClick={() => fileInputRef?.current!.click()} autoFocus={false}>
		{text}
		<input
			type="file"
			accept={mimeTypes}
			ref={fileInputRef}
			onChange={(event) => handleFileChange(event)}
			hidden
		/>
	</Button>
);
export default SelectFileButton;
