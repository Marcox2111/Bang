import React from "react";
import ReactDOM from "react-dom";

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

ReactDOM.render(<App/>, document.getElementById("root"));
