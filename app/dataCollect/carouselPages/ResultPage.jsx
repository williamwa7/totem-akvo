import { useState, useEffect } from "react";

export default function ResultPage({ id }) {

    console.log("id da page:", id);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(null);
    const [distancia, setDistancia] = useState(null);
    
    useEffect(() => {
        fetchData(); // Chame a função fetchData
    }, [id]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/getDataForm');
            const jsonData = await response.json();
            setData(jsonData);
        } catch (error) {
            console.error('Erro ao buscar os dados:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        // Verifica se há dados filtrados e se há uma distância disponível
        if (data.length > 0) {
            const distanciaEncontrada = data.find(item => item.id === id.toString());
            if (distanciaEncontrada) {
                setDistancia(distanciaEncontrada.distancia);
            }
        }
    }, [data, id]);

    console.log("distancia:", distancia);

    return (
        <section>
            <div className="col-12 d-flex flex-column justify-content-center mt-5 align-items-center gap-5">
                <div className="col-12 d-flex justify-content-center">
                    <img src="/assets/AKVO.png" alt="" width={500} />
                </div>
                {loading ? (
                    <div className="col-12 d-flex justify-content-center align-items-center">
                        <div className="spinner-border text-light" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    distancia !== null ? (
                        <div className="col-12 d-flex flex-column justify-content-center align-items-center" style={{ height: "460px" }}>
                            <h1 className="text-light text-center">Seu deslocamento até o evento foi de </h1>
                            <h1 htmlFor="name" className="homeDataCollectTitle">
                                {distancia + " Km"}
                            </h1>
                        </div>
                    ) : (
                        <div className="col-12 d-flex justify-content-center align-items-center">
                            <p className="text-light">Não há dados de distância disponíveis.</p>
                        </div>
                    )
                )}
            </div>
        </section>
    );
}
