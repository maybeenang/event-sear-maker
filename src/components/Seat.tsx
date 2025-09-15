import type React from "react";
import { memo } from "react";
import { cn } from "@/lib/utils";
import { useSeatMapStore } from "@/store/useSeatMap";

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
	const { handleSeatInteraction, getSeat, isDrawing, setIsDrawing, mode } =
		useSeatMapStore();

	const seat = getSeat?.(row, col);

	const handleMouseDown = (row: number, col: number) => {
		if (mode !== "edit") return;
		setIsDrawing(true);
		handleSeatInteraction(row, col);
	};

	const handleMouseEnter = (row: number, col: number) => {
		if (mode !== "edit") return;
		if (isDrawing) {
			handleSeatInteraction(row, col);
		}
	};

	return (
		<button
			onMouseDown={() => handleMouseDown(row, col)}
			onMouseEnter={() => handleMouseEnter(row, col)}
			onMouseUp={() => setIsDrawing(false)}
			title={seat ? `Seat ${seat.id}` : "No Seat"}
			type="button"
			className={cn(
				" aspect-square min-w-[40px] min-h-[40px] flex items-center justify-center select-none cursor-pointer text-xs",
				!seat && "opacity-50",
				className,
			)}
			{...props}
		>
			{seat ? <FilledChair /> : <EmptyChair label={label} />}
		</button>
	);
};

const FilledChair = () => {
	return (
		<div
			className={cn("rounded border border-gray-800 w-full h-full border-b-4")}
		></div>
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

export default memo(Seat);
