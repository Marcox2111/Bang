import React, {useState} from "react";
import ReactDOM from 'react-dom/client';
import "./styles/globalStyles.css";
import {AddPlayer} from "./components/AddPlayer";
import {Lobby} from "./components/Lobby";
import {GameProvider} from "./context/Context";
import {PAGES} from "./context/constants";
import {Game} from "./components/Game";
import {ShowCardProvider} from "./context/ShowCardContext";

function App() {
    const [currentPage, setCurrentPage] = useState(PAGES.ADD_PLAYER);

    return (
        <GameProvider>
            <ShowCardProvider>
                <main>
                    {currentPage === PAGES.ADD_PLAYER && <AddPlayer setCurrentPage={setCurrentPage}/>}
                    {currentPage === PAGES.LOBBY && <Lobby setCurrentPage={setCurrentPage}/>}
                    {currentPage === PAGES.GAME && <Game/>}
                </main>
            </ShowCardProvider>
        </GameProvider>

    );
}

export default App;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
            <App/>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
