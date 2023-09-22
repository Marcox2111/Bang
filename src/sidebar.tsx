import React from "react";

export function Sidebar() {
    return (


        <div className="h-screen flex flex-col justify-between p-8 bg-gray-400">
            <ul className="space-y-2">
                <li>
                    <a href="#"
                       className="flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg bg-gray-100 hover:bg-green-100">
                        Player 1</a>
                </li>
                <li>
                    <a href="#"
                       className="flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg bg-gray-100 hover:bg-green-100">
                        Player 2</a>
                </li>
                <li>
                    <a href="#"
                       className="flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg bg-gray-100 hover:bg-green-100">
                        Player 3</a>
                </li>
                <li>
                    <a href="#"
                       className="flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg bg-gray-100 hover:bg-green-100">
                        Player 4</a>
                </li>
                <li>
                    <a href="#"
                       className="flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg bg-gray-100 hover:bg-green-100">
                        Player 5</a>
                </li>
            </ul>

            <a href="#"
               className="flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg hover:bg-green-100">
                Discard
            </a>
        </div>


    );
}
