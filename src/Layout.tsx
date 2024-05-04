import BottomAppBar from "@/components/BottomAppBar";
import { Outlet } from "react-router-dom";

export default function Layout() {
	return (
		<>
			<Outlet />
			<div style={{ height: "3rem" }} />
			<BottomAppBar />
		</>
	);
}
