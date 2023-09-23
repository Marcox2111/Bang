import React from "react";
import { createRoot } from 'react-dom/client';

import {Sidebar} from "./components/sidebar";
import {GameProvider} from "./context/context";
import {PlayerContainer} from "./components/playerContainer";
import "./styles/globalStyles.css";

function App() {
    return (
        <GameProvider>
            <main>
                <div className="grid grid-cols-4  justify-between items-center ">
                    <Sidebar/>
                    <div className="col-span-3 flex flex-col h-screen justify-center  bg-gray-500">
                        <PlayerContainer/>
                    </div>
                </div>
            </main>
        </GameProvider>
    );
}

const domNode = document.getElementById("root");
const root = createRoot(domNode);
root.render(<App />);
