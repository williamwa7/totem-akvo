'use client'
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";
import VirtualKeyboard from "../components/virtualKeyboard";


export default function Presentation() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const password = "eugenia";
    const [passwordInput, setPasswordInput] = useState('');
    const [acessGranted, setAcessGranted] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [focusedInput, setFocusedInput] = useState("");
    const [dataReceived, setDataReceived] = useState(false);
    const ultimoDado = data[data.length - 1]?.id;

    useEffect(() => {
        // Função para buscar os dados da API
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/getDataForm');
                const jsonData = await response.json();
                setData(jsonData);
                setDataReceived(true);
            } catch (error) {
                console.error('Erro ao buscar os dados:', error);
                setDataReceived(false);
            }
            setLoading(false);
        };
        // Chama a função para buscar os dados quando o componente é montado
        fetchData();
    }, []);

    const handleInputChange = (value) => {
        setPasswordInput(value);
    };

    const handleFocus = (inputId) => {
        setFocusedInput(inputId);
    };

    const handleVerifyPassword = () => {
        setErrorMessage(null);
        if (passwordInput === password) {
            setAcessGranted(true);
        } else {
            setAcessGranted(false);
            setPasswordInput('');
            setFocusedInput('passwordInput');
            setErrorMessage('Senha incorreta');
        }
    }


    const formatarData = (timestamp) => {
        // Crie um objeto Date a partir do timestamp (em milissegundos)
        const data = new Date(parseInt(timestamp));

        // Extraia os componentes da data
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0'); // O mês é indexado em zero, então adicionamos 1
        const ano = data.getFullYear();
        const horas = String(data.getHours()).padStart(2, '0');
        const minutos = String(data.getMinutes()).padStart(2, '0');

        // Retorne a data formatada no formato desejado
        return `${dia}/${mes}/${ano} - ${horas}:${minutos}`;
    };

    const dataFormatada = formatarData(ultimoDado);



    return (
        <div className="backgroundAkvo">
            <div className="col-12 d-flex justify-content-start" >
                <Link href="/" >
                    <FontAwesomeIcon icon={faHome} className="homeButton" />
                </Link>
            </div>

            <div className="row justify-content-center">
                <div className="row justify-content-center pages align-items-center">
                    {loading ?
                        <div className="col-12 fs-6 text-light text-center">
                            <h1>Aguarde, <br />carregando os dados!</h1>
                            <div className="mt-4 spinner-border text-light" role="status">
                                <span className="visually-hidden fs-1">Loading...</span>
                            </div>

                        </div>
                        :
                        <div className="row justify-content-center">
                            {!acessGranted ?
                                <div className="col-12 text-center d-flex flex-column justify-content-center align-items-center">
                                    <h1 className="fs-3 text-center text-light">Insira a senha para exibir os dados</h1>
                                    <input
                                        type="text"
                                        className="form-control fs-5 p-3"
                                        id="passwordInput"
                                        value={passwordInput.replace(/./g, '●')}
                                        onChange={(e) => setPasswordInput(e.target.value)}
                                        onFocus={() => handleFocus("passwordInput")}
                                        autoComplete="off"
                                        placeholder="Toque aqui para inserir a senha"
                                        style={{ maxWidth: '350px' }}
                                        required
                                    />
                                    {errorMessage && <p id="errorMsgPassword" className="shake-text text-danger fs-4">{errorMessage}</p>}
                                    {
                                        focusedInput === "passwordInput" ?
                                            <VirtualKeyboard
                                                focusedInput={focusedInput}
                                                handleFocus={handleFocus}
                                                handleInputChange={handleInputChange}
                                                inputText={''}
                                            />
                                            :
                                            null
                                    }
                                    <button className="btn btn-light mt-3 p-3 fs-5 fw-bold" onClick={handleVerifyPassword}>Acessar</button>
                                </div>
                                :
                                <div div className="col-12 fs-5 text-light">
                                    <h1 className="text-center">Dados Coletados</h1>
                                    <div className="col-12" style={{ maxHeight: '500px', overflow: 'auto' }}>
                                        <div style={{ overflowY: 'auto', maxHeight: '100%' }}>
                                            <table className="text-center table table-hover table-striped dataTable mt-3">
                                                <thead className="table-dark">
                                                    <tr>
                                                        <th>Nome</th>
                                                        <th>E-mail</th>
                                                        <th>Deslocamento</th>
                                                        <th>Combustível</th>
                                                        <th>Ano do Veículo</th>
                                                        <th>Origem</th>
                                                        <th>Distância</th>
                                                    </tr>
                                                </thead>
                                                <tbody >
                                                    {dataReceived ? data.map(item => (
                                                        <tr key={item.id} >
                                                            <td>{item.name}</td>
                                                            <td>{item.email}</td>
                                                            <td>{item.deslocamento}</td>
                                                            <td>{item.combustivel}</td>
                                                            <td>{item.anoVeiculo}</td>
                                                            <td>{item.origem}</td>
                                                            <td>{`${item.distancia.replace('.', ',')} Km`}</td>
                                                        </tr>
                                                    )) :
                                                        <tr className="text-light fs-5">
                                                            <td colSpan="4" className="py-4 text-danger fw-bold">Ocorreu um problema ao carregar os dados,<br /> recarregue a página e tente novamente.</td>
                                                        </tr>
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-12 d-flex flex-column justify-content-end">
                                            {dataReceived &&
                                                <>
                                                    <p className="fst-italic text-secondary">Total de registros: <strong>{data.length}</strong></p>
                                                    {data.length > 0 &&
                                                        <p className="fst-italic text-secondary">Último dado salvo: <strong>{dataFormatada}</strong></p>
                                                    }
                                                </>
                                            }
                                        </div>
                                    </div>

                                </div>
                            }
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}