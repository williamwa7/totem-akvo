export default function baseUrl() {
    const inDevelopment = window.location.hostname === "localhost";
    console.log("inDevelopment", inDevelopment);
    return inDevelopment
        ? "http://localhost:3000"
        : "https://totem-akvo.vercel.app/";
}