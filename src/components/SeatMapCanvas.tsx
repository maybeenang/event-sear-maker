import { useEffect, useRef } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { usePrevious } from "@/lib/hooks/usePrevious";
import { cn } from "@/lib/utils";
import {
	BRICK_SEAT_TYPE,
	type ISeat,
	useSeatMapStore,
} from "@/store/useSeatMap";
import { BlockChair, EmptyChair, FilledChair } from "./Seat";

const Legends = () => {
	const { ticketTypes } = useSeatMapStore();

	return (
		<div className="flex bg-white items-center flex-wrap gap-4 p-4">
			{ticketTypes.map((type) => (
				<div key={type.id} className="flex items-center text-xs">
					<FilledChair
						key={type.id}
						className="w-6 h-6 mr-1"
						seat={{
							label: type.name,
							type: type,
							ticketType: type,
							id: "",
							row: -1,
							col: -1,
						}}
					/>
					<span>{type.name}</span>
				</div>
			))}
			<section>
				<div className="flex items-center text-xs">
					<BlockChair className="w-6 h-6 mr-1" />
					<span>{BRICK_SEAT_TYPE.name}</span>
				</div>
			</section>
			<section>
				<div className="flex items-center text-xs">
					<EmptyChair className="w-6 h-6 mr-1" label="A1" />
					<span>Empty</span>
				</div>
			</section>
		</div>
	);
};

const Stage = () => (
	<div className="h-16 mx-auto w-xl bg-gray-800 flex items-center justify-center text-white m-4 rounded text-xl font-semibold">
		STAGE
	</div>
);

const seatWidth = 40;
const seatHeight = 40;
const seatGap = 4;
const cornerRadius = 5;
const bottomBorderHeight = 4;

const drawBlockChair = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
	// BlockChair style
	ctx.fillStyle = "#4B5563"; // bg-gray-600
	ctx.strokeStyle = "#000000"; // border-black
	ctx.lineWidth = 1;

	// Draw main rectangle with rounded corners
	ctx.beginPath();
	ctx.moveTo(x + cornerRadius, y);
	ctx.lineTo(x + seatWidth - cornerRadius, y);
	ctx.arcTo(x + seatWidth, y, x + seatWidth, y + cornerRadius, cornerRadius);
	ctx.lineTo(x + seatWidth, y + seatHeight - cornerRadius - bottomBorderHeight);
	ctx.arcTo(
		x + seatWidth,
		y + seatHeight - bottomBorderHeight,
		x + seatWidth - cornerRadius,
		y + seatHeight - bottomBorderHeight,
		cornerRadius,
	);
	ctx.lineTo(x + cornerRadius, y + seatHeight - bottomBorderHeight);
	ctx.arcTo(
		x,
		y + seatHeight - bottomBorderHeight,
		x,
		y + seatHeight - cornerRadius - bottomBorderHeight,
		cornerRadius,
	);
	ctx.lineTo(x, y + cornerRadius);
	ctx.arcTo(x, y, x + cornerRadius, y, cornerRadius);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();

	// Draw bottom border
	ctx.fillStyle = "#000000";
	ctx.fillRect(
		x,
		y + seatHeight - bottomBorderHeight,
		seatWidth,
		bottomBorderHeight,
	);

	// Draw 'X'
	ctx.strokeStyle = "#FFFFFF";
	ctx.lineWidth = 2;
	ctx.beginPath();
	const xOffset = seatWidth / 4;
	const yOffset = seatHeight / 4;
	ctx.moveTo(x + xOffset, y + yOffset);
	ctx.lineTo(
		x + seatWidth - xOffset,
		y + seatHeight - yOffset - bottomBorderHeight,
	);
	ctx.moveTo(x + seatWidth - xOffset, y + yOffset);
	ctx.lineTo(x + xOffset, y + seatHeight - yOffset - bottomBorderHeight);
	ctx.stroke();
};

const drawFilledChair = (
	ctx: CanvasRenderingContext2D,
	seat: ISeat,
	x: number,
	y: number,
) => {
	// FilledChair style
	ctx.fillStyle = seat.ticketType?.color || "#60A5FA";
	ctx.strokeStyle = "#1F2937"; // border-gray-800
	ctx.lineWidth = 1;

	// Draw main rectangle with rounded corners
	ctx.beginPath();
	ctx.moveTo(x + cornerRadius, y);
	ctx.lineTo(x + seatWidth - cornerRadius, y);
	ctx.arcTo(x + seatWidth, y, x + seatWidth, y + cornerRadius, cornerRadius);
	ctx.lineTo(x + seatWidth, y + seatHeight - cornerRadius - bottomBorderHeight);
	ctx.arcTo(
		x + seatWidth,
		y + seatHeight - bottomBorderHeight,
		x + seatWidth - cornerRadius,
		y + seatHeight - bottomBorderHeight,
		cornerRadius,
	);
	ctx.lineTo(x + cornerRadius, y + seatHeight - bottomBorderHeight);
	ctx.arcTo(
		x,
		y + seatHeight - bottomBorderHeight,
		x,
		y + seatHeight - cornerRadius - bottomBorderHeight,
		cornerRadius,
	);
	ctx.lineTo(x, y + cornerRadius);
	ctx.arcTo(x, y, x + cornerRadius, y, cornerRadius);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();

	// Draw bottom border
	ctx.fillStyle = "#1F2937";
	ctx.fillRect(
		x,
		y + seatHeight - bottomBorderHeight,
		seatWidth,
		bottomBorderHeight,
	);

	// Draw text
	ctx.fillStyle = "#000";
	ctx.font = "bold 11px Arial";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(
		seat.ticketType?.label || "",
		x + seatWidth / 2,
		y + seatHeight / 2.5,
	);
	ctx.font = "9px Arial";
	ctx.fillText(seat.label || "", x + seatWidth / 2, y + seatHeight / 1.5);
};

