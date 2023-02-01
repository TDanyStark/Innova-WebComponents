import { estadoSesion } from "./helpers/firebase.js";
import { Router } from "./Router.js";



export async function App(){
    if (estadoSesion == null) {
        setTimeout(() => {
            App();
        }, 250);
        return;
    }

    if (location.hash == "#/login" && estadoSesion != false) {
        location.hash = "#/home";
    }

    let lastHash = location.hash
    // comprobar si el lastHash se encuentra en window.hashDisponibles
    if (!window.hashDisponibles.includes(lastHash)) {
        location.hash = "#/login";
        return;
    }

    Router();

}
