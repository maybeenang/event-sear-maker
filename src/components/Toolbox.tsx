import {
	Eraser,
	Eye,
	EyeOff,
	Hand,
	Minus,
	MousePointer2,
	Pencil,
	Plus,
	Settings,
	Ticket,
	X,
} from "lucide-react";
import { memo } from "react";
import { cn } from "@/lib/utils";
import { useSeatMapStore } from "@/store/useSeatMap";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
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
	const {
		rows,
		cols,
		setRows,
		setCols,
		setShowMinimap,
		showMinimap,
		mode,
		setMode,
	} = useSeatMapStore();

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
			<Popover>
				<PopoverTrigger asChild>
					<Button
						type="button"
						size="icon"
						variant="outline"
						onClick={() => {
							setMode?.("normal");
						}}
					>
						<Settings />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto flex gap-4" sideOffset={20}>
					<section className="flex flex-col gap-2">
						<Label>Rows</Label>
						<div className="flex items-center gap-2">
							<Button
								type="button"
								size="icon"
								onClick={() => setRows(Math.max(1, rows - 1))}
							>
								<Minus className="size-3" />
							</Button>
							<Input
								name="row"
								type="number"
								className="w-16 text-center"
								min={1}
								value={rows}
								onChange={(e) => setRows(Number(e.target.value))}
							/>

							<Button
								type="button"
								size="icon"
								onClick={() => setRows(rows + 1)}
							>
								<Plus className="size-3" />
							</Button>
						</div>
					</section>

					<section className="flex flex-col gap-2">
						<Label>Cols</Label>
						<div className="flex items-center gap-2">
							<Button
								type="button"
								size="icon"
								onClick={() => setCols(Math.max(1, cols - 1))}
							>
								<Minus className="size-3" />
							</Button>
							<Input
								name="row"
								type="number"
								className="w-16 text-center"
								min={1}
								value={cols}
								onChange={(e) => setCols(Number(e.target.value))}
							/>

							<Button
								type="button"
								size="icon"
								onClick={() => setCols(cols + 1)}
							>
								<Plus className="size-3" />
							</Button>
						</div>
					</section>

					<section className="flex flex-col gap-2">
						<Label>Minimap</Label>
						<div className="flex items-center gap-2">
							<Button
								type="button"
								size="icon"
								variant={showMinimap ? "default" : "outline"}
								onClick={() => setShowMinimap?.(!showMinimap)}
							>
								{showMinimap ? <EyeOff /> : <Eye />}
							</Button>
						</div>
					</section>
				</PopoverContent>
			</Popover>
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
			{editingToolsIcons[seatType.id as keyof typeof editingToolsIcons] ||
				seatType.label}
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
