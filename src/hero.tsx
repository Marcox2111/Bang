import React from "react";
import {Card} from "./card";


export function Hero() {
    return (


        <div className="h-screen flex flex-col justify-center items-center bg-gray-400">
            <Card itemId={"Role"} title={"Role"}/>
            <Card itemId={"Char"} title={"Char"}/>
        </div>


    );
}