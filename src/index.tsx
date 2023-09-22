import React from "react";
import ReactDOM from "react-dom";

import {List} from "./list";
import {Sidebar} from "./sidebar";
import {Hero} from "./hero";
import {GameProvider} from "./context"
import "./globalStyles.css";

function App() {

    return (
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
    );
}

export default App;

ReactDOM.render(<App/>, document.getElementById("root"));
