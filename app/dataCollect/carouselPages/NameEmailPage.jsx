// 'use client'
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceFlushed, faFaceGrimace, faFaceLaughBeam, faFaceSadCry, faFaceTired, faHome, faSearch } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link.js";

import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import VirtualKeyboard from "../../components/virtualKeyboard";

export default function NameEmailPage(props) {
    const [id, setId] = useState("");
    const [layout, setLayout] = useState("default");
    const [slideNumber, setSlideNumber] = useState(0);
    const [disableNext, setDisableNext] = useState(false);
    const [disablePrev, setDisablePrev] = useState(true);
    const [focusedInput, setFocusedInput] = useState("");

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(null);
    const [distancia, setDistancia] = useState(null);
    const [emissoes, setEmissoes] = useState(null);
    const [deslocamento, setDeslocamento] = useState("");

    const [estadoSelecionado, setEstadoSelecionado] = useState("");
    const [cidadeSelecionada, setCidadeSelecionada] = useState(null);
    const [filtroCidades, setFiltroCidades] = useState([]);
    const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
    const [avisoEstado, setAvisoEstado] = useState("");

    const [show, setShow] = useState(false);


    const { handleChangeSlide, handleInputChange, handleFocus, name, email } = props

    


    return (
        <section>
            <div action="">
                <div className="row">
                    <div className="col-12">
                        <label htmlFor="name" className="form-label text-white">
                            Seu Nome
                        </label>
                        <input
                            type="text"
                            className="form-control fs-5 p-3"
                            placeholder="Toque aqui para digitar o seu nome"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onFocus={() => {handleFocus("name"), setFocusedInput("name")}}
                            autoComplete="off"
                        />
                    </div>
                </div>
                {/* {
                focusedInput === "name" ? VirtualKeyboard() : null
            } */}
                {
                    focusedInput === "name" ?
                        <VirtualKeyboard
                            focusedInput={focusedInput}
                            handleFocus={handleFocus}
                            handleInputChange={handleInputChange} />
                        :
                        null
                }

                <div className="row mt-3">
                    <div className="col-12">
                        <label htmlFor="email" className="form-label text-white">
                            Seu Email
                        </label>
                        <input
                            type="email"
                            className="form-control fs-5 p-3"
                            placeholder="Toque aqui para digitar o seu email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => handleFocus("email")}
                            autoComplete="off"
                        />
                    </div>
                </div>
                {
                    focusedInput === "email" ?
                        <VirtualKeyboard
                            focusedInput={focusedInput}
                            handleFocus={handleFocus}
                            handleInputChange={handleInputChange} />
                        :
                        null
                }
            </div>

            <div className="row mt-5">
                <div className="col-12 d-flex justify-content-end">
                    {/* {slideNumber !== 0 && (
                    <button
                        type="button"
                        className="btn btn-light fs-5 p-3"
                        onClick={() => {
                            handleChangeSlide("-");
                            resetData();
                        }}
                        disabled={disablePrev}
                    >Voltar</button>
                )} */}

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

    )
}