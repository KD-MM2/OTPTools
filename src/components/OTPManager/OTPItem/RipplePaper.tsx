import { Paper, styled } from "@mui/material";

const RipplePaper = styled(Paper)`
	animation: ripple 1s;
	opacity: 0;

	@keyframes ripple {
		from {
			opacity: 1;
			transform: scale(0);
		}

		to {
			opacity: 0;
			transform: scale(10);
		}
	}
`;

export default RipplePaper;
