import React, { useState } from 'react';
import { useGame } from "../context/Context";
import "../styles/LogComponent.css"

export function LogComponent() {
    const { gameLogs } = useGame();
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleLogs = () => {
        setIsExpanded(!isExpanded);
    };

    const displayedLogs = isExpanded ? gameLogs.slice(-5) : gameLogs.slice(-1);


    return (
        <div className="log-container" onClick={toggleLogs} style={{ cursor: 'pointer' }}>
            <div className={isExpanded ? "logs expanded" : "logs"}>
                {displayedLogs.map((log, index) => (
                    <div key={index} className="log-entry">
                        {log}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LogComponent;
