'use client';
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { useEffect, useState, useRef } from "react";

export default function VirtualKeyboard(props) {
    const { focusedInput, handleFocus, handleInputChange, inputText} = props
    const keyboard = useRef();
    const [layout, setLayout] = useState("default");
    const [inputValue, setInputValue] = useState('');
    console.log('inputValue', inputValue);
    console.log('focusedInput', focusedInput);
    console.log('inputText', inputText);
    console.log('layout', layout);

    useEffect(() => {
        setInputValue(inputText);
    }, [focusedInput]);

    const handleShift = (button) => {
        if (button === "shift") {
            setLayout(layout === "default" ? "shift" : "default");
        } else {
            setLayout(layout === "default" ? "lock" : "default");
        }
    };

    const handleKeyPress = (button) => {
        if (!focusedInput) return;

        switch (button) {
            case "{bksp}":
                handleBackspace();
                break;
            case "{enter}":
                handleFocus("");
                // enterAction();
                break;
            case "{shift}":
                handleShift("shift");
                break;
            case "{lock}":
                handleShift("lock");
                break;
            case "{space}":
                handleSpace();
                break;
            default:
                handleCharInput(button);
                break;
        }
    };

    const handleBackspace = () => {
        let newValue = inputValue.slice(0, -1);
        setInputValue(newValue);
        handleInputChange(newValue);
    };

    const handleSpace = () => {
        let newSpaceValue = inputValue + " ";
        setInputValue(newSpaceValue);
        handleInputChange(newSpaceValue);
    };

    const handleCharInput = (char) => {
        let newValueWithChar = inputValue + char;
        setInputValue(newValueWithChar);
        handleInputChange(newValueWithChar);
    };

    return (
        < >
            <div className="row justify-content-center">
                <div className="virtualKeyboardContainer">
                    <div className="">
                        <Keyboard
                            className="VirtualKeyboard"
                            keyboardRef={(r) => (keyboard.current = r)}
                            layoutName={layout}
                            onChange={() => { }}
                            onKeyPress={handleKeyPress}
                            layout={{
                                'default': [
                                    '` 1 2 3 4 5 6 7 8 9 0 - =',
                                    'q w e r t y u i o p [ ] \\',
                                    'a s d f g h j k l ; \'',
                                    '{shift} z x c v b n m , . / {bksp}',
                                    '{lock} .com @ {space} {enter}'
                                ],
                                'shift': [
                                    '! @ # $ % ^ &amp; * ( ) _ +',
                                    'Q W E R T Y U I O P { } |',
                                    'A S D F G H J K L : "',
                                    '{shift} Z X C V B N M &lt; &gt; ? {bksp}',
                                    '{lock} .com @ {space} {enter}'
                                ],
                                'lock': [
                                    '` ! @ # $ % ^ &amp; * ( ) _ +',
                                    'ã á à â é è ê í ì î { } |',
                                    'ó ò ô ú ù û Ã Á À Â "',
                                    'É È Ê Í Ì Ó Ò Ô Ú Ù Û {bksp}',
                                    '{lock} .com @ {space} {enter}'
                                ]
                            }}
                            display={{
                                "{bksp}": "⌦",
                                "{enter}": "Ok",
                                "{tab}": "Tab",
                                "{lock}": layout === "default" || layout === "shift" ? "!?ã" : "abc",
                                "{shift}": layout === "shift" ? "🡇" : "🡅",
                                "{space}": " ",
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}