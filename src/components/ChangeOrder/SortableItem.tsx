import { createContext, useContext, useMemo } from "react";
import type { CSSProperties, PropsWithChildren } from "react";
import type {
	DraggableSyntheticListeners,
	UniqueIdentifier,
} from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Paper, styled } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

interface Props {
	id: UniqueIdentifier;
}

interface Context {
	attributes: Record<string, any>;
	listeners: DraggableSyntheticListeners;
	ref(node: HTMLElement | null): void;
}

const SortableItemContext = createContext<Context>({
	attributes: {},
	listeners: undefined,
	ref() {},
});

const StyledPaper = styled(Paper)(() => ({
	display: "flex",
	justifyContent: "space-between",
	flexGrow: 1,
	alignItems: "center",
	padding: "18px 20px",
	fontFamily: "monospace",
}));

function SortableItem({ children, id }: PropsWithChildren<Props>) {
	const {
		attributes,
		isDragging,
		listeners,
		setNodeRef,
		setActivatorNodeRef,
		transform,
		transition,
	} = useSortable({ id });
	const context = useMemo(
		() => ({
			attributes,
			listeners,
			ref: setActivatorNodeRef,
		}),
		[attributes, listeners, setActivatorNodeRef]
	);
	const style: CSSProperties = {
		opacity: isDragging ? 0.4 : undefined,
		transform: CSS.Translate.toString(transform),
		transition,
	};

	return (
		<SortableItemContext.Provider value={context}>
			<StyledPaper ref={setNodeRef} style={style}>
				{children}
			</StyledPaper>
		</SortableItemContext.Provider>
	);
}

function DragHandle() {
	const { attributes, listeners, ref } = useContext(SortableItemContext);
	return (
		<Button
			sx={{ p: "15px" }}
			{...attributes}
			{...listeners}
			ref={ref}
			disableRipple
			disableFocusRipple
			disableTouchRipple
		>
			<DragIndicatorIcon />
		</Button>
	);
}

export { SortableItem, DragHandle };
