import React from "react";

type CharProps = {
    role: string;
    setRoleAndChar: React.Dispatch<React.SetStateAction<boolean>>;
};

export function CharChoice({role,setRoleAndChar}: CharProps) {
    let image;
    try {
        image = require(`../cards/bang_cards/role/${role}.png`);
    } catch (err) {
        console.error(err);
        image = require('../cards/bang_cards/role/sceriffo.png'); // Fallback to a default image
    }

    return (
        <div onClick={() => setRoleAndChar(false)}
             className="flex align-middle items-center justify-center w-full h-full">
            <div
                className="flex justify-center items-center pointer-events-none">
                {image && <img src={image} alt="Character" className={""}/>}
            </div>
        </div>
    )
}