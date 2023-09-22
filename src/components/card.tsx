import React from "react";

export function Card({
    itemId,
    title
}: {
    itemId: string;
    title: string;
}) {
    return (
        <button
            className="inline-block px-4 py-8 cursor-pointer select-none"
        >
            <div
                className="w-64 h-64 max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-lg hover:scale-105 transition  duration-300 ease-in-out">
                <div className="p-4">
                    <div className="font-bold">{title}</div>
                </div>
            </div>
        </button>
    );
}
