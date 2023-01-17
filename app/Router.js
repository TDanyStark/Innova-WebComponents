import { Login } from "./components/Login.js";
import { Counter } from "./components/Counter.js";
import { Home } from "./components/Home.js";
import { Ventas } from "./components/Ventas.js";
import { Clientes } from "./components/Clientes.js";
import { Inventario } from "./components/Inventario.js";
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
        $root.innerHTML = "";
        $root.innerHTML = '<home-element></home-element>';
    } else if(hash === '#/login'){
        $root.innerHTML = "";
        $root.innerHTML = '<login-element></login-element>';
    } else if(hash.includes('#/ventas')){
        $root.innerHTML = "";
        $root.innerHTML = '<ventas-element></ventas-element>';
    } else if(hash === '#/clientes'){
        if(!window.isAdmin){
            $root.innerHTML = '<h1>Acceso denegado</h1>';
            return;
        }
        $root.innerHTML = "";
        $root.innerHTML = '<clientes-element></clientes-element>';
    } else if(hash === '#/inventario'){
        if(!window.isAdmin){
            $root.innerHTML = '<h1>Acceso denegado</h1>';
            return;
        }
        $root.innerHTML = "";
        $root.innerHTML = '<inventario-element></inventario-element>';
    } else {
        $root.innerHTML = '<h1>Ruta no disponible</h1>';
    }
}
