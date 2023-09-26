import React from "react";

export function Card({cardID, cardName}) {
    return (
        <button className="inline-block px-4 py-8 cursor-pointer select-none">
            <div className="w-64 h-64 max-w-xs rounded-lg shadow-md bg-white">
                <div className="p-4">
                    <div className="font-bold">{cardName}</div>
                </div>
            </div>
        </button>
    );
}
