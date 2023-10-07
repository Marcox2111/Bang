import React, {useState} from "react";
import { createRoot } from 'react-dom/client';
import {GameProvider} from "./context/Context";
import "./styles/globalStyles.css";
import {AddPlayer} from "./components/AddPlayer";
import {Game} from "./components/Game";

function App() {
    const [isPlayerAdded, setIsPlayerAdded] = useState(false);

    return (
        <GameProvider>
            <main>
                {isPlayerAdded ? <Game /> : <AddPlayer setIsPlayerAdded={setIsPlayerAdded} />}
            </main>
        </GameProvider>
    );
}

export default App;
const domNode = document.getElementById("root");
const root = createRoot(domNode);
root.render(<App />);
