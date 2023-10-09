import React, {useState} from "react";
import ReactDOM from 'react-dom/client';
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

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
