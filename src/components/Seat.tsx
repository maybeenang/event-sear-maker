import type React from "react";
import { memo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useSeatMapStore, type ISeat } from "@/store/useSeatMap";
import { X } from "lucide-react";

interface SeatProps extends React.HTMLAttributes<HTMLButtonElement> {
	row: number;
	col: number;
	label?: string;
}

const Seat: React.FC<SeatProps> = ({
	children,
	className,
	row,
	col,
	label,
	...props
}) => {
	const { handleSeatInteraction, isDrawing, setIsDrawing, mode } =
		useSeatMapStore();

	const seat = useSeatMapStore(
		useCallback((state) => state.getSeat(row, col), [row, col]),
	);

	const handleMouseDown = useCallback(
		(row: number, col: number) => {
			if (mode !== "edit") return;
			setIsDrawing(true);
			handleSeatInteraction(row, col);
		},
		[handleSeatInteraction, mode, setIsDrawing],
	);

	const handleMouseEnter = useCallback(
		(row: number, col: number) => {
			if (mode !== "edit") return;
			if (isDrawing) {
				handleSeatInteraction(row, col);
			}
		},
		[handleSeatInteraction, isDrawing, mode],
	);

	const chairComponent = seat?.type ? (
		seat?.type?.id === "brick" ? (
			<BlockChair />
		) : (
			<FilledChair label={label} seat={seat} />
		)
	) : (
		<EmptyChair label={label} />
	);

	return (
		<button
			onMouseDown={() => handleMouseDown(row, col)}
			onMouseEnter={() => handleMouseEnter(row, col)}
			onMouseUp={() => setIsDrawing(false)}
			title={seat ? `Seat ${seat.id}` : "No Seat"}
			type="button"
			className={cn(
				" aspect-square min-w-[40px] min-h-[40px] flex items-center justify-center select-none cursor-pointer text-xs transition-all",
				!seat && "opacity-30",
				"hover:scale-105",
				"hover:bg-red-100",
				className,
			)}
			{...props}
		>
			{chairComponent}
		</button>
	);
};

const FilledChair = ({ label, seat }: { label?: string; seat: ISeat }) => {
	return (
		<div
			className={cn(
				"rounded border border-gray-800 w-full h-full border-b-4 flex items-center justify-center flex-col",
			)}
			style={{ backgroundColor: seat.ticketType?.color || "#60A5FA" }}
		>
			<span>{seat.ticketType?.label || ""}</span>
			<span>{label || ""}</span>
		</div>
	);
};

const EmptyChair = ({ label }: { label?: string }) => {
	return (
		<span
			className={cn(
				"rounded border border-gray-400 w-full h-full flex items-center justify-center",
			)}
		>
			{label || ""}
		</span>
	);
};

const BlockChair = () => {
	return (
		<span
			className={cn(
				"rounded border w-full h-full  flex items-center justify-center bg-gray-600 border-black opacity-70 border-b-4",
			)}
		>
			<X className="w-4 h-4 text-white" />
		</span>
	);
};

export default memo(Seat);
