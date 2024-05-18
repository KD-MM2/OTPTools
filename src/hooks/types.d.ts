type SettingAction =
	| { type: "set_settings"; payload: SettingState }
	| { type: "set_otpgen_key_length"; payload: number }
	| { type: "set_otpgen_key_split_length"; payload: number }
	| { type: "set_otpgen_key_split_delimiter"; payload: string }
	| { type: "set_otpgen_otp_time_step"; payload: number }
	| { type: "set_otpman_otp_time_step"; payload: number }
	| { type: "set_last_sync"; payload: number }
	| { type: "set_last_backup"; payload: number }
	| { type: "set_last_restore"; payload: number };

type SettingState = {
	otpgen_key_length: number;
	otpgen_key_split_length: number;
	otpgen_key_split_delimiter: string;
	otpgen_otp_time_step: number;
	otpman_otp_time_step: number;
	last_sync: number;
	last_backup: number;
	last_restore: number;
};