const drawEmptyChair = (
	ctx: CanvasRenderingContext2D,
	seat: ISeat,
	x: number,
	y: number,
) => {
	// EmptyChair style
	ctx.strokeStyle = "#9CA3AF"; // border-gray-400
	ctx.lineWidth = 1;

	// Draw rectangle with rounded corners
	ctx.beginPath();
	ctx.moveTo(x + cornerRadius, y);
	ctx.lineTo(x + seatWidth - cornerRadius, y);
	ctx.arcTo(x + seatWidth, y, x + seatWidth, y + cornerRadius, cornerRadius);
	ctx.lineTo(x + seatWidth, y + seatHeight - cornerRadius);
	ctx.arcTo(
		x + seatWidth,
		y + seatHeight,
		x + seatWidth - cornerRadius,
		y + seatHeight,
		cornerRadius,
	);
	ctx.lineTo(x + cornerRadius, y + seatHeight);
	ctx.arcTo(x, y + seatHeight, x, y + seatHeight - cornerRadius, cornerRadius);
	ctx.lineTo(x, y + cornerRadius);
	ctx.arcTo(x, y, x + cornerRadius, y, cornerRadius);
	ctx.closePath();
	ctx.stroke();

	// Draw text
	ctx.fillStyle = "#000";
	ctx.font = "10px Arial";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(seat?.label || "", x + seatWidth / 2, y + seatHeight / 2);
};

const drawSeat = (
	ctx: CanvasRenderingContext2D,
	seat: ISeat,
	x: number,
	y: number,
) => {
	// Clear the area for the seat
	ctx.clearRect(x - 1, y - 1, seatWidth + 2, seatHeight + 2);

	if (seat?.type) {
		if (seat.type.id === "brick") {
			drawBlockChair(ctx, x, y);
		} else {
			drawFilledChair(ctx, seat, x, y);
		}
	} else {
		drawEmptyChair(ctx, seat, x, y);
	}
};

const SeatMapCanvas = () => {
	const { rows, cols, seats, handleSeatInteraction, mode } = useSeatMapStore();
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const isDrawingRef = useRef(false);
	const prevSeats = usePrevious(seats);

	// Effect for initial drawing and resizing
	// biome-ignore lint/correctness/useExhaustiveDependencies: <dc>
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		canvas.width = (seatWidth + seatGap) * cols;
		canvas.height = (seatHeight + seatGap) * rows;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				const seatId = `${r}-${c}`;
				const seat = seats[seatId];
				if (seat) {
					const x = c * (seatWidth + seatGap);
					const y = r * (seatHeight + seatGap);
					drawSeat(ctx, seat, x, y);
				}
			}
		}

		return () => {};
	}, [rows, cols]); // Only re-run when dimensions change

	// Effect for updating individual seats
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Find changed seats
		const changedSeats = Object.keys(seats).filter(
			(id) => prevSeats && seats[id] !== prevSeats[id],
		);

		// Redraw only the changed seats
		for (const id of changedSeats) {
			const seat = seats[id];
			if (seat) {
				const x = seat.col * (seatWidth + seatGap);
				const y = seat.row * (seatHeight + seatGap);
				drawSeat(ctx, seat, x, y);
			}
		}
	}, [seats, prevSeats]);

	const cursorClass = {
		normal: "",
		grep: "cursor-grab",
		edit: "cursor-edit",
	}[mode];

	return (
		<div className={cn("bg-gray-200 flex flex-col h-screen")}>
			<Legends />
			<Stage />
			<div className="flex-1">
				<TransformWrapper
					initialScale={1}
					minScale={0.5}
					maxScale={4}
					centerOnInit
					limitToBounds={false}
					panning={{
						wheelPanning: true,
						allowLeftClickPan: mode === "grep",
					}}
					wheel={{
						wheelDisabled: true,
					}}
				>
					{({ instance }) => {
						const handleInteraction = (
							e: React.MouseEvent<HTMLCanvasElement>,
						) => {
							const canvas = canvasRef.current;
							if (!canvas) return;
							const { state } = instance.getContext();

							const rect = canvas.getBoundingClientRect();
							const x = (e.clientX - rect.left) / state.scale;
							const y = (e.clientY - rect.top) / state.scale;

							const col = Math.floor(x / (seatWidth + seatGap));
							const row = Math.floor(y / (seatHeight + seatGap));

							if (row >= 0 && row < rows && col >= 0 && col < cols) {
								handleSeatInteraction(row, col);
							}
						};

						return (
							<TransformComponent
								wrapperStyle={{ width: "100%", height: "100%" }}
								wrapperClass={cursorClass}
							>
								<canvas
									ref={canvasRef}
									onMouseDown={(e) => {
										if (mode === "edit") {
											isDrawingRef.current = true;
										}
										handleInteraction(e);
									}}
									onMouseMove={(e) => {
										if (isDrawingRef.current && mode === "edit") {
											handleInteraction(e);
										}
									}}
									onMouseUp={() => {
										if (mode === "edit") {
											isDrawingRef.current = false;
										}
									}}
								/>
							</TransformComponent>
						);
					}}
				</TransformWrapper>
			</div>
		</div>
	);
};

export default SeatMapCanvas;
