import React,{useState} from "react";
import { createRoot } from 'react-dom/client';
import {Sidebar} from "./components/sidebar";
import {GameProvider} from "./context/context";
import {PlayerContainer} from "./components/playerContainer";
import {AddPlayer} from "./components/addPlayer";
import "./styles/globalStyles.css";

function App() {
    const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);

    const toggleAddPlayerModal = () => {
        setShowAddPlayerModal(prev => !prev);
    };

    return (
        <GameProvider>
            <main>
                <div className="grid grid-cols-4  justify-between items-center ">
                    <Sidebar onAddPlayerClick={toggleAddPlayerModal} />
                    <div className="col-span-3 flex flex-col h-screen justify-center  bg-gray-500">
                        <PlayerContainer />
                    </div>
                </div>
                {showAddPlayerModal && <AddPlayer onClose={toggleAddPlayerModal} />}
            </main>
        </GameProvider>
    );
}

export default App;
const domNode = document.getElementById("root");
const root = createRoot(domNode);
root.render(<App />);
