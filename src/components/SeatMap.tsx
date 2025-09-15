import {
	MiniMap,
	TransformComponent,
	TransformWrapper,
} from "react-zoom-pan-pinch";
import { cn } from "@/lib/utils";
import { BRICK_SEAT_TYPE, useSeatMapStore } from "@/store/useSeatMap";
import Seat, { BlockChair, EmptyChair, FilledChair } from "./Seat";
import { X } from "lucide-react";

//
// const _Controls = ({
// 	zoomIn,
// 	zoomOut,
// 	resetTransform,
// }: {
// 	zoomIn: () => void;
// 	zoomOut: () => void;
// 	resetTransform: () => void;
// }) => (
// 	<div className="fixed top-4 left-4 rounded-sm space-x-2 z-10 flex flex-col gap-2">
// 		<button
// 			onClick={() => zoomIn()}
// 			type="button"
// 			className="rounded-full p-2 bg-white"
// 		>
// 			+
// 		</button>
// 		<button
// 			onClick={() => zoomOut()}
// 			type="button"
// 			className="rounded-full p-2 bg-white"
// 		>
// 			-
// 		</button>
// 		<button
// 			onClick={() => resetTransform()}
// 			type="button"
// 			className="rounded-full p-2 bg-white"
// 		>
// 			x
// 		</button>
// 	</div>
// );

const Legends = () => {
	const { seatTypes, ticketTypes } = useSeatMapStore();

	return (
		<div className="flex bg-white items-center gap-4 p-4">
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
	<div className=" h-16 mx-auto w-xl bg-gray-800 flex items-center justify-center text-white m-4 rounded text-xl font-semibold">
		STAGE
	</div>
);

const MapElement = () => {
	const { rows, cols } = useSeatMapStore();
	return (
		<div
			className={cn("grid gap-1")}
			style={{
				gridTemplateColumns: `repeat(${cols}, 40px)`,
			}}
		>
			{Array.from({ length: rows }).map((_, rowIndex) =>
				Array.from({ length: cols }).map((_, colIndex) => {
					const seatLabel = `${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`;
					return (
						<Seat
							key={seatLabel}
							row={rowIndex}
							col={colIndex}
							label={seatLabel}
						>
							{seatLabel}
						</Seat>
					);
				}),
			)}
		</div>
	);
};

const SeatMap = () => {
	const { showMinimap, mode } = useSeatMapStore();

	// const cursorClass = {
	// 	normal: "",
	// 	grep: "cursor-grab",
	// 	edit: "cursor-edit",
	// }[mode];

	return (
		<div className={cn(" bg-gray-200 flex flex-col h-screen")}>
			<Legends />

			<Stage />

			<div className="flex-1">
				<TransformWrapper
					initialScale={1}
					initialPositionX={0}
					initialPositionY={0}
					minScale={0.5}
					maxScale={4}
					centerOnInit
					limitToBounds={false}
					maxPositionX={200}
					maxPositionY={200}
					minPositionX={-200}
					minPositionY={-200}
					panning={{
						wheelPanning: true,
						allowLeftClickPan: mode === "grep",
					}}
					wheel={{
						wheelDisabled: true,
					}}
				>
					{(_) => (
						<>
							{showMinimap && (
								<div
									style={{
										position: "fixed",
										zIndex: 5,
										top: "50px",
										right: "50px",
									}}
								>
									<MiniMap width={200}>
										<MapElement />
									</MiniMap>
								</div>
							)}
							<TransformComponent
								wrapperStyle={{
									width: "100%",
									height: "100%",
								}}
							>
								<MapElement />
							</TransformComponent>
						</>
					)}
				</TransformWrapper>
			</div>
		</div>
	);
};

export default SeatMap;
