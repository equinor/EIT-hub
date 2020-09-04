import shuttle from "../../apps/shuttle/public/index";

function main() {
    const eitMain = document.getElementsByTagName("eit-main")[0];
    eitMain.appendChild(shuttle());
}

main();