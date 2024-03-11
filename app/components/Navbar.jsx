import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
    return (
        <>
            <nav className="container-fluid navbar ">
                <div className="row">
                    <div className="col p-3">
                        <img src="/assets/logo1.png" alt="" width={150} />
                    </div>
                    <div className="col p-3">
                        <Link href="/" className="link">Página inicial</Link>
                        <Link href="/dataCollect" className="link">Coleta de dados</Link>
                        <Link href="/presentation" className="link">Apresentação</Link>
                    </div>
                </div>
            </nav>
        </>
    );
}