const OTPGen_SettingItems: SettingItem[] = [
	{
		name: "Key Length",
		key: "otpgen_key_length",
		description: "Length of the secret key",
	},
	{
		name: "Key Split Length",
		key: "otpgen_key_split_length",
		description: "Length of each split of the secret key",
	},
	{
		name: "Key Split Delimiter",
		key: "otpgen_key_split_delimiter",
		description: "Delimiter for splitting the secret key",
	},
	{
		name: "OTP Time Step",
		key: "otpgen_otp_time_step",
		description: "Time step for generating OTP",
	},
];

const OTPMan_SettingItems: SettingItem[] = [
	{
		name: "OTP Time Step",
		key: "otpman_otp_time_step",
		description: "Time step for generating OTP",
	},
];

export { OTPGen_SettingItems, OTPMan_SettingItems };
