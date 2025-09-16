import SeatMapCanvas from "./components/SeatMapCanvas";
import Toolbox from "@/components/Toolbox";
import SettingsDialog from "./components/SettingsDialog";

function App() {
	return (
		<div className="">
			<SeatMapCanvas />
			<Toolbox />
			<SettingsDialog />
		</div>
	);
}

export default App;
