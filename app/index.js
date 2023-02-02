import { App } from './app.js';
import { Router } from './Router.js';

window.hashDisponibles = ["#/login", "#/inicio", "#/ventas", "#/inventario", "#/clientes", "#/pedidos", "#/usuarios", "#/prestamos", "#/stecnico", "#/pagos"];

document.addEventListener("DOMContentLoaded", App);
window.addEventListener("popstate", Router);
// window.addEventListener("hashchange", Router);
// cuando se cierra la página, guardamos la URL actual en el almacenamiento local
