import React, {useEffect, useState} from "react";
import character from '../cards/bang_cards/character/character.json';
import Select from "react-select";

type Item = {
    id: string;
    name: string;
}

// Define the props that PlayerForm component expects to receive
type PlayerFormProps = {
    index: number;
    // onPlayerDataChange is a function prop that will be used to inform the parent component
    // about changes in playerName or playerCharacter.
    onPlayerDataChange: (index: number, data: { name: string, character: string }) => void;
};


export function PlayerForm({index, onPlayerDataChange}: PlayerFormProps) {

    const initialImage = require(`../cards/bang_cards/character/${character[Math.floor(Math.random() * character.length)].value}.png`);
    const [currentImage, setCurrentImage] = useState(initialImage);
    // playerName and playerCharacter are local states holding the input values of the form.
    const [playerName, setPlayerName] = useState<string>(''); // State for the player's name
    const [playerCharacter, setPlayerCharacter] = useState<string>(''); // State for the player's character

    // useEffect hook that will be triggered every time playerName or playerCharacter changes.
    useEffect(() => {
        // When playerName or playerCharacter changes, this effect will run and call the
        // onPlayerDataChange function prop, passing the current playerName and playerCharacter as an argument.
        // This informs the parent component of the changes to playerName and playerCharacter.
        onPlayerDataChange(index, {name: playerName, character: playerCharacter});
    }, [playerName, playerCharacter]); // Dependency array: effect runs when values in this array change


    const handleOnSearch = (string, results) => {
    }

    const handleOnHover = (result) => {
        try {
            const image = require(`../cards/bang_cards/character/${result}.png`);
            setCurrentImage(image);
        } catch (error) {
            setCurrentImage(initialImage);
        }
    }

    const handleOnSelect = (item) => {
        try {
            const image = require(`../cards/bang_cards/character/${item.id}.png`);
            setCurrentImage(image);
        } catch (error) {
            setCurrentImage(initialImage); // or set to a default image
        }
        setPlayerCharacter(item);
    }

    const CustomOption = ({innerProps, data, label}) => (
        <div {...innerProps} onMouseEnter={() => handleOnHover(data.value)}>
            {label}
        </div>
    );


    return (
        <div
            className="flex flex-row items-center justify-between p-4 m-4 sm:space-y-4 space-x-4 bg-white border rounded-lg sm:space-x-0 sm:flex-col">
            <div
                className="w-32 h-32 sm:w-52 border-2 border-amber-500 sm:h-auto sm:rounded-none sm:border-0 rounded-full overflow-hidden">
                {currentImage && <img src={currentImage} alt="Character" className="w-full h-full object-cover"/>}
            </div>
            <div className="flex flex-col flex-1 space-y-4 m-4">
                <input
                    autoComplete="nope"
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full"
                    type="text" placeholder="Name"
                />

                <Select
                    className="react-select-container"
                    classNamePrefix={"react-select"}
                    unstyled={true}
                    components={{
                        DropdownIndicator: () => null,
                        IndicatorSeparator: () => null,
                        Option: CustomOption,
                    }}
                    options={character}
                />

            </div>
        </div>
    );
}