import { create } from "zustand";

export interface ISeat {
	id: string;
	row: number;
	col: number;
	type: ISeatType;
}

export interface ISeatType {
	id: string;
	name: string;
	color: string;
	label: string;
}

interface SeatMapState {
	// state
	rows: number;
	cols: number;
	seats: ISeat[];
	mode: "normal" | "grep" | "edit";
	seatTypes: ISeatType[];
	selectedSeatType?: ISeatType;

	isDrawing: boolean;

	showMinimap: boolean;

	// getter
	getSeat: (row: number, col: number) => ISeat | undefined;
	getSeats: () => ISeat[];
	getSeatTypes: () => ISeatType[];

	// actions
	setRows: (rows: number) => void;
	setCols: (cols: number) => void;
	setMode: (mode: "normal" | "grep" | "edit") => void;
	setShowMinimap: (show: boolean) => void;
	setSeats: (seats: ISeat[]) => void;
	setSelectedSeatType: (seatType: ISeatType) => void;
	setSeatTypes: (seatTypes: ISeatType[]) => void;
	setIsDrawing: (isDrawing: boolean) => void;

	updateSeat: (row: number, col: number) => void;

	// complex actions can be added here
	handleSeatInteraction: (row: number, col: number) => void;
}

export const useSeatMapStore = create<SeatMapState>((set, get) => ({
	// initial state
	rows: 10,
	cols: 26,
	seats: [],
	mode: "normal",
	showMinimap: false,
	seatTypes: [
		{ id: "none", name: "None", color: "gray", label: "N" },
		{ id: "available", name: "Available", color: "green", label: "A" },
		{ id: "unavailable", name: "Unavailable", color: "red", label: "U" },
	],
	isDrawing: false,

	selectedSeatType: undefined,

	getSeat: (row, col) => {
		return get().seats.find((seat) => seat.row === row && seat.col === col);
	},

	getSeats: () => {
		return get().seats;
	},

	getSeatTypes: () => {
		return get().seatTypes;
	},

	// actions
	setSeatTypes: (seatTypes) => set(() => ({ seatTypes })),

	setRows: (rows) => set(() => ({ rows })),
	setCols: (cols) => set(() => ({ cols })),
	setMode: (mode) => {
		// check if mode is edit
		if (mode === "edit") {
			// check apakah selectedSeatType ada
			if (!get().selectedSeatType) {
				// jika tidak ada, set ke seatTypes[0]
				const seatTypes = get().seatTypes;
				if (seatTypes.length > 0) {
					set(() => ({ selectedSeatType: seatTypes[0] }));
				}
			}
		}

		set(() => ({ mode }));
	},
	setShowMinimap: (show) => set(() => ({ showMinimap: show })),
	setSeats: (seats) => set(() => ({ seats })),
	setSelectedSeatType: (seatType) =>
		set(() => ({ selectedSeatType: seatType })),
	setIsDrawing: (isDrawing) => set(() => ({ isDrawing })),

	updateSeat: (row, col) => {
		set((state) => {
			if (!state.selectedSeatType) return state;

			const seatIndex = state.seats.findIndex(
				(seat) => seat.row === row && seat.col === col,
			);

			const newSeats = [...state.seats];

			if (seatIndex !== -1) {
				// Update existing seat
				newSeats[seatIndex] = {
					...newSeats[seatIndex],
					type: state.selectedSeatType,
				};
			} else {
				// Add new seat
				const newSeat: ISeat = {
					id: `${row}-${col}`,
					row,
					col,
					type: state.selectedSeatType,
				};
				newSeats.push(newSeat);
			}

			return {
				seats: newSeats,
			};
		});
	},

	handleSeatInteraction: (row, col) => {
		const { mode, getSeat, updateSeat, selectedSeatType } = get();

		const seat = getSeat(row, col);

		switch (mode) {
			case "normal":
				if (seat) {
					alert(`Seat ${seat} selected`);
				}
				break;
			case "grep":
				break;
			case "edit":
				if (selectedSeatType) {
					updateSeat(row, col);
				}

				break;
			default:
				break;
		}
	},
}));

document.addEventListener("mouseup", () =>
	useSeatMapStore.getState().setIsDrawing(false),
);
