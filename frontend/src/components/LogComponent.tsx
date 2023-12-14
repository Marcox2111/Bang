import React, { useState } from 'react';
import { useGame } from "../context/Context";


export function LogComponent() {
    const { gameLogs } = useGame();
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleLogs = () => {
        setIsExpanded(!isExpanded);
    };

    const renderLogs = () => {
        if (isExpanded || gameLogs.length === 0) {
            return gameLogs.map((log, index) => (
                <div key={index} className="text-sm border-b py-1">
                    {log}
                </div>
            ));
        } else {
            const lastLog = gameLogs[gameLogs.length - 1];
            return (
                <div className="text-sm border-b py-1">
                    {lastLog}
                </div>
            );
        }
    };

    return (
        <div className="flex-col" onClick={toggleLogs} style={{ cursor: 'pointer' }}>
            {renderLogs()}
        </div>
    );
}

export default LogComponent;



// import React from 'react';
// import {LogItem} from "../../../shared/types";
//
// type LogComponentProps = {
//     logItems: LogItem[];
// };
//
// export function LogComponent() {
//     const [showHistory, setShowHistory] = React.useState(false);
//
//     const toggleHistory = () => {
//         setShowHistory(!showHistory);
//     };
//
//     return (
//         <div className="flex flex-col h-full">
//             <div className="flex h-[6%] items-center justify-between px-2">
//                 <div>
//                     {/* Display the last action */}
//                     {/*{logItems.length > 0 && `${logItems[0].action} to ${logItems[0].target} from ${logItems[0].actor} for ${logItems[0].effect} (${logItems[0].remainingHP} HP left)`}*/}
//                     BANG! to Marco from Marco for 1 damage in Real Life (1 HP left)
//                 </div>
//                 {/*<button onClick={toggleHistory}*/}
//                 {/*        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">*/}
//                 {/*    {showHistory ? 'Hide History' : 'Show History'}*/}
//                 {/*</button>*/}
//             </div>
//             {/*{showHistory && (*/}
//             {/*    <div className="overflow-y-auto">*/}
//             {/*        /!* Display the full history *!/*/}
//             {/*        {logItems.map((item, index) => (*/}
//             {/*            <div key={index} className="text-sm border-b py-1">*/}
//             {/*                {`${item.timestamp.toLocaleTimeString()}: ${item.action} to ${item.target} from ${item.actor} for ${item.effect} (${item.remainingHP} HP left)`}*/}
//             {/*            </div>*/}
//             {/*        ))}*/}
//             {/*    </div>*/}
//             {/*)}*/}
//         </div>
//     );
// };

// export default LogComponent;
