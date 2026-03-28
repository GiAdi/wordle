import "./App.css";
import { Wordle } from "./Wordle/Wordle";

function App() {
	return (
		<>
			<Wordle word="LEVEL" attempts={6} /> 
		</>
	);
}

export default App;
