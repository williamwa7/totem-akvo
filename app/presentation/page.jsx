import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function Presentation() {
    return (
        <div className="backgroundAkvo">
            <Link href="/" style={{ position: "absolute", top: 10, left: 10 }}>
                <FontAwesomeIcon icon={faHome} className="homeButton" />
            </Link>

            <div className="row justify-content-center " style={{ height: "100vh" }}>
                    <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/csVYxiv5pGA?si=7CFe1MdETPrjGIx5&autoplay=1&loop=1&playlist=csVYxiv5pGA"
                        title="YouTube video player"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                    ></iframe>

                <div className="row justify-content-center pages align-items-center">

                    <div className="pageContent d-flex flex-column justify-content-center align-items-center">
                        {/* <img className="img-fluid mb-5" src="/assets/AKVO.png" alt="" width={600} /> */}

                        {/* <h1 className="fs-1 text-center text-light">Página com conteúdos de apresentação da AKVO</h1> */}

                        {/* <video src="/assets/video3.mp4" autoPlay loop muted className="backgroundAkvo"></video> */}

                    </div>
                </div>
            </div>
        </div>
    );
}