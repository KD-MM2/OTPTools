import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { CustomTextField, PaperBox, OTPMan_SettingItems } from "@/components";
import { useSetting, useSettingDispatch } from "@/hooks";

const width = "90%";

const OTPManagerSection = () => {
	const setting = useSetting();
	const dispatch = useSettingDispatch();
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
				{OTPMan_SettingItems.map((item: SettingItem, index: number) => (
					<PaperBox key={`otpman_setting_pb_${index}`}>
						<Stack direction="column">
							<Typography
								id={`otpman_setting_name_${index}`}
								variant="caption"
							>
								{item.name}
							</Typography>
							<Typography
								id={`otpman_setting_desc_${index}`}
								variant="caption"
							>
								{item.description}
							</Typography>
						</Stack>
						<CustomTextField
							id={`otpman_setting_val_${index}`}
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

export default OTPManagerSection;
