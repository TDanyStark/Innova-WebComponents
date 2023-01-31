import { App } from './app.js';
import { Router } from './Router.js';

window.hashDisponibles = ["#/login", "#/home", "#/ventas", "#/inventario", "#/clientes", "#/pedidos", "#/usuarios", "#/prestamos", "#/stecnico"];

document.addEventListener("DOMContentLoaded", App);
window.addEventListener("popstate", Router);
// window.addEventListener("hashchange", Router);
// cuando se cierra la página, guardamos la URL actual en el almacenamiento local
