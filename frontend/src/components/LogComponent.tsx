import React, {useEffect, useRef, useState} from 'react';
import {motion, useAnimation} from 'framer-motion';

type LogComponentProps = {
    divWidth: number;
};
export function LogComponent({divWidth}: LogComponentProps) {
    const controls = useAnimation(); // initialize the animation controls
    const [logWidth, setLogWidth] = useState(0);

    // Reference to the log message
    const logRef = useRef(null);

    useEffect(() => {
        console.log(logRef.current.offsetWidth)
        // Calculate the width of the log message and the container
        if (logRef.current && divWidth) {
            setLogWidth(logRef.current.offsetWidth);
        }

        // Start the animation if the log is wider than the container
        if (logWidth > divWidth) {
            controls.start({ // start the animation
                x: -logWidth,
                transition: {duration: 5, repeat: 2, ease: "linear"}
            });
        }
    }, [controls, logWidth, divWidth]);

    return (
            <motion.div ref={logRef} animate={controls} className="justify-start w-full whitespace-nowrap">
                BANG! to Marco from Marco for 1 damage in Real Life (1 HP left)
            </motion.div>
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
