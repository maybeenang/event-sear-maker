import { create } from "zustand";

export interface ISeat {
	id: string;
	row: number;
	col: number;
	type?: ISeatType;
	ticketType?: ISeatTicketType;
}

export interface ISeatType {
	id: string;
	name: string;
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
	seats: { [id: string]: ISeat }; // OPTIMIZED: Changed from ISeat[] to an object for O(1) access
	mode: "normal" | "grep" | "edit";

	seatTypes: ISeatType[];
	ticketTypes: ISeatTicketType[];

	selectedSeatType?: ISeatType;
	selectedTicketType?: ISeatTicketType;

	isDrawing: boolean;
	showMinimap: boolean;

	settingDialogOpen: boolean;
	setSettingDialogOpen: (open: boolean) => void;

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
	setSeats: (seats: { [id: string]: ISeat }) => void; // OPTIMIZED: Expects an object
	setSelectedSeatType: (seatType: ISeatType) => void;
	setSeatTypes: (seatTypes: ISeatType[]) => void;
	setIsDrawing: (isDrawing: boolean) => void;
	setTicketTypes: (ticketTypes: ISeatTicketType[]) => void;
	setSelectedTicketType: (ticketType: ISeatTicketType) => void;

	// complex actions can be added here
	updateSeat: (row: number, col: number) => void;
	updateSeatsGrid: () => void;

	handleSeatInteraction: (row: number, col: number) => void;
}

export const BRICK_SEAT_TYPE: ISeatType = {
	id: "brick",
	name: "Brick",
};

export const TICKET_SEAT_TYPE: ISeatType = {
	id: "ticket",
	name: "Seat",
};

export const useSeatMapStore = create<SeatMapState>((set, get) => ({
	// initial state
	rows: 10,
	cols: 26,
	seats: {}, // OPTIMIZED: Initial state is an empty object
	mode: "normal",
	showMinimap: false,
	seatTypes: [
		TICKET_SEAT_TYPE,
		BRICK_SEAT_TYPE,
		{ id: "none", name: "None", color: "gray", label: "N" },
	],
	ticketTypes: [
		{ id: "regular", name: "Regular", label: "R", color: "#03dbfc" },
		{ id: "vip", name: "VIP", label: "V", color: "#fca503" },
	],
	isDrawing: false,

	selectedSeatType: undefined,
	selectedTicketType: undefined,

	settingDialogOpen: false,

	getSeat: (row, col) => {
		const seatId = `${row}-${col}`;
		return get().seats[seatId]; // OPTIMIZED: Direct object access is much faster
	},

	getSeats: () => {
		return Object.values(get().seats); // OPTIMIZED: Convert object values to array
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
	setTicketTypes: (ticketTypes) => {
		set(() => ({ ticketTypes: ticketTypes }));

		// sinkronasi seat yang memiliki ticketype
		set((state) => {
			const newSeats = { ...state.seats };
			Object.values(newSeats).forEach((seat) => {
				if (seat.type?.id === "ticket") {
					if (
						!ticketTypes.find(
							(ticketType) => ticketType.id === seat.ticketType?.id,
						)
					) {
						seat.ticketType = undefined;
					} else {
						seat.ticketType =
							ticketTypes.find(
								(ticketType) => ticketType.id === seat.ticketType?.id,
							) || undefined;
					}
				}
			});
			return { seats: newSeats };
		});
	},
	setSelectedTicketType: (ticketType) =>
		set(() => ({ selectedTicketType: ticketType })),

	setRows: (rows) => {
		set(() => ({ rows }));
		get().updateSeatsGrid();
	},
	setCols: (cols) => {
		set(() => ({ cols }));
		get().updateSeatsGrid();
	},
	setMode: (mode) => {
		if (mode === "edit") {
			const { selectedSeatType, setSelectedSeatType, seatTypes } = get();
			if (!selectedSeatType) {
				setSelectedSeatType(seatTypes[0]);
			}
		}
		set(() => ({ mode }));
	},
	setShowMinimap: (show) => set(() => ({ showMinimap: show })),
	setSeats: (seats) => set(() => ({ seats })),
	setSelectedSeatType: (seatType) => {
		if (seatType.id === "ticket") {
			const { selectedTicketType, setSelectedTicketType, ticketTypes } = get();
			if (!selectedTicketType) {
				setSelectedTicketType(ticketTypes[0]);
			}
		}
		set(() => ({ selectedSeatType: seatType }));
	},

	setIsDrawing: (isDrawing) => set(() => ({ isDrawing })),

	setSettingDialogOpen: (open) => set(() => ({ settingDialogOpen: open })),

	updateSeat: (row, col) => {
		set((state) => {
			if (!state.selectedSeatType) return state;

			const seatId = `${row}-${col}`;
			const newSeats = { ...state.seats };

			// OPTIMIZED: More efficient update/delete logic
			if (state.selectedSeatType.id === "none") {
				newSeats[seatId] = {
					id: seatId,
					row,
					col,
					type: undefined,
				};

				return { seats: newSeats };
			} else if (newSeats[seatId]) {
				// check jika seat type nya sama, kalo sama return state
				if (newSeats[seatId]?.type?.id === state.selectedSeatType.id) {
					return state;
				}

				// check jika seat typenya adalah brick dan selectedseattype nya ticket
				if (
					newSeats[seatId]?.type?.id === "brick" &&
					state.selectedSeatType.id === "ticket"
				) {
					return state;
				}

				// Update existing seat
				newSeats[seatId] = {
					...newSeats[seatId],
					type: state.selectedSeatType,
					ticketType:
						state.selectedSeatType.id === "ticket"
							? state.selectedTicketType
							: undefined,
				};
			} else {
				// Add new seat
				const newSeat: ISeat = {
					id: seatId,
					row,
					col,
					type: state.selectedSeatType,
					ticketType:
						state.selectedSeatType.id === "ticket"
							? state.selectedTicketType
							: undefined,
				};
				newSeats[seatId] = newSeat;
			}

			return { seats: newSeats };
		});
	},

	updateSeatsGrid: () => {
		const { rows, cols } = get();

		set((state) => {
			const newSeats: Record<string, ISeat> = {};

			for (let r = 0; r < rows; r++) {
				for (let c = 0; c < cols; c++) {
					const seatId = `${r}-${c}`;

					const existingSeat = state.seats[seatId];

					newSeats[seatId] = existingSeat || {
						id: seatId,
						row: r,
						col: c,
						type: null,
					};
				}
			}

			return { seats: newSeats };
		});
	},

	handleSeatInteraction: (row, col) => {
		const { mode, getSeat, updateSeat, selectedSeatType } = get();
		const seat = getSeat(row, col);

		switch (mode) {
			case "normal":
				if (seat) {
					alert(`Seat ${seat.id} selected`);
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

useSeatMapStore.getState().updateSeatsGrid();

document.addEventListener("mouseup", () =>
	useSeatMapStore.getState().setIsDrawing(false),
);
