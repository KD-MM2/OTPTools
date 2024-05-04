import { Routes, Route, Link } from "react-router-dom";
import Layout from "@/Layout";
import { OTPGenerator } from "@/components/OTPGenerator";
import "@/App.css";

export default function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<>otp manager</>} />
				<Route path="otp-generator" element={<OTPGenerator />} />
				<Route path="*" element={<NoMatch />} />
			</Route>
		</Routes>
	);
}

function NoMatch() {
	return (
		<div>
			<h2>Nothing to see here!</h2>
			<p>
				<Link to="/">Go to the home page</Link>
			</p>
		</div>
	);
}
