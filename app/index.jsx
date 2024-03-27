import FullScreenButton from "@/utils/FullScreenButton";
import Image from "next/image";
import Link from "next/link";

export default function Index() {
    return (
        <>
            <div className="container-fluid home-page backgroundAkvo d-flex justify-content-center flex-column align-items-center gap-5">
                <img className="img-fluid mb-5 akvo-logo-carousel" src="/assets/AKVO.png" alt="" />
                {/* <Link href="/" className="btn btn-light ">Página inicial</Link> */}
                <div className="col-12 d-flex flex-column justify-content-center align-items-center gap-5 hide-on-mobile" >
                    <Link href="/dataCollect" className="btn-initial-page btn btn-light text-success fs-1 p-3">Coleta de dados</Link>
                    <Link href="/collectedData" className="btn-initial-page btn btn-light fs-1 p-3">Ver dados coletados</Link>
                    <Link href="/presentation" className="btn-initial-page btn btn-light fs-1 p-3">Apresentação AKVO</Link>
                </div>
                <div className="col-12">
                    <>
                        <div className="row redes-akvo mt-5">
                            <div className="col-12 d-flex justify-content-center text-light text-center">
                                <div className="col-3"><a href="https://www.instagram.com/akvoesg" target={"_blank"}> <img src="/assets/igImg.png" alt="" width={50} /> </a></div>
                                <div className="col-3"><a href="https://www.linkedin.com/company/akvoesg/?originalSubdomain=br" target={"_blank"}> <img src="/assets/linkedinImg.png" alt="" width={50} /> </a></div>
                                <div className="col-3"><a href="https://api.whatsapp.com/send?phone=555433214217" target={"_blank"}> <img src="/assets/wppImg.png" alt="" width={50} /> </a></div>
                            </div>
                        </div>
                    </>
                </div>
                {/* <video src="/assets/video.mp4" autoPlay loop muted className="backgroundAkvo"></video> */}
                <div className="hide-on-mobile">
                    <FullScreenButton />
                </div>

            </div>
        </>
    );
}