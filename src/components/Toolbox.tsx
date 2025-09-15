import {
	Download,
	Eraser,
	Hand,
	MousePointer2,
	Pencil,
	Settings,
	Ticket,
	Upload,
	X,
} from "lucide-react";
import { memo } from "react";
import { cn } from "@/lib/utils";
import { useSeatMapStore } from "@/store/useSeatMap";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const ToolBoxButton = ({
	children,
	onClick,
	active,
	title,
	disabled = false,
	className,
	style,
}: {
	children: React.ReactNode;
	onClick: () => void;
	active: boolean;
	title?: string;
	disabled?: boolean;
	className?: string;
	style?: React.CSSProperties;
}) => (
	<Button
		type="button"
		size="icon"
		variant={active ? "default" : "outline"}
		onClick={onClick}
		title={title}
		disabled={disabled}
		className={cn(className)}
		style={style}
	>
		{children}
	</Button>
);

const Toolbox = () => {
	const { setSettingDialogOpen, mode, setMode } = useSeatMapStore();

	return (
		<div
			className={cn(
				"fixed bottom-4 left-1/2 -translate-x-1/2 bg-white p-2 rounded-lg shadow-lg flex gap-8",
			)}
		>
			<section className="flex flex-col gap-2">
				<div className="flex items-center gap-2">
					<ToolBoxButton
						onClick={() => setMode?.("normal")}
						active={mode === "normal"}
					>
						<MousePointer2 />
					</ToolBoxButton>
					<ToolBoxButton
						onClick={() => setMode?.("grep")}
						active={mode === "grep"}
					>
						<Hand />
					</ToolBoxButton>
					<Popover open={mode === "edit"}>
						<PopoverTrigger asChild>
							<Button
								type="button"
								size="icon"
								variant={mode === "edit" ? "default" : "outline"}
								onClick={() => {
									setMode?.(mode === "edit" ? "normal" : "edit");
								}}
							>
								<Pencil />
							</Button>
						</PopoverTrigger>
						<PopoverContent sideOffset={16} className="p-2 flex gap-2 w-fit">
							<EditingTools />

							<div className="border-l border-gray-200" />
							<TicketTypeTools />
						</PopoverContent>
					</Popover>
				</div>
			</section>

			<Button
				type="button"
				size="icon"
				variant="outline"
				onClick={() => {
					setSettingDialogOpen(true);
				}}
			>
				<Settings />
			</Button>
		</div>
	);
};

const editingToolsIcons = {
	none: <Eraser />,
	brick: <X />,
	ticket: <Ticket />,
};

const EditingTools = () => {
	const { selectedSeatType, seatTypes, setSelectedSeatType } =
		useSeatMapStore();

	return seatTypes.map((seatType) => (
		<ToolBoxButton
			key={seatType.id}
			onClick={() => {
				setSelectedSeatType?.(seatType);
			}}
			active={selectedSeatType?.id === seatType.id}
			title={seatType.name}
		>
			{editingToolsIcons[seatType.id as keyof typeof editingToolsIcons]}
		</ToolBoxButton>
	));
};

const TicketTypeTools = () => {
	const {
		selectedTicketType,
		ticketTypes,
		setSelectedTicketType,
		selectedSeatType,
	} = useSeatMapStore();

	return ticketTypes.map((ticketType) => (
		<button
			key={ticketType.id}
			onClick={() => {
				if (selectedSeatType?.id !== "ticket") return;
				setSelectedTicketType?.(ticketType);
			}}
			disabled={selectedSeatType?.id !== "ticket"}
			title={ticketType.name}
			type="button"
			className={cn(
				"text-xs px-2 py-1 rounded-md border",
				selectedSeatType?.id !== "ticket" && "opacity-50 cursor-not-allowed",
			)}
			style={{
				backgroundColor:
					selectedTicketType?.id === ticketType.id
						? ticketType.color
						: undefined,
				borderColor: ticketType.color,
			}}
		>
			{ticketType.name}
		</button>
	));
};

export default memo(Toolbox);
