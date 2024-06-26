import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

import { CustomTextField } from "@/components";

const NewOTPItem = ({
	otp,
	index,
	onChange,
	onRemove,
}: {
	otp: OTPData;
	index: number;
	onChange: (updatedOTP: OTPData) => void;
	onRemove: () => void;
}) => {
	const handleFieldChange = (field: keyof OTPData, value: string) =>
		onChange({ ...otp, [field]: value });

	return (
		<Paper
			id={`new-otp-item-paper-${index}`}
			component={Box}
			width="95%"
			elevation={5}
		>
			<Stack
				id={`new-otp-item-stack-${index}`}
				direction="column"
				spacing={2}
				sx={{
					padding: "1rem",
					margin: "1rem",
				}}
			>
				{index !== 0 && (
					<Button
						sx={{ alignSelf: "end", margin: 0 }}
						onClick={onRemove}
					>
						REMOVE
					</Button>
				)}
				<CustomTextField
					required
					id={`new-otp-account-name-${index}`}
					label="Account Name"
					value={otp.user ?? ""}
					onChange={(e) => handleFieldChange("user", e.target.value)}
				/>
				<CustomTextField
					id={`new-otp-issuer-${index}`}
					label="Issuer (optional)"
					value={otp.issuer ?? ""}
					onChange={(e) =>
						handleFieldChange("issuer", e.target.value)
					}
				/>
				<CustomTextField
					required
					id={`new-otp-secret-${index}`}
					label="Secret / Seed"
					value={otp.secret ?? ""}
					onChange={(e) =>
						handleFieldChange("secret", e.target.value)
					}
				/>
			</Stack>
		</Paper>
	);
};

export default NewOTPItem;
