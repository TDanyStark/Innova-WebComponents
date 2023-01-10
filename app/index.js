import { App } from './app.js';
import { Router } from './Router.js';

window.hashDisponibles = ["#/login", "#/home", "#/ventas", "#/inventario", "#/clientes", "#/proveedores", "#/usuarios", "#/prestamos"];

document.addEventListener("DOMContentLoaded", App);
window.addEventListener("popstate", Router);
// window.addEventListener("hashchange", Router);
// cuando se cierra la página, guardamos la URL actual en el almacenamiento local
