import { create } from "zustand";

export interface ISeat {
	id: string;
	row: number;
	col: number;
	type: ISeatType;
	ticketType?: ISeatTicketType;
}

export interface ISeatType {
	id: string;
	name: string;
	color: string;
	label: string;
}

export interface ISeatTicketType {
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
	ticketTypes: ISeatTicketType[];

	selectedSeatType?: ISeatType;
	selectedTicketType?: ISeatTicketType;

	isDrawing: boolean;
	showMinimap: boolean;

	// getter
	getSeat: (row: number, col: number) => ISeat | undefined;
	getSeats: () => ISeat[];
	getSeatTypes: () => ISeatType[];
	getTicketTypes: () => ISeatTicketType[];
	getSelectedTicketType: () => ISeatTicketType | undefined;

	// actions
	setRows: (rows: number) => void;
	setCols: (cols: number) => void;
	setMode: (mode: "normal" | "grep" | "edit") => void;
	setShowMinimap: (show: boolean) => void;
	setSeats: (seats: ISeat[]) => void;
	setSelectedSeatType: (seatType: ISeatType) => void;
	setSeatTypes: (seatTypes: ISeatType[]) => void;
	setIsDrawing: (isDrawing: boolean) => void;
	setTicketTypes: (ticketTypes: ISeatTicketType[]) => void;
	setSelectedTicketType: (ticketType: ISeatTicketType) => void;

	updateSeat: (row: number, col: number) => void;

	// complex actions can be added here
	handleSeatInteraction: (row: number, col: number) => void;
}

export const useSeatMapStore = create<SeatMapState>((set, get) => ({
	// initial state
	rows: 10,
	cols: 50,
	seats: [],
	mode: "edit",
	showMinimap: false,
	seatTypes: [
		{ id: "ticket", name: "Seat", color: "green", label: "T" },
		{ id: "brick", name: "Brick", color: "gray", label: "B" },
		{ id: "none", name: "None", color: "gray", label: "N" },
	],
	ticketTypes: [
		{ id: "regular", name: "Regular", color: "blue", label: "R" },
		{ id: "vip", name: "VIP", color: "gold", label: "V" },
	],
	isDrawing: false,

	selectedSeatType: undefined,
	selectedTicketType: undefined,

	getSeat: (row, col) => {
		return get().seats.find((seat) => seat.row === row && seat.col === col);
	},

	getSeats: () => {
		return get().seats;
	},

	getSeatTypes: () => {
		return get().seatTypes;
	},

	getTicketTypes: () => {
		return get().ticketTypes;
	},

	getSelectedTicketType: () => {
		return get().selectedTicketType;
	},

	// actions
	setSeatTypes: (seatTypes) => set(() => ({ seatTypes })),
	setTicketTypes: (ticketTypes) => set(() => ({ ticketTypes })),
	setSelectedTicketType: (ticketType) =>
		set(() => ({ selectedTicketType: ticketType })),

	setRows: (rows) => set(() => ({ rows })),
	setCols: (cols) => set(() => ({ cols })),
	setMode: (mode) => {
		// check if mode is edit
		if (mode === "edit") {
			const { selectedSeatType, setSelectedSeatType, seatTypes } = get();

			if (!selectedSeatType) {
				// set selectedSeatType to first seatType
				setSelectedSeatType(seatTypes[0]);
			}
		}

		set(() => ({ mode }));
	},
	setShowMinimap: (show) => set(() => ({ showMinimap: show })),
	setSeats: (seats) => set(() => ({ seats })),
	setSelectedSeatType: (seatType) => {
		// check apakah seatType adalah ticket
		if (seatType.id === "ticket") {
			const { selectedTicketType, setSelectedTicketType, ticketTypes } = get();

			if (!selectedTicketType) {
				// set selectedTicketType ke ticketTypes pertama
				setSelectedTicketType(ticketTypes[0]);
			}
		}

		set(() => ({ selectedSeatType: seatType }));
	},

	setIsDrawing: (isDrawing) => set(() => ({ isDrawing })),

	updateSeat: (row, col) => {
		set((state) => {
			if (!state.selectedSeatType) return state;

			const seatIndex = state.seats.findIndex(
				(seat) => seat.row === row && seat.col === col,
			);

			const newSeats = [...state.seats];

			// check apakah selectedSeatType id adalah "none"
			if (state.selectedSeatType.id === "none") {
				// jika iya, hapus seat jika ada
				if (seatIndex !== -1) {
					newSeats.splice(seatIndex, 1);
				}
				return {
					seats: newSeats,
				};
			}

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
