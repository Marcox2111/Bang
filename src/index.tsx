import React from "react";
import ReactDOM from "react-dom";

import {List} from "./components/list";
import {Sidebar} from "./components/sidebar";
import {Hero} from "./components/hero";
import {GameProvider} from "./context/context";
import "./styles/globalStyles.css";

function App() {
    return (
        <React.StrictMode>
            <GameProvider>
                <main>
                    <div className="grid grid-cols-4  justify-between items-center ">
                        <Sidebar/>
                        <div className="col-span-2 flex flex-col h-screen justify-center  bg-gray-500">
                            <List type={"Ground"}/>
                            <List type={"Hand"}/>
                        </div>
                        <Hero/>
                    </div>
                </main>
            </GameProvider>
        </React.StrictMode>
    );
}

ReactDOM.render(<App/>, document.getElementById("root"));
