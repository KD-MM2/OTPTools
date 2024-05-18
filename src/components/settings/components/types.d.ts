type SettingKey =
	| "otpgen_key_length"
	| "otpgen_key_split_length"
	| "otpgen_key_split_delimiter"
	| "otpgen_otp_time_step"
	| "otpman_otp_time_step";

interface SettingItem {
	name: string;
	key: SettingKey;
	description: string;
	[key: string]: any;
}

