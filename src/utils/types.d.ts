interface OTPOutput {
	success: boolean;
	otp: string | null;
	key: string | boolean | null;
	keyLength: number | boolean | null;
	epoch: number;
	epochIteration: string;
	hmac: string[] | null;
}
