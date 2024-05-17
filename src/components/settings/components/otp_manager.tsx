import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

import PaperBox from "./paper_box";
import Typography from "@mui/material/Typography";
import { CustomTextField } from "@/components/otp_generator";
import { useState } from "react";
import { OTPMan_SettingItems } from "./setting_items";

const width = "90%";

const OTPManagerSection = () => {
	const [otpmanSettings, setOtpmanSettings] =
		useState<SettingItem[]>(OTPMan_SettingItems);
	return (
		<>
			<Stack
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "column",
					pt: 2,
					pb: 2,
				}}
				spacing={2}
			>
				<Divider sx={{ width: width }}>OTP Manager</Divider>
				{otpmanSettings.map((setting: SettingItem, index: number) => (
					<PaperBox key={`otpman_setting_pb_${index}`}>
						<Stack direction="column">
							<Typography
								id={`otpman_setting_name_${index}`}
								variant="caption"
							>
								{setting.name}
							</Typography>
							<Typography
								id={`otpman_setting_desc_${index}`}
								variant="caption"
							>
								{setting.description}
							</Typography>
						</Stack>
						<CustomTextField
							id={`otpman_setting_val_${index}`}
							label="VALUE"
							value={setting.value ?? ""}
							onChange={(e) => {}}
							props={{
								sx: {
									width: "40%",
								},
							}}
						/>
					</PaperBox>
				))}
			</Stack>
		</>
	);
};

export default OTPManagerSection;
