import localForage from "localforage";

import { createContext, useEffect, useReducer } from "react";

const SettingDispatchContext = createContext<React.Dispatch<SettingAction>>(
	() => undefined
);
const SettingContext = createContext<SettingState>({} as SettingState);

function reducer(state: SettingState, action: SettingAction): SettingState {
	switch (action.type) {
		case "set_settings":
			return {
				...action.payload,
			};

		case "set_otpgen_key_length":
			return { ...state, otpgen_key_length: action.payload };

		case "set_otpgen_key_split_length":
			return { ...state, otpgen_key_split_length: action.payload };

		case "set_otpgen_key_split_delimiter":
			return { ...state, otpgen_key_split_delimiter: action.payload };

		case "set_otpgen_otp_time_step":
			return { ...state, otpgen_otp_time_step: action.payload };

		case "set_otpman_otp_time_step":
			return { ...state, otpman_otp_time_step: action.payload };

		default:
			return state;
	}
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
		localForage
			.getItem("settings")
			.then((value) => {
				if (!value) throw new Error();
				return JSON.parse(value as string) as SettingState;
			})
			.catch(() => {
				localForage.setItem("settings", JSON.stringify(initialState));
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
