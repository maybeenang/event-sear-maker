import {
	MiniMap,
	TransformComponent,
	TransformWrapper,
} from "react-zoom-pan-pinch";
import { cn } from "@/lib/utils";
import { useSeatMapStore } from "@/store/useSeatMap";
import Seat from "./Seat";

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

const Legends = () => (
	<div className="flex bg-white">
		<div className="flex items-center gap-2 p-2">
			<div className="w-6 h-6 bg-white border border-gray-400 flex items-center justify-center text-xs font-mono select-none">
				A1
			</div>
			<span className="text-sm">Available</span>
		</div>
		<div className="flex items-center gap-2 p-2">
			<div className="w-6 h-6 bg-gray-400 border border-gray-400 flex items-center justify-center text-xs font-mono select-none">
				A1
			</div>
			<span className="text-sm">Unavailable</span>
		</div>
		<div className="flex items-center gap-2 p-2">
			<div className="w-6 h-6 bg-blue-400 border border-gray-400 flex items-center justify-center text-xs font-mono select-none">
				A1
			</div>
			<span className="text-sm">Selected</span>
		</div>
	</div>
);

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
				gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
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

	return (
		<div className=" bg-gray-200 flex flex-col">
			<Legends />

			<Stage />

			<div className="flex-1 bg-red-100 flex items-center justify-center overflow-hidden">
				<TransformWrapper
					initialScale={1.4}
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
								contentClass="bg-red-600"
								wrapperClass="flex-1 overflow-auto"
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
