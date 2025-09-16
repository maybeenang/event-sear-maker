import { useEffect, useRef } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { cn } from "@/lib/utils";
import { BRICK_SEAT_TYPE, useSeatMapStore } from "@/store/useSeatMap";
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

const SeatMapCanvas = () => {
	const { rows, cols, seats, handleSeatInteraction, mode } = useSeatMapStore();
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const isDrawingRef = useRef(false);

	const seatWidth = 40;
	const seatHeight = 40;
	const seatGap = 4;

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
				const x = c * (seatWidth + seatGap);
				const y = r * (seatHeight + seatGap);

				if (seat?.type) {
					if (seat.type.id === "brick") {
						ctx.fillStyle = "#808080";
					} else if (seat.ticketType) {
						ctx.fillStyle = seat.ticketType.color;
					} else {
						ctx.fillStyle = "#60A5FA";
					}
				} else {
					ctx.fillStyle = "#BDBDBD";
				}

				ctx.fillRect(x, y, seatWidth, seatHeight);

				ctx.fillStyle = "#000";
				ctx.font = "12px Arial";
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.fillText(seat?.label || "", x + seatWidth / 2, y + seatHeight / 2);
			}
		}
	}, [rows, cols, seats]);

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
							const state = instance.getContext().state;

							const rect = canvas.getBoundingClientRect();
							const x = (e.clientX - rect.left - state.positionX) / state.scale;
							const y = (e.clientY - rect.top - state.positionY) / state.scale;

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

