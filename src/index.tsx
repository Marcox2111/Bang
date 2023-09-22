import React, {useState} from "react";
import ReactDOM from "react-dom";

import {List} from "./list";
import {Sidebar} from "./sidebar";
import {Hero} from "./hero";
import { GlobalIdProvider } from './context';
import "./globalStyles.css";

function App() {

    return (
        <GlobalIdProvider>
            <main>
                <div className="grid grid-cols-4  justify-between items-center ">
                    <Sidebar/>
                    <div className="col-span-2 flex flex-col h-screen justify-center  bg-gray-500">
                        <List key={"Ground"}/>
                        <List key={"Hand"}/>
                    </div>
                    <Hero/>
                </div>
            </main>
        </GlobalIdProvider>
    );
}

export default App;

ReactDOM.render(<App/>, document.getElementById("root"));
