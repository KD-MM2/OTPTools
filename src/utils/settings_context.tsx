
// export { initialState, reducer };

// type State = {
	
// };

// type Action =
// 	| { type: "setSecret"; payload: string }
// 	| { type: "setEpochTime"; payload: number }
// 	| { type: "setEpochIteration"; payload: string }
// 	| { type: "setHmac"; payload: string }
// 	| { type: "setPreviousOTP"; payload: string | number }
// 	| { type: "setCurrentOTP"; payload: string | number }
// 	| { type: "setNextOTP"; payload: string | number }
// 	| { type: "setKeyHex"; payload: string }
// 	| { type: "setKeyLength"; payload: number }
// 	| { type: "setAccountName"; payload: string }
// 	| { type: "setIssuer"; payload: string }
// 	| { type: "setQRCode"; payload: string }
// 	| { type: "setProgress"; payload: number }
// 	| { type: "decrementProgress" };

// const initialState: State = {
// 	secret: generateSecret(),
// 	epochTime: 0,
// 	epochIteration: "",
// 	hmac: "",
// 	previousOTP: "",
// 	currentOTP: "",
// 	nextOTP: "",
// 	keyHex: "",
// 	keyLength: 160,
// 	accountName: "",
// 	issuer: "",
// 	qrCode: DummyQR,
// 	progress: 100,
// };

// function reducer(state: State, action: Action): State {
// 	switch (action.type) {
// 		case "setSecret":
// 			return { ...state, secret: action.payload };
// 		case "setEpochTime":
// 			return { ...state, epochTime: action.payload };
// 		case "setEpochIteration":
// 			return { ...state, epochIteration: action.payload };
// 		case "setHmac":
// 			return { ...state, hmac: action.payload };
// 		case "setPreviousOTP":
// 			return { ...state, previousOTP: action.payload };
// 		case "setCurrentOTP":
// 			return { ...state, currentOTP: action.payload };
// 		case "setNextOTP":
// 			return { ...state, nextOTP: action.payload };
// 		case "setKeyHex":
// 			return { ...state, keyHex: action.payload };
// 		case "setKeyLength":
// 			return { ...state, keyLength: action.payload };
// 		case "setAccountName":
// 			return { ...state, accountName: action.payload };
// 		case "setIssuer":
// 			return { ...state, issuer: action.payload };
// 		case "setQRCode":
// 			return { ...state, qrCode: action.payload };
// 		case "setProgress":
// 			return { ...state, progress: action.payload };
// 		case "decrementProgress": {
// 			const newProgress = Math.max(state.progress - 100 / 30, 0);
// 			return { ...state, progress: newProgress <= 0 ? 100 : newProgress };
// 		}
// 		default:
// 			return state;
// 	}
// }
