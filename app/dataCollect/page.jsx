'use client'
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faGasPump, faHome, faPlaneArrival, faPlaneDeparture, faSearch, faInstagram, faWhatsapp, faFacebook, faLinkedin } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link.js";
import SliderCarousel from "../components/SliderCarousel";
import { useEffect } from "react";
import estados_cidades from "./../../utils/estados_cidades.json";
import ruas_gramado from "./../../utils/ruas_gramado.json";
import aeroportos from "./../../utils/aeroportos.json";
import unidecode from 'unidecode';
import Modal from 'react-bootstrap/Modal';
import VirtualKeyboard from "../components/virtualKeyboard";
import baseUrl from "@/utils/baseUrl";
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
    const [slideNumber, setSlideNumber] = useState(0);
    const [disableNext, setDisableNext] = useState(false);
    const [disablePrev, setDisablePrev] = useState(true);
    const [focusedInput, setFocusedInput] = useState("");
    const [buttonSearchClicked, setButtonSearchClicked] = useState("");



    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(null);
    const [distancia, setDistancia] = useState(null);
    const [emissoes, setEmissoes] = useState(null);
    const [deslocamento, setDeslocamento] = useState("");
    const [combustivel, setCombustivel] = useState("");
    const [anoVeiculo, setAnoVeiculo] = useState("");
    const [aeroportoOrigem, setAeroportoOrigem] = useState("");
    const [aeroportoDestino, setAeroportoDestino] = useState("");

    const [estadoSelecionado, setEstadoSelecionado] = useState("");
    const [cidadeSelecionada, setCidadeSelecionada] = useState(null);
    const [ruaSelecionada, setRuaSelecionada] = useState('');
    const [filtroCidades, setFiltroCidades] = useState([]);
    const [filtroRuas, setFiltroRuas] = useState([]);
    const [filtroAeroportos, setFiltroAeroportos] = useState([]);
    // const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
    const [avisoEstado, setAvisoEstado] = useState("");

    const [showModalCidade, setShowModalCidade] = useState(false);
    const [showModalRua, setShowModalRua] = useState(false);
    const [showModalAeroporto, setShowModalAeroporto] = useState(false);
    const yearsList = Array.from({ length: 75 }, (_, i) => 2024 - i);

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

    const handleCloseModalRua = () => {
        setShowModalRua(false);
    }
    const handleShowModalRua = () => {
        setShowModalRua(true);
    }

    const handleCloseModalAeroporto = () => {
        setShowModalAeroporto(false);
    }
    const handleShowModalAeroporto = () => {
        setShowModalAeroporto(true);
    }



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

    const handleChangeRua = (event) => {
        const rua = event.target.value;
        setRuaSelecionada(rua);
    };


    const handleChangeDeslocamento = (event) => {
        setDistancia('');
        setEmissoes('');
        setDeslocamento('');
        setCombustivel('');
        setAnoVeiculo('');
        setAeroportoOrigem('');
        setAeroportoDestino('');
        const deslocamento = event.target.value;
        setDeslocamento(deslocamento);
    };

    const handleChangeAeroporto = (event) => {
        const aeroporto = event.target.value;
        if (focusedInput === 'aeroportoOrigem') {
            setAeroportoOrigem(aeroporto);
        } else if (focusedInput === 'aeroportoDestino') {
            setAeroportoDestino(aeroporto);
        }
    };


    const handlePesquisarCidade = (event) => {
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

    const handlePesquisarRua = (event) => {
        const pesquisa = unidecode(event.toLowerCase());
        const ruasFiltradas = ruas_gramado.logradouros.filter(rua => unidecode(rua.toLowerCase()).includes(pesquisa));
        setFiltroRuas(ruasFiltradas.length > 0 ? ruasFiltradas : ["Não encontramos nenhuma rua para esta busca"]);
        // setMostrarSugestoes(true);
    };

    const selecionarRua = (rua) => {
        setRuaSelecionada(rua);
        // setMostrarSugestoes(false);
        setFocusedInput("");
        // setMostrarSugestoes(false);
    };

    const handlePesquisarAeroporto = (event) => {
        const pesquisa = unidecode(event.toLowerCase());
        const aeroportosMapeados = aeroportos.airports.map(aeroporto => (aeroporto));

        const aeroportosFiltrados = aeroportosMapeados.filter(aeroporto => unidecode(aeroporto.toLowerCase()).includes(pesquisa));

        setFiltroAeroportos(aeroportosFiltrados.length > 0 ? aeroportosFiltrados : ["Não encontramos nenhum aeroporto para esta busca"]);
        // setMostrarSugestoes(true);
    };

    const selecionarAeroporto = (aeroporto) => {
        if (focusedInput === 'aeroportoOrigem') {
            setAeroportoOrigem(aeroporto);
        } else if (focusedInput === 'aeroportoDestino') {
            setAeroportoDestino(aeroporto);
        }
        // setMostrarSugestoes(false);
        setFocusedInput("");
        // setMostrarSugestoes(false);
        setFiltroAeroportos([]);
    };

    const verifyEmail = () => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const isValidEmail = re.test(String(email).toLowerCase());

        if (isValidEmail) {
            setErrorMsgEmail(null);
            handleChangeSlide('+');
        } else {
            setErrorMsgEmail("O formato do e-mail inserido não é válido. Por favor, verifique e tente novamente.");
        }
        return isValidEmail;
    }

    const handleEmailVerification = () => {
        const isValidEmail = verifyEmail();

        if (isValidEmail) {
            handleChangeSlide('+');
        } else {
            setErrorMsgEmail("O formato do e-mail inserido não é válido. Por favor, verifique e tente novamente.");
            // Aplicar a classe de chacoalhar ao texto de erro
            const errorMsgElement = document.getElementById('errorMsgEmail');
            if (errorMsgElement) {
                errorMsgElement.classList.add('shake-text');
                // Remover a classe após a animação ser concluída
                setTimeout(() => {
                    errorMsgElement.classList.remove('shake-text');
                }, 500); // Tempo da animação em milissegundos
            }
        }
    }



    useEffect(() => {
        if (slideNumber === 1) {
            setDisablePrev(false);
            if (!name || !email || (verificarEmpresa && empresa === '')) {
                setDisableNext(true);
            } else {
                setDisableNext(false);
            }
        } else if (slideNumber === 2) {
            if (estadoSelecionado === '' || cidadeSelecionada === "" || deslocamento === "") {
                setDisableNext(true);
            } else if (cidadeSelecionada === 'Gramado' && ruaSelecionada === '') {
                setDisableNext(true);
            } else if (deslocamento === 'avião' && (aeroportoOrigem === '' || aeroportoDestino === '')) {
                setDisableNext(true);
            } else if ((deslocamento === 'automóvel' || deslocamento === 'motocicleta' || deslocamento === 'van' || deslocamento === 'caminhão') &&
                (combustivel === '' || anoVeiculo === '')) {
                setDisableNext(true);
            }
            else {
                setDisableNext(false);
            }
        }
        else if (slideNumber === 3) {
            setDisableNext(true);
        } else {
            setDisablePrev(false);
            setDisableNext(false);
        }
    }, [
        slideNumber,
        name,
        email,
        estadoSelecionado,
        cidadeSelecionada,
        ruaSelecionada,
        deslocamento,
        combustivel,
        anoVeiculo,
        aeroportoOrigem,
        aeroportoDestino,
        verificarEmpresa,
        empresa,
        consultor,
        telefone
    ]);

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
            case "empresa":
                setEmpresa(value);
                break;
            case "telefone":
                setTelefone(value);
                break;
            case "cidadeSelecionada":
                setCidadeSelecionada(value);
                handlePesquisarCidade(value);
                break;
            case 'ruaSelecionada':
                setRuaSelecionada(value);
                handlePesquisarRua(value);
                break;
            case 'aeroportoOrigem':
                setAeroportoOrigem(value);
                handlePesquisarAeroporto(value);
                break;
            case 'aeroportoDestino':
                setAeroportoDestino(value);
                handlePesquisarAeroporto(value);
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
            empresa: empresa,
            consultor: consultor ? 'sim' : 'não',
            telefone: telefone,
            deslocamento: deslocamento,
            aeroportoOrigem: aeroportoOrigem,
            aeroportoDestino: aeroportoDestino,
            combustivel: combustivel,
            anoVeiculo: anoVeiculo,
            origem: `${ruaSelecionada && `${ruaSelecionada},`} ${cidadeSelecionada}, ${estadoSelecionado}, `,
            destino: 'R. Henrique Belotto - Vila Jardim, Gramado - RS, 95677-052',
        };

        try {
            const response = await fetch(`/api/submitForm`, {
                method: 'post',
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            console.log('Response:', data);


            fetchData();

        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao enviar os dados. Por favor, tente novamente mais tarde.');
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/getDataForm`);
            const jsonData = await response.json();
            setData(jsonData);
        } catch (error) {
            console.error('Erro ao buscar os dados:', error);
        }
    };

    useEffect(() => {
        // Verifica se há dados filtrados e se há uma distância disponível
        if (data.length > 0) {
            const filteredData = data.find(item => item.id === id.toString());
            const distanciaEncontrada = filteredData.distancia;
            if (distanciaEncontrada) {
                setDistancia(parseFloat(distanciaEncontrada).toLocaleString('pt-BR', { maximumFractionDigits: 2 }));
                handleChangeSlide("+");
                // parseFloat(distanciaEncontrada)

                setEmissoes(parseFloat(distanciaEncontrada) * 0.0165); //calculo hipotético para exemplo

                setTimeout(() => {
                    setLoading(false);
                }, 2000);
            } else {
                setTimeout(() => {
                    fetchData();
                }, 3000);
            }
        }
    }, [data, id, handleChangeSlide]);



    const resetData = () => {
        setName("");
        setEmail("");
        setErrorMsgEmail(null);
        setEmpresa("");
        setVerificarEmpresa(true);
        setConsultor(false);
        setTelefone("");
        setCidadeSelecionada("");
        setEstadoSelecionado("");
        setRuaSelecionada("");
        setAeroportoOrigem("");
        setAeroportoDestino("");
        setDeslocamento("");
        setFiltroCidades([]);
        setDisableNext(false);
        setDisablePrev(true);
        setFocusedInput("");
        setSlideNumber(0);
        setData([]);
        setDistancia(null);
        setEmissoes(null);
    }

    const slides = [
        {
            content:
                <section>
                    <div className="col-12 d-flex flex-column justify-content-center mt-5 align-items-center gap-3">
                        <div className="col-12 d-flex justify-content-center">
                            <img src="/assets/AKVO.png" alt="" width={500} />
                        </div>
                        <div className="row justify-content-center align-items-center" style={{ height: "50vh" }}>
                            <div className="col-12 mt-5">
                                <h1 htmlFor="name" className="homeDataCollectTitle">
                                    Bem vindo!
                                </h1>
                                <h1 className="text-light text-center mb-4">Calcule as emissões de carbono<br />referentes ao seu deslocamento</h1>
                                <p className="homeDataCollectSubtitle mb-4">
                                    Toque no botão abaixo para iniciar
                                </p>
                            </div>
                            <div className="col-12 d-flex justify-content-center">
                                <button
                                    type="button"
                                    className="btn btn-light fs-2 p-3 col-6 pulsate"
                                    onClick={() => {
                                        handleChangeSlide("+");
                                    }}
                                >
                                    Iniciar
                                </button>
                            </div>
                            <div className="col-12 d-flex justify-content-center mt-5">
                                <Link
                                    href="/dataCollectConsultant"
                                    className="btn btn-outline-light fs-5 my-4 glow-button p-3"
                                    onClick={() => {
                                        {
                                            setConsultor(true);
                                            // handleChangeSlide("+");
                                        }
                                    }}>
                                    Quero ser um Consultor AKVO!
                                </Link>

                                {/* <button
                                    type="button"
                                    className="btn btn-outline-light fs-5 my-5 glow-button"
                                    onClick={() => {
                                        {
                                            setConsultor(true);
                                            // handleChangeSlide("+");
                                        }
                                    }}
                                >
                                    Quero ser um Consultor AKVO!
                                </button> */}
                            </div>
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
                            focusedInput === "name" ?
                                <VirtualKeyboard
                                    focusedInput={focusedInput}
                                    handleFocus={handleFocus}
                                    handleInputChange={handleInputChange}
                                    inputText={name}
                                />
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
                                    className="form-control fs-4 p-3"
                                    placeholder="Toque aqui para digitar o seu email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => handleFocus("email")}
                                    autoComplete="off"
                                />
                                {errorMsgEmail && <p id="errorMsgEmail" className="mt-1 mb-0 ps-2 text-danger shake-text fs-5 fw-bold">{errorMsgEmail}</p>}
                            </div>
                        </div>
                        {
                            focusedInput === "email" ?
                                <VirtualKeyboard
                                    focusedInput={focusedInput}
                                    handleFocus={handleFocus}
                                    handleInputChange={handleInputChange}
                                    inputText={email}
                                />
                                :
                                null
                        }

                        <div className="row mt-5">
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
                                    focusedInput === "empresa" ?
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

                                    <input type="checkbox" id="semEmpresa" className="form-check-input" name="semEmpresa" checked={!verificarEmpresa} value={verificarEmpresa} onChange={() => { setVerificarEmpresa(!verificarEmpresa); setEmpresa(""); handleFocus("") }} />
                                    <label htmlFor="semEmpresa" className="ms-2 form-check-label text-white" >Não faço parte de uma empresa</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row mt-5">
                        <div className="col-12 d-flex justify-content-end">
                            {/* {slideNumber !== 0 && (
                                <button
                                    type="button"
                                    className="btn btn-light fs-4 p-3"
                                    onClick={() => {
                                        handleChangeSlide("-");
                                        resetData();
                                    }}
                                    disabled={disablePrev}
                                >Voltar</button>
                            )} */}

                            <button
                                type="button"
                                className="btn btn-light fs-4 p-3"
                                onClick={() => {
                                    handleEmailVerification();
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
                        <div className="col-12 d-flex">
                            <div className="col-4 pe-3">
                                <label htmlFor="estado" className="text-white">Estado:</label>
                                <select className="form-select fs-4 p-3" id="estado" value={estadoSelecionado} onChange={handleChangeEstado}>
                                    <option value="" disabled className="p-3">Selecione</option>
                                    {estados_cidades.estados.map((estado, index) => (
                                        <option key={index} value={estado.sigla} style={{ padding: "10px" }}>
                                            {estado.nome}
                                        </option>
                                    ))}
                                    <hr />
                                </select>
                            </div>
                            <div className="col-8 ps-3 d-flex justify-content-between align-self-bottom">
                                <div className="col-11 pe-4">

                                    <label className="text-white" htmlFor="cidade">Cidade:</label>
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
                                <div className="col-1 d-flex flex-column justify-content-center align-items-bottom pe-1">
                                    <div>
                                        <label htmlFor=""></label>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <button className={"btn btn-outline-light fs-4 p-3"} onClick={() => { handleShowModalCidade(), setButtonSearchClicked("cidade") }}><FontAwesomeIcon icon={faSearch} /></button>
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
                                                            onChange={handlePesquisarCidade}
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
                                                    focusedInput === "cidadeSelecionada" ?
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

                                {/* <select className="form-select fs-4 p-3" id="cidade" value={cidadeSelecionada} onChange={handleChangeCidade}>
                                    <option value="">Selecione</option>
                                    {estadoSelecionado &&
                                        estados_cidades.estados.find((estado) => estado.sigla === estadoSelecionado).cidades.map((cidade, index) => (
                                            <option key={index} value={cidade}>
                                                {cidade}
                                            </option>
                                        ))}
                                </select> */}
                            </div>
                        </div>
                    </div>
                    {avisoEstado !== "" &&
                        <div className="mt-1 ps-2 text-danger shake-text fs-5 fw-bold">{avisoEstado}</div>
                    }


                    {
                        cidadeSelecionada === "Gramado" &&
                        <div className="row mt-3">

                            <div className="col-12 ps-3 d-flex justify-content-between align-self-bottom">
                                <div className="col-11">

                                    <label className="text-white" htmlFor="cidade">Rua:</label>
                                    <select className="form-select fs-4 p-3" id="cidade" value={ruaSelecionada} onChange={handleChangeRua}>
                                        <option value="" disabled>Selecione</option>
                                        {ruas_gramado.logradouros.map((rua, index) => (
                                            <option key={index} value={rua}>
                                                {rua}
                                            </option>
                                        ))}
                                    </select>
                                    <>
                                        <Modal show={showModalRua} onHide={handleCloseModalRua} size="xl" className="fs-4">
                                            <Modal.Header closeButton className="">
                                                <Modal.Title>Buscar rua</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body className="bg-light">
                                                <div className="col-12">
                                                    <div className="row mt-3">
                                                        <div className="col-12">
                                                            <input
                                                                className="form-control fs-4 p-3 mt-3"
                                                                type="text"
                                                                id="ruaSelecionada"
                                                                autoComplete="off"
                                                                placeholder="Toque aqui para pesquisar um endereço..."
                                                                onChange={handlePesquisarRua} value={ruaSelecionada}
                                                                onFocus={() => handleFocus("ruaSelecionada")} />
                                                            {focusedInput === "ruaSelecionada" && (
                                                                <div className=" mt-1 col-12 bg-white rounded shadow border border-1" style={{ zIndex: 999, minHeight: 150, maxHeight: 150, overflow: "auto" }}>
                                                                    {ruaSelecionada.length > 0 ?
                                                                        <ul className="p-3">
                                                                            {filtroRuas.map((rua, index) => (
                                                                                <li key={index} onClick={() => selecionarRua(rua)} className="p-1 cursor-pointer border-bottom border-2">
                                                                                    {rua}
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                        :
                                                                        <div className="p-3 text-center d-flex justify-content-center align-items-center h-100 fst-italic" style={{ minHeight: 140 }}>
                                                                            Digite o nome de uma rua para exibir as sugestões
                                                                        </div>
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {
                                                        focusedInput === "ruaSelecionada" ?
                                                            <div className="position-relative virtual-keyboard-container">
                                                                <VirtualKeyboard
                                                                    focusedInput={focusedInput}
                                                                    handleFocus={handleFocus}
                                                                    handleInputChange={handleInputChange}
                                                                    inputText={ruaSelecionada}
                                                                />
                                                            </div>
                                                            :
                                                            null
                                                    }
                                                </div>
                                            </Modal.Body>
                                            <Modal.Footer className="align-items-center justify-content-center">
                                                <button className="btn btn-dark fs-4 px-3" variant="light" onClick={handleCloseModalRua}>
                                                    Ok
                                                </button>
                                            </Modal.Footer>
                                        </Modal>
                                    </>
                                </div>
                                <div className="col-1 d-flex flex-column justify-content-center align-items-bottom pe-1">
                                    <div>
                                        <label htmlFor=""></label>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <button className={"btn btn-outline-light fs-4 p-3"} onClick={() => { handleShowModalRua(), setButtonSearchClicked("rua") }}><FontAwesomeIcon icon={faSearch} /></button>
                                    </div>
                                </div>
                                {/* <select className="form-select fs-4 p-3" id="cidade" value={cidadeSelecionada} onChange={handleChangeCidade}>
                            <option value="">Selecione</option>
                            {estadoSelecionado &&
                                estados_cidades.estados.find((estado) => estado.sigla === estadoSelecionado).cidades.map((cidade, index) => (
                                    <option key={index} value={cidade}>
                                        {cidade}
                                    </option>
                                ))}
                        </select> */}
                            </div>
                        </div>
                    }

                    <div className="row mt-4">
                        <div className="col-12">
                            <label htmlFor="email" className="form-label text-white">Qual foi a sua forma de deslocamento para o evento?</label>
                            <select name="deslocamento" id="deslocamento" className="form-select fs-4 p-3" value={deslocamento} onChange={(e) => handleChangeDeslocamento(e)}>
                                <option value="" disabled>Selecione</option>
                                <option value="automóvel">Automóvel</option>
                                <option value="motocicleta">Motocicleta</option>
                                <option value="van">Van</option>
                                <option value="micro-ônibus">Micro-ônibus</option>
                                <option value="ônibus">Ônibus</option>
                                <option value="avião">Avião</option>
                                <option value="bicicleta">Bicicleta</option>
                                <option value="caminhão">Caminhão</option>
                            </select>
                        </div>
                    </div>
                    {
                        deslocamento === "automóvel" || deslocamento === "motocicleta" || deslocamento === "van" || deslocamento === "caminhão" ?
                            <div className="row mt-4">
                                <div className="col-12 d-flex justify-content-between">
                                    <div className="col-6 pe-3">
                                        <label htmlFor="email" className="form-label text-white fs-3">< FontAwesomeIcon icon={faGasPump} /> Qual o combustível utilizado?</label>
                                        <select name="combustivel" id="combustivel" className="form-select fs-4 p-3" value={combustivel} onChange={(e) => setCombustivel(e.target.value)}>
                                            <option value="" disabled>Selecione</option>
                                            <option value="gasolina">Gasolina</option>
                                            <option value="etanol">Etanol (Álcool)</option>
                                            <option value="diesel">Diesel</option>
                                            <option value="gnv">Gás Natural Veicular (GNV)</option>
                                            <option value="eletrico">Elétrico</option>
                                        </select>
                                    </div>

                                    <div className="col-6 ps-3">
                                        {combustivel !== "" &&
                                            <>
                                                <label htmlFor="email" className="form-label text-white fs-3"><FontAwesomeIcon icon={faCalendar} /> Qual é o ano do veículo?</label>
                                                <select name="anoVeiculo" id="anoVeiculo" className="form-select fs-4 p-3" value={anoVeiculo} onChange={(e) => setAnoVeiculo(e.target.value)}>
                                                    <option value="" disabled>Selecione</option>
                                                    <option value="naoInformado" className="fst-italic">Não sei informar</option>
                                                    {yearsList.map((year, index) => (
                                                        <option key={index} value={year}>{year}</option>
                                                    ))}
                                                </select>
                                            </>
                                        }
                                    </div>
                                </div>
                            </div>
                            :
                            null
                    }

                    {
                        deslocamento === "avião" ?
                            <>
                                <div className="row mt-4">
                                    <div className="col-12 d-flex justify-content-between">
                                        <div className="col-6 d-flex flex-column pe-3">
                                            <label htmlFor="aeroportoOrigem" className="form-label text-white"><FontAwesomeIcon icon={faPlaneDeparture} /> Aeroporto de origem:</label>
                                            <div className="col-12 d-flex justify-content-between">
                                                <div className="col-10">
                                                    <select className="form-select fs-4 p-3" id="aeroportoOrigem" value={aeroportoOrigem} onFocus={() => handleFocus("aeroportoOrigem")} onChange={handleChangeAeroporto}>
                                                        <option value="" disabled>Selecione</option>
                                                        {aeroportos.airports.map((airports, index) => (
                                                            <option key={index} value={airports}>
                                                                {airports}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="col-2 d-flex justify-content-end align-items-end">
                                                    <button className={"btn btn-outline-light fs-4 p-3"} onClick={() => { handleShowModalAeroporto(), setButtonSearchClicked("aeroportoOrigem") }}><FontAwesomeIcon icon={faSearch} /></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-6 d-flex flex-column ps-3">
                                            {aeroportoOrigem !== "" &&
                                                <>
                                                    <label htmlFor="aeroportoDestino" className="form-label text-white"><FontAwesomeIcon icon={faPlaneArrival} /> Aeroporto de destino:</label>
                                                    <div className="col-12 d-flex justify-content-between">
                                                        <div className="col-10">
                                                            <select className="form-select fs-4 p-3" id="aeroportoDestino" value={aeroportoDestino} onFocus={() => handleFocus("aeroportoDestino")} onChange={handleChangeAeroporto}>
                                                                <option value="" disabled>Selecione</option>
                                                                {aeroportos.airports.map((airports, index) => (
                                                                    <option key={index} value={airports}>
                                                                        {airports}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="col-2 d-flex justify-content-end align-items-end">
                                                            <button className={"btn btn-outline-light fs-4 p-3"} onClick={() => { handleShowModalAeroporto(), setButtonSearchClicked("aeroportoDestino") }}><FontAwesomeIcon icon={faSearch} /></button>
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                        </div>

                                        <>
                                            <Modal show={showModalAeroporto} onHide={handleCloseModalAeroporto} size="xl" className="fs-4">
                                                <Modal.Header closeButton className="">
                                                    <Modal.Title>
                                                        {buttonSearchClicked === "aeroportoOrigem" ?
                                                            <span><FontAwesomeIcon icon={faPlaneDeparture} /> Buscar Aeroporto de Origem</span>
                                                            :
                                                            <span> <FontAwesomeIcon icon={faPlaneArrival} /> Buscar Aeroporto de Destino</span>}</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body className="bg-light">
                                                    <div className="col-12">
                                                        <div className="row mt-3">
                                                            <div className="col-12">
                                                                <input
                                                                    className="form-control fs-4 p-3 mt-3"
                                                                    type="text"
                                                                    id="aeroportoSelecionado"
                                                                    autoComplete="off"
                                                                    placeholder="Toque aqui para pesquisar um aeroporto..."
                                                                    onChange={handlePesquisarAeroporto}
                                                                    value={buttonSearchClicked === "aeroportoOrigem" ? aeroportoOrigem : aeroportoDestino}
                                                                    onFocus={() => handleFocus(buttonSearchClicked === "aeroportoOrigem" ? "aeroportoOrigem" : "aeroportoDestino")}
                                                                />
                                                                {focusedInput === "aeroportoDestino" || focusedInput === "aeroportoOrigem" ? (
                                                                    <div className=" mt-1 col-12 bg-white rounded shadow border border-1" style={{ zIndex: 999, minHeight: 150, maxHeight: 150, overflow: "auto" }}>
                                                                        {(focusedInput === "aeroportoDestino" && aeroportoDestino.length > 0) ||
                                                                            (focusedInput === "aeroportoOrigem" && aeroportoOrigem.length > 0) ?
                                                                            <ul className="p-3">
                                                                                {filtroAeroportos.map((airport, index) => (
                                                                                    <li key={index} onClick={() => selecionarAeroporto(airport)} className="p-1 cursor-pointer border-bottom border-2">
                                                                                        {airport}
                                                                                    </li>
                                                                                ))}
                                                                            </ul>
                                                                            :
                                                                            <div className="p-3 text-center d-flex justify-content-center align-items-center h-100 fst-italic" style={{ minHeight: 140 }}>
                                                                                Digite o nome de um aeroporto para exibir as sugestões
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                ) :
                                                                    null
                                                                }
                                                            </div>
                                                        </div>
                                                        {
                                                            focusedInput === "aeroportoDestino" || focusedInput === "aeroportoOrigem" ?
                                                                <div className="position-relative virtual-keyboard-container">
                                                                    <VirtualKeyboard
                                                                        focusedInput={focusedInput}
                                                                        handleFocus={handleFocus}
                                                                        handleInputChange={handleInputChange}
                                                                        inputText={buttonSearchClicked === "aeroportoOrigem" ? aeroportoOrigem : aeroportoDestino}
                                                                    />
                                                                </div>
                                                                :
                                                                null
                                                        }
                                                    </div>
                                                </Modal.Body>
                                                <Modal.Footer className="align-items-center justify-content-center">
                                                    <button className="btn btn-dark fs-4 px-3" variant="light" onClick={handleCloseModalAeroporto}>
                                                        Ok
                                                    </button>
                                                </Modal.Footer>
                                            </Modal>
                                        </>
                                    </div>
                                </div>
                                <div>

                                </div>
                                {/* <div className="row mt-4">
                                    <div className="col-12">
                                        <label htmlFor="deslocamentoAeroporto" className="form-label text-white">Como se deslocou do aeroporto até o local do evento?</label>
                                    </div>
                                </div> */}
                            </>
                            :
                            null
                    }

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
                            <img src="/assets/AKVO.png" alt="" width={500} />
                        </div>
                        {!loading ?
                            <>
                                <div className="col-12 d-flex flex-column gap-4 justify-content-center align-items-center" style={{ height: "35vh" }}>
                                    <div className="col-12" >
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
                                <div className="col-12 text-secondary text-center fs-6">

                                    <div><strong className="fs-5">Aviso de Privacidade:</strong><br /> Os dados fornecidos neste formulário, incluindo nome, e-mail, empresa, telefone, cidade, estado, forma de deslocamento, combustível utilizado e ano do veículo, são coletados para fins de cálculo de emissão de gases de efeito estufa e para futuros contatos comerciais relacionados aos nossos produtos e serviços. Garantimos que seus dados serão tratados com sigilo e segurança, de acordo com a Lei Geral de Proteção de Dados (LGPD) do Brasil.</div>
                                    <div>Ao tocar no botão <i><b>"Calcular"</b></i>, você concorda com a coleta e o processamento dos seus dados conforme descrito acima.</div>
                                </div>
                            </>
                            :
                            <div className="row" style={{ height: "40vh" }}>
                                <div className="col-12 d-flex flex-column gap-4 justify-content-center align-items-center">

                                    <h1 className="fs-1 text-center text-light">Aguarde,<br />estamos calculando as emissões</h1>
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
                            <img src="/assets/AKVO.png" alt="" width={500} />
                        </div>
                        {loading ? (
                            <div className="col-12 d-flex justify-content-center align-items-center" style={{ height: "550px" }}>
                                {/* <div className="spinner-border text-light" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div> */}
                                <div className="custom-loader"></div>
                            </div>
                        ) : (
                            distancia !== null && distancia !== "NaN" ? (
                                <div className="col-12 d-flex flex-column justify-content-center align-items-center" style={{ height: "550px" }}>
                                    <div className="col-12 d-flex">
                                        <div className="col-6 d-flex flex-column justify-content-center align-items-center">
                                            <h1 className="text-light text-center fw-bold fs-1">{name},</h1>
                                            <h1 className="text-light text-center fs-3">seu deslocamento {deslocamento === "outro" || deslocamento === "" ? "" : `de ${deslocamento}`} até o evento foi de aproximadamente</h1>
                                            <h1 htmlFor="name" className="fs-1 text-center text-light">
                                                {distancia + " Km"}
                                            </h1>
                                        </div>
                                        {deslocamento === "bicicleta" ?
                                            <div className="col-6 d-flex flex-column justify-content-center align-items-center text-center">
                                                <span className="text-light text-center">Como este é um meio de transporte limpo, as emissões referentes ao seu deslocamento foram de</span>
                                                <span className="homeDataCollectTitle m-0">0</span>
                                                <span className="text-light">Kg/CO₂e</span>
                                            </div>
                                            :
                                            <div className="col-6 d-flex flex-column justify-content-center align-items-center">
                                                <span className="text-light text-center">Em termos de emissões, isso equivale a</span>
                                                <span className="homeDataCollectTitle m-0">{emissoes.toLocaleString("pt-BR", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
                                                <span className="text-light">Kg/CO₂e</span>
                                            </div>
                                        }
                                    </div>
                                    <div className="col-12 d-flex justify-content-center align-items-end my-3">
                                        {deslocamento !== "bicicleta" &&
                                            <div className="col-10">

                                                <p className="text-light fs-4 text-center">As emissoes referentes ao seu deslocamento  foram contabilizadas e serão compensadas pela organização do evento por meio da compra de créditos de carbono!</p>
                                            </div>
                                        }
                                        <div className="col-2 d-flex justify-content-center align-self-center">

                                            <button type="button" className="btn btn-outline-light">Saiba mais!</button>
                                        </div>
                                    </div>
                                    <button type="button" className="btn btn-light fs-2 p-3 col-6" onClick={() => { resetData() }}>Finalizar</button>
                                </div>
                            ) : (
                                <div className="col-12 d-flex flex-column justify-content-center align-items-center" style={{ height: "550px" }}>
                                    <h1 className="text-light text-center fs-1">Infelizmente não foi possível<br />realizar o cálculo de emissões.</h1>
                                    <p className="text-light text-center mt-5">Não foram encontrados dados de <br /> distância para este trajeto.</p>
                                    <button type="button" className="btn btn-light fs-2 p-3 col-6 mt-5" onClick={() => { resetData() }}>Finalizar</button>
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
        <div className="backgroundAkvo">
            {!isMobile() ?
                <>
                    <div className="col-12 d-flex justify-content-start" >
                        <Link href="/" >
                            <FontAwesomeIcon icon={faHome} className="homeButton" />
                        </Link>
                    </div>
                    <div className="row justify-content-center">
                        <div className="row justify-content-center pages align-items-center">
                            <div className="pageContent d-flex flex-column justify-content-center">
                                <SliderCarousel slides={slides} slideNumber={slideNumber} />
                            </div>
                        </div>
                    </div>
                </>
                :
                <>
                    <div className="row justify-content-center">
                        <div className="row justify-content-center pages align-items-center">
                            <div className="pageContent d-flex flex-column justify-content-center">
                                <div className="col-12 d-flex justify-content-center">
                                    <img src="/assets/AKVO.png" alt="" className="akvo-logo-carousel" />
                                </div>
                                <div className="row redes-akvo mt-5">
                                    <div className="col-12 d-flex justify-content-center text-light text-center">
                                        <div className="col-2"><a href="https://www.instagram.com/akvoesg" target={"_blank"}> <img src="/assets/igImg.png" alt="" width={40} /> </a></div>
                                        <div className="col-2"><a href="https://www.linkedin.com/company/akvoesg/?originalSubdomain=br" target={"_blank"}> <img src="/assets/linkedinImg.png" alt="" width={40} /> </a></div>
                                        <div className="col-2"><a href="https://api.whatsapp.com/send?phone=555433214217" target={"_blank"}> <img src="/assets/wppImg.png" alt="" width={40} /> </a></div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <Link
                                        href="/dataCollectConsultant"
                                        className="btn btn-outline-light fs-5 my-5 glow-button"
                                        onClick={() => {
                                            {
                                                setConsultor(true);
                                                // handleChangeSlide("+");
                                            }
                                        }}
                                        style={{ width: "60%" }}>
                                        Quero ser um Consultor AKVO!
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }

        </div>
    );
}
