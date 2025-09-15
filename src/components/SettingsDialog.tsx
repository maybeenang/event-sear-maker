import { useSeatMapStore } from "@/store/useSeatMap";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Minus, Plus, Trash } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SettingsDialog = () => {
	const { settingDialogOpen, setSettingDialogOpen } = useSeatMapStore();

	return (
		<Dialog
			open={settingDialogOpen}
			onOpenChange={() => setSettingDialogOpen(false)}
		>
			<DialogContent className="max-w-[425px] md:max-w-2xl max-h-[90vh]">
				<DialogHeader>
					<DialogTitle>Settings</DialogTitle>
				</DialogHeader>
				<Separator />
				<Tabs
					defaultValue="layout"
					className="p-2 max-h-[calc(90vh-100px)] overflow-y-auto"
				>
					<TabsList>
						<TabsTrigger value="layout">Layout</TabsTrigger>
						<TabsTrigger value="tickets">Tickets</TabsTrigger>
					</TabsList>
					<TabsContent value="layout">
						<LayoutSettings />
					</TabsContent>
					<TabsContent value="tickets">
						<TicketSettings />
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
};

const LayoutSettings = () => {
	const { rows, setRows, cols, setCols } = useSeatMapStore();

	return (
		<div className="space-y-4 mt-4">
			{/* Rows */}
			<section className="flex gap-2 border border-grey-200 rounded-md p-4 justify-between flex-col md:flex-row">
				<Label>Rows</Label>
				<div className="flex items-center gap-2">
					<Button
						type="button"
						size="icon"
						onClick={() => setRows(Math.max(1, rows - 1))}
					>
						<Minus className="size-3" />
					</Button>
					<Input
						name="row"
						type="number"
						className="w-16 text-center"
						min={1}
						value={rows}
						onChange={(e) => setRows(Number(e.target.value))}
					/>

					<Button type="button" size="icon" onClick={() => setRows(rows + 1)}>
						<Plus className="size-3" />
					</Button>
				</div>
			</section>

			{/* Columns */}
			<section className="flex gap-2 border border-grey-200 rounded-md p-4 justify-between flex-col md:flex-row">
				<Label>Columns</Label>
				<div className="flex items-center gap-2">
					<Button
						type="button"
						size="icon"
						onClick={() => setCols(Math.max(1, cols - 1))}
					>
						<Minus className="size-3" />
					</Button>
					<Input
						name="col"
						type="number"
						className="w-16 text-center"
						min={1}
						value={cols}
						onChange={(e) => setCols(Number(e.target.value))}
					/>

					<Button type="button" size="icon" onClick={() => setCols(cols + 1)}>
						<Plus className="size-3" />
					</Button>
				</div>
			</section>
		</div>
	);
};

const TicketSettings = () => {
	const { ticketTypes, setTicketTypes } = useSeatMapStore();

	const handleSubmitEdit = (e: React.FormEvent, index: number) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const name = formData.get("name") as string;
		const color = formData.get("color") as string;

		const newTypes = ticketTypes.map((type, i) =>
			i === index ? { ...type, name, color } : type,
		);
		setTicketTypes(newTypes);
	};

	if (ticketTypes.length === 0) {
		return (
			<div className="mt-4 text-center text-sm text-gray-500">
				No ticket types available. Please add ticket types to manage them here.
			</div>
		);
	}

	return (
		<div className="space-y-4 mt-4">
			{ticketTypes.map((type, index) => (
				<form
					key={type.id}
					onSubmit={(e) => handleSubmitEdit(e, index)}
					className="flex md:items-center gap-2 border border-grey-200 rounded-md p-4 justify-between flex-col md:flex-row"
				>
					<div>
						<Label>Type {index + 1}</Label>
					</div>
					<Input
						placeholder="Ticket Type Name"
						defaultValue={type.name}
						name="name"
					/>
					{/* color */}
					<Input
						type="color"
						defaultValue={type.color}
						name="color"
						className="w-12 h-10 p-0 border-0"
					/>

					<Button
						className="self-start md:self-center mt-2 md:mt-0"
						type="submit"
					>
						Save
					</Button>

					<Button
						variant="destructive"
						type="button"
						className="self-start md:self-center mt-2 md:mt-0"
						onClick={() => {
							const newTypes = ticketTypes.filter((_, i) => i !== index);
							setTicketTypes(newTypes);
						}}
					>
						<Trash />
					</Button>
				</form>
			))}
		</div>
	);
};

export default SettingsDialog;
