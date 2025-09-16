import { X } from "lucide-react";
import { memo, useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";
import { type ISeat, useSeatMapStore } from "@/store/useSeatMap";

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

	const seat = useSeatMapStore(useShallow((state) => state.getSeat(row, col)));

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
			<BlockChair key={seat.label} />
		) : (
			<FilledChair key={seat.label} label={label} seat={seat} />
		)
	) : (
		<EmptyChair key={seat?.label} label={label} />
	);

	return (
		<button
			onMouseDown={() => handleMouseDown(row, col)}
			onMouseEnter={() => handleMouseEnter(row, col)}
			onMouseUp={() => setIsDrawing(false)}
			title={
				seat?.ticketType ? `${seat.ticketType.name} ${seat.label}` : "No Seat"
			}
			type="button"
			className={cn(
				"aspect-square min-w-[40px] min-h-[40px] flex items-center justify-center select-none text-xs",
				!seat && "opacity-30",
				"trainsition-all",
				// "hover:scale-105",
				// "hover:bg-red-100",
				className,
			)}
			{...props}
		>
			{chairComponent}
		</button>
	);
};

export const FilledChair = ({
	label,
	seat,
	className,
}: {
	label?: string;
	seat: ISeat;
	className?: string;
}) => {
	return (
		<div
			className={cn(
				"rounded border border-gray-800 w-full h-full border-b-4 flex items-center justify-center flex-col",
				className,
			)}
			style={{ backgroundColor: seat.ticketType?.color || "#60A5FA" }}
		>
			<span>{seat.ticketType?.label || ""}</span>
			<span>{label || ""}</span>
		</div>
	);
};

export const EmptyChair = ({
	label,
	className,
}: {
	label?: string;
	className?: string;
}) => {
	return (
		<span
			className={cn(
				"rounded border border-gray-400 w-full h-full flex items-center justify-center",
				className,
			)}
		>
			{label || ""}
		</span>
	);
};

export const BlockChair = ({ className }: { className?: string }) => {
	return (
		<span
			className={cn(
				"rounded border w-full h-full  flex items-center justify-center bg-gray-600 border-black opacity-70 border-b-4",
				className,
			)}
		>
			<X className="w-4 h-4 text-white" />
		</span>
	);
};

export default memo(Seat);
