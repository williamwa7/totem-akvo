export default function isMobile() {
	if (typeof window !== "undefined" && window.innerWidth < 820) {
		return true;
	} else {
		return false;
	}
}
