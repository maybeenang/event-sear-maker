import { cn } from "@/lib/utils";
import { useSeatMapStore } from "@/store/useSeatMap";
import type React from "react";

interface SeatProps extends React.HTMLAttributes<HTMLButtonElement> {
	row: number;
	col: number;
}

const Seat: React.FC<SeatProps> = ({
	children,
	className,
	row,
	col,
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
			type="button"
			className={cn(
				"w-6 h-6 border border-gray-400 flex items-center justify-center font-mono select-none cursor-pointer text-xs",
				!seat && "opacity-50",
				className,
			)}
			style={{
				backgroundColor: seat?.type.color || "transparent",
				color: seat
					? seat.type.color === "#ffffff"
						? "#000000"
						: "#ffffff"
					: "#000000",
			}}
			{...props}
		>
			{children}
		</button>
	);
};

export default Seat;
