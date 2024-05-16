import Layout from "@/Layout";
import { Routes, Route, Link } from "react-router-dom";
import { OTPManager, OTPGenerator } from "@/pages";
import "@/App.css";

const App = () => {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<OTPManager />} />
				<Route path="otp-generator" element={<OTPGenerator />} />
				<Route path="*" element={<NoMatch />} />
			</Route>
		</Routes>
	);
};

const NoMatch = () => {
	return (
		<div>
			<h2>Nothing to see here!</h2>
			<p>
				<Link to="/">Go to the home page</Link>
			</p>
		</div>
	);
};

export default App;
