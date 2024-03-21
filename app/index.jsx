import Image from "next/image";
import Link from "next/link";

export default function Index() {
    return (
        <>
            <div className="container-fluid home-page backgroundAkvo d-flex justify-content-center flex-column align-items-center gap-5">
                <img className="img-fluid mb-5" src="/assets/AKVO.png" alt="" width={600} />
                {/* <Link href="/" className="btn btn-light ">Página inicial</Link> */}
                <Link href="/dataCollect" className="btn-initial-page btn btn-light text-success fs-1 p-3">Coleta de dados</Link>
                <Link href="/collectedData" className="btn-initial-page btn btn-light fs-1 p-3">Ver dados coletados</Link>
                <Link href="/presentation" className="btn-initial-page btn btn-light fs-1 p-3">Apresentação AKVO</Link>
                {/* <video src="/assets/video.mp4" autoPlay loop muted className="backgroundAkvo"></video> */}
            </div>
        </>
    );
}