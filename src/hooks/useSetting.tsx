import { useContext } from "react";

import { SettingContext, SettingDispatchContext } from "./setting_provider";

const useSetting = () => {
	return useContext(SettingContext);
};

const useSettingDispatch = () => {
	return useContext(SettingDispatchContext);
};

export { useSetting, useSettingDispatch };
