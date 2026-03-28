import "./App.css";
import { Wordle } from "./Wordle/Wordle";
import { SpeedInsights } from "@vercel/speed-insights/next";

function App() {
	return (
		<>
			<Wordle word="LEVEL" attempts={6} /> 
      <SpeedInsights />
		</>
	);
}

export default App;
