import React from "react";

type CardProps = {
    role: string;
    setRoleandchar: React.Dispatch<React.SetStateAction<boolean>>;
};

export function CharChoice({role,setRoleandchar}: CardProps) {
    let image;
    try {
        image = require(`../cards/bang_cards/role/${role}.png`);
    } catch (err) {
        console.error(err);
        image = require('../cards/bang_cards/role/sceriffo.png'); // Fallback to a default image
    }

    return (
        <div onClick={() => setRoleandchar(false)}
             className="flex align-middle items-center justify-center w-full h-full">
            <div
                className="flex justify-center items-center pointer-events-none">
                {image && <img src={image} alt="Character" className={""}/>}
            </div>
        </div>
    )
}