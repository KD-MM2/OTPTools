import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { CustomTextField, PaperBox, OTPGen_SettingItems } from "@/components";

const width = "90%";

const OTPGeneratorSection = ({
	setting,
	dispatch,
}: {
	setting: SettingState;
	dispatch: React.Dispatch<SettingAction>;
}) => {
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
				<Divider sx={{ width: width }}>OTP Generator</Divider>
				{OTPGen_SettingItems.map((item: SettingItem, index: number) => (
					<PaperBox key={`otpgen_setting_pb_${index}`}>
						<Stack direction="column">
							<Typography
								id={`otpgen_setting_name_${index}`}
								variant="caption"
							>
								{item.name}
							</Typography>
							<Typography
								id={`otpgen_setting_desc_${index}`}
								variant="caption"
							>
								{item.description}
							</Typography>
						</Stack>
						<CustomTextField
							id={`otpgen_setting_val_${index}`}
							label="VALUE"
							value={setting[item.key] ?? ""}
							onChange={(e) =>
								dispatch({
									type: `set_${item.key}`,
									payload: e.target.value as number | any,
								})
							}
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

export default OTPGeneratorSection;
