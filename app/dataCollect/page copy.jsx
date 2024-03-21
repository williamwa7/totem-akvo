'use client'
import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link.js";

import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import SliderCarousel from "../components/SliderCarousel";
import { useEffect } from "react";
import baseUrl from "@/utils/baseUrl";
import ResultPage from "./ResultPage";

export default function DataCollect() {
    // State para os valores dos inputs
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [estado, setEstado] = useState("");
    const [municipio, setMunicipio] = useState("");
    const [layout, setLayout] = useState("default");
    const [slideNumber, setSlideNumber] = useState(0);
    const [disableNext, setDisableNext] = useState(false);
    const [disablePrev, setDisablePrev] = useState(true);
    const [focusedInput, setFocusedInput] = useState("");
    const [loadResults, setLoadResults] = useState(false);
    const keyboard = useRef();


    useEffect(() => {
        if (slideNumber === 0) {
            setDisablePrev(true);
            setDisableNext(false);
        } else if (slideNumber === 1) {
            setDisablePrev(false);
            if (!name || !email) {
                setDisableNext(true);
            } else {
                setDisableNext(false);
            }
        } else if (slideNumber === 3) {
            setDisableNext(true);
        } else {
            setDisablePrev(false);
            setDisableNext(false);
        }
    }, [slideNumber, name, email]);

    const handleChangeSlide = (action) => {
        if (action === "+") {
            setSlideNumber(slideNumber + 1);
        } else {
            setSlideNumber(slideNumber - 1);
        }
    }

    // Função para atualizar o valor do input focado
    const handleInputChange = (value) => {
        switch (focusedInput) {
            case "name":
                setName(value);
                break;
            case "email":
                setEmail(value);
                break;
            case "municipio":
                setMunicipio(value);
                break;
            default:
                break;
        }
    };

    const handleFocus = (inputId) => {
        setFocusedInput(inputId);
    };

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
        // Remove o último caractere do valor do input focado
        let newValue = focusedInput === "name" ? name.slice(0, -1) :
            focusedInput === "email" ? email.slice(0, -1) :
                focusedInput === "municipio" ? municipio.slice(0, -1) : "";
        handleInputChange(newValue);
    };

    const handleSpace = () => {
        // Adiciona um espaço em branco ao valor do input focado
        let newSpaceValue = focusedInput === "name" ? name + " " :
            focusedInput === "email" ? email + " " :
                focusedInput === "municipio" ? municipio + " " : "";
        handleInputChange(newSpaceValue);
    };

    const handleCharInput = (char) => {
        // Adiciona o caractere ao valor do input focado
        let newValueWithChar = (focusedInput === "name" ? name :
            focusedInput === "email" ? email :
                focusedInput === "municipio" ? municipio : "") + char;
        handleInputChange(newValueWithChar);
    };

    const VirtualKeyboard = () => {
        return (
            <div className="row justify-content-center">
                <div className="virtualKeyboardContainer">
                    <div className="VirtualKeyboard">
                        <Keyboard
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
                                    'A S D F G H J K L : " ',
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
        )
    }

    const handleSubmitForm = async () => {
        const newId = new Date().getTime();
        setId(newId); // Passar o valor do id para setId

        const formData = {
            id: newId,
            name: name,
            email: email,
            origem: municipio + ', ' + estado,
            destino: 'R. Henrique Belotto - Vila Jardim, Gramado - RS, 95677-052'
        };

        try {
            const response = await fetch(`/api/submitForm`, {
                method: 'POST',
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            console.log('Response:', data);


            alert('Dados enviados com sucesso!');
            // Resetar dados do formulário após o envio bem-sucedido
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao enviar os dados. Por favor, tente novamente mais tarde.');
        }
        setTimeout(() => {

            handleChangeSlide("+");
            setLoadResults(true)
        }, 2000);
    };

    const slides = [
        {
            content:
                <section>
                    <div className="col-12 d-flex flex-column justify-content-center mt-5 align-items-center gap-5">
                        <div className="col-12 d-flex justify-content-center">
                            <img src="/assets/AKVO.png" alt="" width={500} />
                        </div>
                        <div className="col-12">
                            <h1 htmlFor="name" className="homeDataCollectTitle">
                                Bem vindo!
                            </h1>
                            <p className="homeDataCollectSubtitle">
                                Toque no botão abaixo para<br /> iniciar a coleta de dados.
                            </p>
                        </div>
                        <div className="col-12 d-flex justify-content-center">
                            <button
                                type="button"
                                className="btn btn-light fs-2 p-3 col-6"
                                onClick={() => {
                                    handleChangeSlide("+");
                                }}
                                disabled={disableNext}
                            >
                                Iniciar
                            </button>
                        </div>
                    </div>


                </section>
        },
        {
            content:
                <section>
                    <div action="">
                        <div className="row">
                            <div className="col-12">
                                <label htmlFor="name" className="form-label text-white">
                                    Nome
                                </label>
                                <input
                                    type="text"
                                    className="form-control fs-5 p-3"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onFocus={() => handleFocus("name")}
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                        {
                            focusedInput === "name" ? VirtualKeyboard() : null
                        }

                        <div className="row mt-3">
                            <div className="col-12">
                                <label htmlFor="email" className="form-label text-white">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="form-control fs-5 p-3"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => handleFocus("email")}
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                        {
                            focusedInput === "email" ? VirtualKeyboard() : null
                        }
                    </div>

                    <div className="row mt-5">
                        <div className="col-12 d-flex justify-content-between">
                            {slideNumber !== 0 && (
                                <button
                                    type="button"
                                    className="btn btn-light fs-5 p-3"
                                    onClick={() => {
                                        handleChangeSlide("-");
                                    }}
                                    disabled={disablePrev}
                                >Voltar</button>
                            )}

                            <button
                                type="button"
                                className="btn btn-light fs-5 p-3"
                                onClick={() => {
                                    handleChangeSlide("+");
                                }}
                                disabled={disableNext}
                            >
                                Próximo
                            </button>
                        </div>
                    </div>
                </section>

        },
        {
            content:
                <section>
                    <div action="">
                        <div className="row">
                            <div className="col-12 d-flex">

                                <div className="col-4 pe-3">
                                    <label htmlFor="estado" className="form-label text-white">
                                        Estado
                                    </label>
                                    <select className="form-select fs-5 p-3" name="estado" id="estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
                                        <option value="">Selecione</option>
                                        <option value="AC">Acre</option>
                                        <option value="AL">Alagoas</option>
                                        <option value="AP">Amapá</option>
                                        <option value="AM">Amazonas</option>
                                        <option value="BA">Bahia</option>
                                        <option value="CE">Ceará</option>
                                        <option value="DF">Distrito Federal</option>
                                        <option value="ES">Espírito Santo</option>
                                        <option value="GO">Goiás</option>
                                        <option value="MA">Maranhão</option>
                                        <option value="MT">Mato Grosso</option>
                                        <option value="MS">Mato Grosso do Sul</option>
                                        <option value="MG">Minas Gerais</option>
                                        <option value="PA">Pará</option>
                                        <option value="PB">Paraíba</option>
                                        <option value="PR">Paraná</option>
                                        <option value="PE">Pernambuco</option>
                                        <option value="PI">Piaú</option>
                                        <option value="RJ">Rio de Janeiro</option>
                                        <option value="RN">Rio Grande do Norte</option>
                                        <option value="RS">Rio Grande do Sul</option>
                                        <option value="RO">Rondônia</option>
                                        <option value="RR">Roraima</option>
                                        <option value="SC">Santa Catarina</option>
                                        <option value="SP">São Paulo</option>
                                        <option value="SE">Sergipe</option>
                                        <option value="TO">Tocantins</option>
                                        <option value="EX">Estrangeiro</option>
                                    </select>
                                </div>
                                <div className="col-8 ps-3">
                                    <label htmlFor="cidade" className="form-label text-white">Cidade</label>
                                    <input
                                        type="text"
                                        className="form-control fs-5 p-3"
                                        id="cidade"
                                        value={municipio}
                                        onChange={(e) => setMunicipio(e.target.value)}
                                        onFocus={() => handleFocus("municipio")}
                                        autoComplete="off"
                                        placeholder="Cidade"
                                    />

                                </div>
                            </div>
                        </div>
                        {
                            focusedInput === "municipio" ? VirtualKeyboard() : null
                        }
                    </div>

                    <div className="row mt-5">
                        <div className="col-12 d-flex justify-content-between">
                            {slideNumber !== 0 && (
                                <button
                                    type="button"
                                    className="btn btn-light fs-5 p-3"
                                    onClick={() => {
                                        handleChangeSlide("-");
                                    }}
                                    disabled={disablePrev}
                                >Voltar</button>
                            )}

                            <button
                                type="button"
                                className="btn btn-light fs-5 p-3"
                                onClick={() => {
                                    handleChangeSlide("+");
                                }}
                                disabled={disableNext}
                            >
                                Próximo
                            </button>
                        </div>
                    </div>
                </section>
        },
        {
            content:
                <section>
                    <div className="col-12 d-flex flex-column justify-content-center mt-5 align-items-center gap-5">
                        <div className="col-12 d-flex justify-content-center">
                            <img src="/assets/AKVO.png" alt="" width={500} />
                        </div>
                        <div className="col-12">
                            <h1 htmlFor="name" className="homeDataCollectTitle">
                                Tudo Certo!
                            </h1>
                            <p className="homeDataCollectSubtitle">
                                Toque no botão abaixo para calcular as emissões de CO₂ <br />referentes ao seu deslocamento até o evento.
                            </p>
                        </div>
                        <div className="col-12 d-flex justify-content-center">
                            <button
                                type="button"
                                className="btn btn-light fs-2 p-3 col-6"
                                onClick={() => {
                                    handleSubmitForm();
                                }}
                            >
                                Calcular
                            </button>
                        </div>
                    </div>
                </section>
        },
        {
            content: <>
                {loadResults ? <ResultPage id={id} /> : null}
            </>
        }
    ];

    return (
        <div className="backgroundAkvo">
            <Link href="/" >
                <FontAwesomeIcon icon={faHome} className="homeButton" />
            </Link>
            <div className="row justify-content-center">
                <div className="row justify-content-center pages align-items-center">
                    <div className="pageContent d-flex flex-column justify-content-center">
                        <SliderCarousel slides={slides} slideNumber={slideNumber} />
                    </div>
                </div>
            </div>
        </div>
    );
}
