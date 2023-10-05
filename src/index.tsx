import React from "react";
import { createRoot } from 'react-dom/client';
import {GameProvider} from "./context/Context";
import "./styles/globalStyles.css";
import Layout from "./components/Layout";
import {PlayerContainer} from "./components/playerContainer";
import {AddPlayer} from "./components/AddPlayer";

function App() {

    return (
        <GameProvider>
            <main>
                <AddPlayer />
            </main>
        </GameProvider>
    );
}

export default App;
const domNode = document.getElementById("root");
const root = createRoot(domNode);
root.render(<App />);
