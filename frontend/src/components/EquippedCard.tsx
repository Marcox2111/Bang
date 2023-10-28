import React from "react";

export function EquippedCard() {
    const [open, setOpen] = React.useState(false);
    return (
        <div className="z-50 flex w-full h-full items-center justify-center"
            onClick={() => {
            setOpen(!open)
        }}>
            Open
        </div>
    )
}
