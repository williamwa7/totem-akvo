'use client'
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft, faArrowLeft, faCalendar, faGasPump, faHandsBound, faHandsClapping, faHandshake, faHome, faPlaneArrival, faPlaneDeparture, faSearch } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link.js";
import SliderCarousel from "../components/SliderCarousel";
import { useEffect } from "react";
import estados_cidades from "./../../utils/estados_cidades.json";
import ruas_gramado from "./../../utils/ruas_gramado.json";
import aeroportos from "./../../utils/aeroportos.json";
import unidecode from 'unidecode';
import Modal from 'react-bootstrap/Modal';
import VirtualKeyboard from "../components/virtualKeyboard";
import Confetti from 'react-confetti';
import isMobile from "@/utils/isMobile";




export default function DataCollect() {
    // State para os valores dos inputs
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [empresa, setEmpresa] = useState('');
    const [consultor, setConsultor] = useState(false);
    const [telefone, setTelefone] = useState("");
    const [verificarEmpresa, setVerificarEmpresa] = useState(true);
    const [errorMsgEmail, setErrorMsgEmail] = useState("");
    const [errorMsgPhone, setErrorMsgPhone] = useState("");
    const [slideNumber, setSlideNumber] = useState(0);
    const [disableNext, setDisableNext] = useState(false);
    const [disablePrev, setDisablePrev] = useState(true);
    const [focusedInput, setFocusedInput] = useState("");
    const [buttonSearchClicked, setButtonSearchClicked] = useState("");
    const [celebrate, setCelebrate] = useState(false);



    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(null);
    const [dataSaved, setDataSaved] = useState(false);

    const [estadoSelecionado, setEstadoSelecionado] = useState("");
    const [cidadeSelecionada, setCidadeSelecionada] = useState(null);
    const [filtroCidades, setFiltroCidades] = useState([]);
    const [avisoEstado, setAvisoEstado] = useState("");

    const [showModalCidade, setShowModalCidade] = useState(false);
    const [showModalSaibaMais, setShowModalSaibaMais] = useState(false);

    const handleCloseModalCidade = () => {
        setShowModalCidade(false);
    }
    const handleShowModalCidade = () => {
        if (!estadoSelecionado) {
            setAvisoEstado("Por favor, selecione um estado");
        } else {
            setAvisoEstado("");
            setShowModalCidade(true);
        }
    }

    const handleShowModalSaibaMais = () => {
        setShowModalSaibaMais(true);
    }
    const handleCloseModalSaibaMais = () => {
        setShowModalSaibaMais(false);
    }


    const handleCelebrate = () => {
        setCelebrate(true);
        // Defina para false após um tempo para parar a celebração
        setTimeout(() => setCelebrate(false), 5000);
    };


    const handleChangeEstado = (event) => {
        setAvisoEstado("");
        const estado = event.target.value;
        setEstadoSelecionado(estado);
        setCidadeSelecionada("");
        setFiltroCidades([]);
    };

    const handleChangeCidade = (event) => {
        const cidade = event.target.value;
        setCidadeSelecionada(cidade);
    };






    const handlePesquisarCidade = (event) => {
        setCidadeSelecionada(event)
        const pesquisa = unidecode(event.toLowerCase());
        const cidadesEstadoSelecionado = estados_cidades.estados.find((estado) => estado.sigla === estadoSelecionado)?.cidades || [];
        const cidadesFiltradas = cidadesEstadoSelecionado.filter((cidade) => unidecode(cidade.toLowerCase()).includes(pesquisa));
        setFiltroCidades(cidadesFiltradas.length > 0 ? cidadesFiltradas : ["Não encontramos nenhuma cidade para esta busca"]);
        // setMostrarSugestoes(true);
    };

    const selecionarCidade = (cidade) => {
        setCidadeSelecionada(cidade);
        // setMostrarSugestoes(false);
        setFocusedInput("");
        // setMostrarSugestoes(false);
    };





    const handleDataVerification = () => {
        const verifyEmail = () => {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            const isValidEmail = re.test(String(email).toLowerCase());

            if (isValidEmail) {
                setErrorMsgEmail(null);
            } else {
                setErrorMsgEmail("O formato do e-mail inserido não é válido. Por favor, verifique e tente novamente.");
            }
            return isValidEmail;
        }

        const verifyPhone = () => {
            const isValidPhone = telefone.length === 15;
            if (isValidPhone) {
                setErrorMsgPhone(null);
            } else {
                setErrorMsgPhone("O telefone inserido não é válido. Por favor, verifique e tente novamente.");
            }
            return isValidPhone;
        }

        const isValidEmail = verifyEmail();
        const isValidPhone = verifyPhone();

        if (isValidEmail && isValidPhone) {
            handleChangeSlide('+');
        } else if (!isValidEmail) {
            // Trate o erro de e-mail inválido
            const errorMsgElement = document.getElementById('errorMsgEmail');
            if (errorMsgElement) {
                errorMsgElement.classList.add('shake-text');
                setTimeout(() => {
                    errorMsgElement.classList.remove('shake-text');
                }, 500);
            }
        } else if (!isValidPhone) {
            // Trate o erro de telefone inválido
            const errorMsgElement = document.getElementById('errorMsgPhone');
            if (errorMsgElement) {
                errorMsgElement.classList.add('shake-text');
                setTimeout(() => {
                    errorMsgElement.classList.remove('shake-text');
                }, 500);
            }
        }
    }

    const maskCelular = (celular) => {
        return celular
            .replace(/\D/g, "")
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{4})(\d)/, "$1-$2")
            .replace(/(\d{4})-(\d)(\d{4})/, "$1$2-$3")
            .replace(/(-\d{4})\d+?$/, "$1");
    }



    useEffect(() => {
        if (slideNumber === 1) {
            setDisablePrev(false);
            if (!name || !email || !telefone) {
                setDisableNext(true);
            } else {
                setDisableNext(false);
            }
        } else if (slideNumber === 2) {
            if (estadoSelecionado === '' || cidadeSelecionada === "" || (verificarEmpresa && empresa === '')) {
                setDisableNext(true);
            } else {
                setDisableNext(false);
            }
        }
        else if (slideNumber === 3) {
            setDisableNext(true);
        } else {
            setDisablePrev(false);
        }
    }, [
        slideNumber,
        name,
        email,
        estadoSelecionado,
        cidadeSelecionada,
        verificarEmpresa,
        empresa,
        consultor,
        telefone
    ]);

    const handleChangeSlide = (action) => {
        if (action === "+") {
            setSlideNumber(slideNumber + 1);
            setFocusedInput("");
        } else {
            setFocusedInput("");
            setSlideNumber(slideNumber - 1);
        }
    }

    const handleChangeTelefone = (event) => {
        const phone = event.target.value;
        if (phone.length <= 15) {
            setTelefone(phone);
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
            case "empresa":
                setEmpresa(value);
                break;
            case "telefone":
                setTelefone(maskCelular(value));
                break;
            case "cidadeSelecionada":
                // setCidadeSelecionada(value);
                handlePesquisarCidade(value);
                break;
            default:
                break;
        }
    };

    const handleFocus = (inputId) => {
        // está em uma função porque quando é clicado em ok
        // no teclado virtual, o focusedInput é alterado para "".
        setFocusedInput(inputId);
    };

    const handleSubmitForm = async () => {
        setLoading(true);
        const newId = new Date().getTime();
        setId(newId); // Passar o valor do id para setId

        const formData = {
            id: newId,
            name: name,
            email: email,
            empresa: empresa === '' ? 'Sem empresa' : empresa,
            consultor: consultor ? 'sim' : 'não',
            telefone: telefone,
            deslocamento: "",
            aeroportoOrigem: "",
            aeroportoDestino: "",
            combustivel: "",
            anoVeiculo: "",
            origem: "",
            destino: "",
        };

        try {
            const response = await fetch(`/api/submitForm`, {
                method: 'post',
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            console.log('Response:', data);
            setDataSaved(true);
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao enviar os dados. Por favor, tente novamente mais tarde.');
        }

        handleChangeSlide('+');
        setLoading(false);
        setTimeout(() => {
            handleCelebrate();
        }, 500);
    };

    const resetData = () => {
        setEmail("");
        setEmpresa("");
        setVerificarEmpresa(false);
        setTelefone("");
        setErrorMsgEmail(null);
        setErrorMsgPhone(null);
        setCidadeSelecionada("");
        setEstadoSelecionado("");
        setDisableNext(false);
        setDisablePrev(true);
        setFocusedInput("");
        setSlideNumber(0);
        setTimeout(() => {
            setDataSaved(false);
            setName("");
        }, 2000);
    }

    const slides = [
        {
            content:
                <section>
                    <div className="col-12 d-flex flex-column justify-content-center mt-5 align-items-center gap-3">
                        <div className="col-12 d-flex justify-content-center">
                            <img src="/assets/AKVO.png" alt="" className="akvo-logo-carousel" />
                        </div>
                        <div className="row justify-content-center align-items-center" style={{ height: "50vh" }}>
                            <div className="col-12 mt-5">
                                <h1 htmlFor="name" className="homeDataCollectConsultTitle1">
                                    Seja um Consultor AKVO!
                                </h1>
                                <p className="homeDataCollectSubtitle">
                                    Preencha o formulário e registre seu<br />interesse em se tornar um consultor!
                                </p>
                            </div>
                            <div className="col-12 d-flex justify-content-center">                                <button
                                type="button"
                                className="btn btn-outline-light fs-4 p-3 glow-button start-btn"
                                onClick={() => {
                                    {
                                        setConsultor(true);
                                        handleChangeSlide("+");
                                    }
                                }}
                            >
                                Quero ser um Consultor AKVO!
                            </button>
                            </div>
                            <div className="col-12 d-flex justify-content-center">
                                <button
                                    type="button"
                                    className="btn btn-outline-light fs-5 p-2 saiba-mais-btn"
                                    onClick={() => handleShowModalSaibaMais()}
                                >
                                    Saiba mais!
                                </button>
                            </div>
                        </div>
                    </div>

                    <>
                        <Modal show={showModalSaibaMais} onHide={handleCloseModalSaibaMais} size="xl" className="fs-4">
                            <Modal.Header closeButton className="">
                                <Modal.Title>Seja um Consultor AKVO!</Modal.Title>
                            </Modal.Header>
                            <Modal.Body className="bg-light">
                                <div className="col-12">

                                    <div className="row mt-3">
                                        <div className="col-12 text-center">
                                            Aqui irá um texto bem bonito pra encantar o consultor
                                        </div>
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer className="align-items-center justify-content-end">
                                <button className="btn btn-dark fs-4 px-3" variant="light" onClick={handleCloseModalSaibaMais}>
                                    Fechar
                                </button>
                            </Modal.Footer>
                        </Modal>
                    </>

                </section>

        },
        {
            content:
                <section>
                    <div action="">
                        <div className="row">
                            <div className="col-12">
                                <label htmlFor="name" className="form-label text-white">
                                    Seu Nome
                                </label>
                                <input
                                    type="text"
                                    className="form-control fs-4 p-3"
                                    placeholder="Toque aqui para digitar o seu nome completo"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onFocus={() => handleFocus("name")}
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                        {/* {
                            focusedInput === "name" ? VirtualKeyboard() : null
                        } */}
                        {
                            focusedInput === "name" && !isMobile() ?
                                <VirtualKeyboard
                                    focusedInput={focusedInput}
                                    handleFocus={handleFocus}
                                    handleInputChange={handleInputChange}
                                    inputText={name}
                                />
                                :
                                null
                        }

                        <div className="row mt-xl-5">
                            <div className="col-12">
                                <label htmlFor="email" className="form-label text-white">
                                    Seu Email
                                </label>
                                <input
                                    type="email"
                                    className="form-control form-control-text fs-4 p-3"
                                    placeholder="Toque aqui para digitar o seu email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => handleFocus("email")}
                                    autoComplete="off"
                                />
                                {errorMsgEmail && <p id="errorMsgEmail" className="mt-1 mb-0 ps-2 text-danger shake-text fs-5 fw-bold errorMsgEmail">{errorMsgEmail}</p>}
                            </div>
                        </div>
                        {
                            focusedInput === "email" && !isMobile() ?
                                <VirtualKeyboard
                                    focusedInput={focusedInput}
                                    handleFocus={handleFocus}
                                    handleInputChange={handleInputChange}
                                    inputText={email}
                                />
                                :
                                null
                        }



                    </div>
                    <div className="row">
                        <div className="col-12 mt-xl-5">
                            <>
                                <label htmlFor="telefone" className="form-label text-white">
                                    Telefone
                                </label>
                                <input
                                    type="tel"
                                    className="form-control form-control-text fs-4 p-3"
                                    placeholder="Digite o número do seu telefone"
                                    id="telefone"
                                    value={maskCelular(telefone)}
                                    onChange={(e) => handleChangeTelefone(e)}
                                    onFocus={() => handleFocus("telefone")}
                                    autoComplete="off"
                                    maxLength={15}
                                />
                                <span className="text-white fs-5 fst-italic aviso-input">Se possível, insira um número com WhatsApp</span>
                            </>
                            {errorMsgPhone && <p id="errorMsgPhone" className="mt-1 mb-0 ps-2 text-danger shake-text fs-5 fw-bold errorMsgPhone">{errorMsgPhone}</p>}
                            {
                                focusedInput === "telefone" && !isMobile() ?
                                    <VirtualKeyboard
                                        focusedInput={focusedInput}
                                        handleFocus={handleFocus}
                                        handleInputChange={handleInputChange}
                                        inputText={telefone}
                                    />
                                    :
                                    null
                            }
                        </div>
                    </div>


                    <div className="row mt-5">
                        <div className="col-12 d-flex justify-content-end">
                            <button
                                type="button"
                                className="btn btn-light fs-4 p-3"
                                onClick={() => {
                                    handleDataVerification();
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
                    <div className="row">
                        <div className="col-12 d-flex flex-wrap">
                            <div className="col-xl-5 col-12 pe-xl-2">
                                <label htmlFor="estado" className="text-white form-label-select">Estado:</label>
                                <select className="form-select fs-4 p-3" id="estado" value={estadoSelecionado} onChange={handleChangeEstado}>
                                    <option value="" disabled className="p-3">Selecione</option>
                                    {estados_cidades.estados.map((estado, index) => (
                                        <option key={index} value={estado.sigla}>
                                            {estado.nome}
                                        </option>
                                    ))}
                                    <hr />
                                </select>
                                {avisoEstado !== "" &&
                                    <div className="mt-1 ps-2 text-danger shake-text fs-5 fw-bold aviso-estado">{avisoEstado}</div>
                                }
                            </div>
                            <div className="col-xl-7 col-12 ps-xl-2 d-flex justify-content-between align-self-bottom">
                                <div className="col-12 d-flex align-items-start">
                                    <div className="col-11 pe-4">

                                        <label className="text-white form-label-select" htmlFor="cidade">Cidade:</label>
                                        <select className="form-select fs-4 p-3" id="cidade" value={cidadeSelecionada} onChange={handleChangeCidade}>
                                            <option value="" disabled>{estadoSelecionado ? "Selecione" : "Selecione um estado primeiro"}</option>
                                            {estadoSelecionado &&
                                                estados_cidades.estados.find((estado) => estado.sigla === estadoSelecionado).cidades.map((cidade, index) => (
                                                    <option key={index} value={cidade}>
                                                        {cidade}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="col-1 d-flex flex-column justify-content-center align-items-bottom pe-xl-1">
                                        <div>
                                            <label htmlFor=""></label>
                                        </div>
                                        <div className="d-flex justify-content-end">
                                            <button className={"btn btn-outline-light fs-4 p-3 btn-search"} onClick={() => { handleShowModalCidade(), setButtonSearchClicked("cidade") }}><FontAwesomeIcon icon={faSearch} /></button>
                                        </div>
                                    </div>
                                </div>
                                <>
                                    <Modal show={showModalCidade} onHide={handleCloseModalCidade} size="xl" className="fs-4">
                                        <Modal.Header closeButton className="">
                                            <Modal.Title>Buscar cidade</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body className="bg-light">
                                            <div className="col-12">

                                                <div className="row mt-3">
                                                    <div className="col-12">
                                                        <input
                                                            className="form-control fs-4 p-3 mt-3"
                                                            type="text" id="cidadeSelecionada"
                                                            placeholder="Toque aqui para pesquisar uma cidade..."
                                                            autoComplete="off"
                                                            onChange={(e) => handlePesquisarCidade(e.target.value)}
                                                            value={cidadeSelecionada}
                                                            onFocus={() => handleFocus("cidadeSelecionada")}
                                                        />
                                                        {focusedInput === "cidadeSelecionada" &&
                                                            <div className=" mt-1 col-12 bg-white rounded shadow border border-1" style={{ zIndex: 999, minHeight: 150, maxHeight: 150, overflow: "auto" }}>

                                                                {cidadeSelecionada.length > 0 ?
                                                                    <ul className="p-3">
                                                                        {filtroCidades.map((cidade, index) => (
                                                                            <li key={index} onClick={() => selecionarCidade(cidade)} className="p-1 cursor-pointer border-bottom border-2">
                                                                                {cidade}
                                                                            </li>
                                                                        ))}
                                                                    </ul> :
                                                                    <div className="p-3 text-center d-flex justify-content-center align-items-center h-100 fst-italic" style={{ minHeight: 140 }}>
                                                                        Digite o nome de uma cidade para exibir as sugestões
                                                                    </div>
                                                                }
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                                {
                                                    focusedInput === "cidadeSelecionada" && !isMobile() ?
                                                        <div className="position-relative virtual-keyboard-container">
                                                            <VirtualKeyboard
                                                                focusedInput={focusedInput}
                                                                handleFocus={handleFocus}
                                                                handleInputChange={handleInputChange}
                                                                inputText={cidadeSelecionada}
                                                            />
                                                        </div>
                                                        :
                                                        null
                                                }
                                            </div>
                                        </Modal.Body>
                                        <Modal.Footer className="align-items-center justify-content-center">
                                            <button className="btn btn-dark fs-4 px-3" variant="light" onClick={handleCloseModalCidade}>
                                                Ok
                                            </button>
                                        </Modal.Footer>
                                    </Modal>
                                </>

                            </div>

                        </div>
                    </div>


                    <div className="row mt-xl-5">
                        <div className="col-12 mt-3">
                            {verificarEmpresa ?
                                <>
                                    <label htmlFor="empresa" className="form-label text-white">
                                        Nome da empresa
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control fs-4 p-3"
                                        placeholder="Toque aqui para digitar o nome da sua empresa"
                                        id="empresa"
                                        value={empresa}
                                        onChange={(e) => setEmpresa(e.target.value)}
                                        onFocus={() => handleFocus("empresa")}
                                        autoComplete="off"
                                    />
                                </>
                                :
                                null
                            }
                            {
                                focusedInput === "empresa" && !isMobile() ?
                                    <VirtualKeyboard
                                        focusedInput={focusedInput}
                                        handleFocus={handleFocus}
                                        handleInputChange={handleInputChange}
                                        inputText={empresa}
                                    />
                                    :
                                    null
                            }
                            <div className="col-12 d-flex align-items-baseline fs-4 mt-2">
                                <input type="checkbox" id="semEmpresa" className="form-check-input" name="semEmpresa" value={verificarEmpresa} onChange={() => { setVerificarEmpresa(!verificarEmpresa); setEmpresa(''); handleFocus("") }} />
                                <label htmlFor="semEmpresa" className="ms-2 form-check-label text-white " >Não faço parte de uma empresa</label>
                            </div>
                        </div>
                    </div>


                    <div className="row mt-5">
                        <div className="col-12 d-flex justify-content-between">
                            {slideNumber !== 0 && (
                                <button
                                    type="button"
                                    className="btn btn-light fs-4 p-3"
                                    onClick={() => {
                                        handleChangeSlide("-");
                                    }}
                                    disabled={disablePrev}
                                >Voltar</button>
                            )}

                            <button
                                type="button"
                                className="btn btn-light fs-4 p-3"
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
                            <img src="/assets/AKVO.png" alt="" className="akvo-logo-carousel" />
                        </div>
                        {!loading ?
                            <>
                                <div className="col-12 d-flex flex-column gap-4 justify-content-center align-items-center" style={{ height: "35vh" }}>
                                    <div className="col-12" >
                                        <h1 className="homeDataCollectConsultTitle1">
                                            Uma parceria de sucesso vem por aí!
                                        </h1>
                                        <h1 className="homeDataCollectConsultTitle2 ">{name} e AKVO!</h1>
                                        <p className="homeDataCollectSubtitle">
                                            Toque no botão enviar para registrar seu interesse.
                                        </p>
                                    </div>
                                    <div className="col-12 d-flex justify-content-center">
                                        <button
                                            type="button"
                                            className="btn btn-outline-light glow-button fs-2 p-3 enviar-btn"
                                            onClick={() => {
                                                handleSubmitForm();
                                            }}
                                        >
                                            Enviar
                                        </button>
                                    </div>
                                </div>
                                <div className="col-12 text-secondary text-center fs-6 aviso-privacidade">
                                    <div><b className="aviso-privacidade-title">Aviso de Privacidade:</b></div>
                                    <div>Os dados fornecidos neste formulário, incluindo nome, e-mail, empresa, telefone, endereço, são coletados para futuros contatos comerciais relacionados aos nossos produtos e serviços. Garantimos que seus dados serão tratados com sigilo e segurança, de acordo com a Lei Geral de Proteção de Dados (LGPD) do Brasil.</div>
                                    <div className="mt-2">Ao tocar no botão <i><b>Enviar</b></i>, você concorda com a coleta e o processamento dos seus dados conforme descrito acima.</div>
                                </div>
                            </>
                            :
                            <div className="row" style={{ height: "40vh" }}>
                                <div className="col-12 d-flex flex-column gap-4 justify-content-center align-items-center">

                                    <h1 className="fs-1 text-center text-light">Aguarde,<br />estamos registrando seu interesse.</h1>
                                    <div className="custom-loader"></div>
                                    {/* <div className="spinner-border text-light" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div> */}
                                </div>
                            </div>

                        }
                    </div>
                </section>
        },
        {
            content: <>
                {/* {loadResults ? <ResultPage id={id} resetData={resetData} /> : null} */}
                <section>
                    <div className="col-12 d-flex flex-column justify-content-center mt-5 align-items-center gap-5">
                        <div className="col-12 d-flex justify-content-center">
                            <img src="/assets/AKVO.png" alt="" className="akvo-logo-carousel" />
                        </div>
                        {loading ? (
                            <div className="col-12 d-flex justify-content-center align-items-center" style={{ height: "550px" }}>
                                <div className="custom-loader"></div>
                            </div>
                        ) : (
                            dataSaved ? (
                                <div className="col-12 d-flex flex-column justify-content-center align-items-center" style={{ height: "550px" }}>
                                    <div className="col-12 d-flex justify-content-center">
                                        <div className="d-flex flex-column justify-content-center align-items-center">
                                            <h1 className="homeDataCollectConsultTitle1">Parabéns!</h1>
                                            <h1 className="homeDataCollectConsultTitle2">{name},</h1>
                                            <p className="homeDataCollectSubtitle mt-2">Seu interesse em ser um consultor AKVO foi registrado com sucesso.</p>
                                            <p className="homeDataCollectSubtitle mt-2"> Nossa equipe entrará em contato com você em breve!</p>
                                        </div>
                                    </div>
                                    <Link
                                        href="/dataCollect"
                                        className="btn btn-light fs-2 p-3 col-6 mt-5 hide-on-mobile"
                                        onClick={() => resetData()}>
                                        Finalizar
                                    </Link>
                                </div>
                            ) : (
                                <div className="col-12 d-flex flex-column justify-content-center align-items-center" style={{ height: "550px" }}>
                                    <div  >
                                        <h1 className="text-light text-center fs-1">Infelizmente não foi possível<br />registrar seu interesse</h1>
                                        <p className="text-light text-center mt-5">Deseja tentar novamente?</p>
                                    </div>
                                    <div className="col-12 d-flex justify-content-center mt-5">
                                        <div className="col-6 d-flex justify-content-center">
                                            <button type="button" className="btn btn-light fs-2 p-3" onClick={() => { resetData() }}>Tentar novamente</button>
                                        </div>
                                        <div className="col-6 d-flex justify-content-center">
                                            <Link
                                                href="/dataCollect"
                                                className="btn btn-outline-light fs-2 p-3 col-6"
                                                onClick={() => resetData()}>
                                                Finalizar
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </section>
            </>
        },
        {
            content:
                <>

                </>
        }
    ];

    return (
        <div className="backgroundAkvo2">
            <div className="col-12 d-flex justify-content-start hide-on-mobile" >
                <Link href="dataCollect" >
                    <FontAwesomeIcon icon={faArrowAltCircleLeft} className="homeButton" />
                </Link>
            </div>
            <div className="row justify-content-center">
                {celebrate && <Confetti
                    width={window.innerWidth}
                    numberOfPieces={500} // Ajuste o número de peças conforme desejado
                    recycle={false} // Evita que o confete seja reciclado, tornando-o mais longo
                    gravity={0.2} // Ajuste a gravidade para controlar a velocidade de queda
                    wind={0.01} // Ajuste o vento para controlar a direção do confete
                />}
                <div className="row justify-content-center pages align-items-center">
                    <div className="pageContent d-flex flex-column justify-content-center">
                        <SliderCarousel slides={slides} slideNumber={slideNumber} />
                    </div>
                </div>
            </div>
        </div>
    );
}
