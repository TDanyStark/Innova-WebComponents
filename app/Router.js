import { Login } from "./components/Login.js";
import { Counter } from "./components/Counter.js";
import { Home } from "./components/Home.js";
import { Ventas } from "./components/Ventas.js";
import { estadoSesion, Admin } from "./helpers/firebase.js";


export async function Router(){
    const $root = document.getElementById('root');
    let {hash} = location;
    console.log(hash);

    // let esAdmin = await Admin();

    if(estadoSesion == false && hash != '#/login'){
        console.log('estadoSesion: ' + estadoSesion)
        hash = '#/login';
        location.hash = hash;
        return;
    }else if(estadoSesion == null){
        setTimeout(() => {
            Router();
        }, 250);
        return;
    }else if (location.hash == "#/login" && estadoSesion != false) {
        location.hash = "#/home";
        return;
    }

    window.isAdmin = false;
    if (estadoSesion.uid) {
        window.isAdmin = await Admin(estadoSesion.uid);
    }
    console.log(window.isAdmin)
    if(hash === '#/home'){
        $root.innerHTML = '<home-element></home-element>';
    } else if(hash.includes('#/ventas')){
        $root.innerHTML = '<ventas-element></ventas-element>';
    } else if(hash === '#/login'){
        console.log('login here');
        $root.innerHTML = '<login-element></login-element>';
    } else {
        $root.innerHTML = '<h1>Ruta no disponible</h1>';
    }
}
