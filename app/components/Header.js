import { estadoSesion } from "../helpers/firebase.js";
import { BtnCerrarSesion } from "./BtnCerrarSesion.js";

export class Header extends HTMLElement {
    constructor() {
        super();
        const container = document.createElement('div');
        
        // añade un id al elemento div
        container.id = 'header-container';
        
        // Añade el contenido del componente al elemento div
        container.innerHTML = /*html*/`
        <nav class="navbar navbar-expand-lg bg-body-tertiary bg-dark" data-bs-theme="dark">
            <div class="container-fluid">
                <a class="navbar-brand" href="#/home">Innovacenter</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link" data-url="#/ventas" href="#/ventas">Ventas</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-url="#/pagos" href="#/pagos">Pagos</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-url="#/stecnico" href="#/stecnico">Servicio Tecnico</a>
                    </li>

                    ${window.isAdmin ? /*html*/`
                        <li class="nav-item">
                            <a class="nav-link" data-url="#/inventario" href="#/inventario">Inventario</a>
                        </li>
                        ` 
                        : ''
                    }
                    ${window.isAdmin ? /*html*/`
                        <li class="nav-item">
                            <a class="nav-link" data-url="#/clientes" href="#/clientes">Clientes</a>
                        </li>
                        ` 
                        : ''
                    }
                    
                    
                    <li class="nav-item">
                        <a class="nav-link" data-url="#/prestamos" href="#/prestamos">Prestamos</a>
                    </li>
                    
                    <li class="nav-item">
                    <a class="nav-link disabled">Disabled</a>
                    </li>
                </ul>
                <form class="d-flex" role="search">
                    <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                    <button class="btn btn-outline-success" type="submit">Search</button>
                </form>
                <ul class="navbar-nav">
                <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        ${estadoSesion.email.split('@')[0].toUpperCase()}
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end">
                    ${window.isAdmin ? /*html*/`
                        <li><a class="dropdown-item" href="#/usuarios">Usuarios</a></li>
                        ` : ''
                    }
                        <li><a class="dropdown-item" href="#/configuracion">Configuracion</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><btn-cerrar-sesion></btn-cerrar-sesion></li>
                    </ul>
                    </li>
                </ul>
                </div>
            </div>
        </nav>
        `;
        this.appendChild(container);
    }

    connectedCallback() {
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach((navLink) => {
            const url = navLink.getAttribute('data-url');
            if (window.location.hash === url) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        });

    }
}
customElements.define('header-element', Header);