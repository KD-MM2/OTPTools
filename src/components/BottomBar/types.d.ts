interface BottomBarButton {
	id: string;
	label: string;
	path: string;
	icon: React.ReactNode;
}

interface IconButtonWithTextProps {
	id: string;
	label: string;
	icon: React.ReactNode;
	onClick: (event: any) => void;
	onDoubleClick?: (event: any) => void;
}
