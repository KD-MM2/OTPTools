import React from "react";
import { Outlet } from "react-router-dom";

import { useMediaQuery, CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { BottomBar } from "@/views";

import { SettingProvider } from "./hooks";

const Layout = () => {
	const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

	const theme = React.useMemo(
		() =>
			createTheme({
				palette: {
					mode: prefersDarkMode ? "dark" : "light",
				},
			}),
		[prefersDarkMode]
	);

	React.useEffect(() => {
		document.body.style.setProperty(
			"--primary-color",
			theme.palette.primary.main
		);
		document.body.style.setProperty(
			"--text-primary-color",
			theme.palette.background.default
		);
		document.body.style.setProperty(
			"--action-disabled-color",
			theme.palette.action.disabledBackground
		);
		document.body.style.setProperty(
			"--action-disabled-selected-color",
			theme.palette.action.disabled
		);
	}, [theme]);

	return (
		<React.StrictMode>
			<SettingProvider>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<Outlet />
					<div style={{ height: "3rem" }} />
					<BottomBar />
				</ThemeProvider>
			</SettingProvider>
		</React.StrictMode>
	);
};

export default Layout;
