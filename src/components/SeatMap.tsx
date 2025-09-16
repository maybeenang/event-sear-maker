import { useVirtualizer } from "@tanstack/react-virtual";
import { memo, useCallback, useRef } from "react";
import {
	MiniMap,
	TransformComponent,
	TransformWrapper,
} from "react-zoom-pan-pinch";
import { cn } from "@/lib/utils";
import { BRICK_SEAT_TYPE, useSeatMapStore } from "@/store/useSeatMap";
import Seat, { BlockChair, EmptyChair, FilledChair } from "./Seat";

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

// OPTIMIZED: Dibungkus dengan React.memo untuk mencegah re-render yang tidak perlu
const MapElement = memo(() => {
	const { rows, cols } = useSeatMapStore();
	const parentRef = useRef<HTMLDivElement>(null);

	// Ukuran kursi yang konsisten (lebar/tinggi + gap)
	const seatSize = 40 + 4; // 40px untuk ukuran, 4px untuk gap

	const rowVirtualizer = useVirtualizer({
		count: rows,
		getScrollElement: useCallback(() => parentRef.current, []),
		estimateSize: useCallback(() => seatSize, []),
		overscan: 2,
	});

	const columnVirtualizer = useVirtualizer({
		horizontal: true,
		count: cols,
		getScrollElement: useCallback(() => parentRef.current, []),
		estimateSize: useCallback(() => seatSize, []),
		overscan: 2,
	});

	return (
		// Parent untuk diukur oleh virtualizer dan react-zoom-pan-pinch
		<div ref={parentRef} className="overflow-auto w-full h-full">
			{/* Container dengan ukuran total grid untuk menyediakan ruang scroll */}
			<div
				style={{
					height: `${rowVirtualizer.getTotalSize()}px`,
					width: `${columnVirtualizer.getTotalSize()}px`,
					position: "relative",
				}}
			>
				{/* Render hanya item virtual yang terlihat */}
				{rowVirtualizer.getVirtualItems().map((virtualRow) =>
					columnVirtualizer.getVirtualItems().map((virtualColumn) => {
						const rowIndex = virtualRow.index;
						const colIndex = virtualColumn.index;
						const seatLabel = `${String.fromCharCode(65 + rowIndex)}${
							colIndex + 1
						}`;

						return (
							<div
								key={`${rowIndex}-${colIndex}`}
								style={{
									position: "absolute",
									top: 0,
									left: 0,
									width: `${virtualColumn.size}px`,
									height: `${virtualRow.size}px`,
									transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`,
								}}
							>
								<Seat row={rowIndex} col={colIndex} label={seatLabel} />
							</div>
						);
					}),
				)}
			</div>
		</div>
	);
});

const SeatMap = () => {
	const { showMinimap, mode, rows, cols } = useSeatMapStore();

	// OPTIMIZED: Kursor kustom diaktifkan kembali
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
					// OPTIMIZED: Terapkan kelas kursor di sini
				>
					{() => (
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
										{/* OPTIMIZED: Gunakan placeholder, bukan MapElement penuh */}
										<div
											style={{
												width: `${cols * 44}px`,
												height: `${rows * 44}px`,
												backgroundColor: "rgba(107, 114, 128, 0.2)",
											}}
										/>
									</MiniMap>
								</div>
							)}
							<TransformComponent
								// OPTIMIZED: Pastikan wrapper mengisi seluruh area
								wrapperStyle={{ width: "100%", height: "100%" }}
								wrapperClass={cursorClass}
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
