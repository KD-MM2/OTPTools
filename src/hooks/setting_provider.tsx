import { createContext, useEffect, useReducer } from "react";

import { getSetting, saveSetting } from "@/utils";

const SettingDispatchContext = createContext<React.Dispatch<SettingAction>>(
	() => undefined
);
const SettingContext = createContext<SettingState>({} as SettingState);

function reducer(state: SettingState, action: SettingAction): SettingState {
	let newState: SettingState = state;
	switch (action.type) {
		case "set_settings":
			newState = action.payload;
			break;

		case "set_otpgen_key_length":
			newState = { ...state, otpgen_key_length: action.payload };
			break;

		case "set_otpgen_key_split_length":
			newState = { ...state, otpgen_key_split_length: action.payload };
			break;

		case "set_otpgen_key_split_delimiter":
			newState = { ...state, otpgen_key_split_delimiter: action.payload };
			break;

		case "set_otpgen_otp_time_step":
			newState = { ...state, otpgen_otp_time_step: action.payload };
			break;

		case "set_otpman_otp_time_step":
			newState = { ...state, otpman_otp_time_step: action.payload };
			break;

		case "set_last_sync":
			newState = { ...state, last_sync: action.payload };
			break;

		case "set_last_backup":
			newState = { ...state, last_backup: action.payload };
			break;

		case "set_last_restore":
			newState = { ...state, last_restore: action.payload };
			break;
	}
	saveSetting(newState);
	return newState;
}

const initialState: SettingState = {
	otpgen_key_length: 32,
	otpgen_key_split_length: 8,
	otpgen_key_split_delimiter: " ",
	otpgen_otp_time_step: 30,
	otpman_otp_time_step: 30,
	last_sync: 0,
	last_backup: 0,
	last_restore: 0,
};

const SettingProvider = ({ children }: { children: React.ReactNode }) => {
	const [state, dispatch] = useReducer(reducer, {} as SettingState);

	useEffect(() => {
		getSetting()
			.then((value) => {
				if (!value) throw new Error();
				return JSON.parse(value as string) as SettingState;
			})
			.catch(() => {
				saveSetting(initialState);
				return initialState;
			})
			.then((settings) => {
				dispatch({ type: "set_settings", payload: settings });
			});
	}, []);

	return (
		<SettingContext.Provider value={state}>
			<SettingDispatchContext.Provider value={dispatch}>
				{children}
			</SettingDispatchContext.Provider>
		</SettingContext.Provider>
	);
};

export { SettingProvider, SettingContext, SettingDispatchContext };
