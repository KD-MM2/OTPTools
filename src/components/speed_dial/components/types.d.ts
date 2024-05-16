interface FabItem {
	id: string;
	enabled: boolean;
	icon: React.ReactNode;
	name: string;
	cb: (params?: any) => void;
}

interface SpeedDialProps {
	open: boolean;
	setOpen: (value: boolean) => void;
	progress: number;
}
