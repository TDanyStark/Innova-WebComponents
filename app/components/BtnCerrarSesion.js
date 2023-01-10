import { CerrarSesion } from "../helpers/firebase.js";

export class BtnCerrarSesion extends HTMLElement {
    constructor() {
        super();
        const container = document.createElement('div');
        container.id = 'btn-cerrar-sesion-container';
        container.innerHTML = /*html*/`
        <button id="btn-cerrar-sesion-desk" class="btn btn-outline-danger my-2" style="margin:10px;" type="submit">Cerrar sesión</button>
        `;
        this.appendChild(container);
    }

    connectedCallback() {
        function cbSuccess() {
            location.hash = '#/login';
        }
        function cbError() {
            console.log('error session');
        }

        const btnCerrarSesionDesk = this.querySelector('#btn-cerrar-sesion-desk');
        btnCerrarSesionDesk.addEventListener('click', () => {
            CerrarSesion(cbSuccess, cbError);
        });
    }

    disconnectedCallback() {
        function cbSuccess() {
            location.hash = '#/login';
        }
        function cbError() {
            console.log('error');
        }

        const btnCerrarSesionDesk = this.querySelector('#btn-cerrar-sesion-desk');
        btnCerrarSesionDesk.removeEventListener('click', () => {
            CerrarSesion(cbSuccess, cbError);
        });
    }

}
customElements.define('btn-cerrar-sesion', BtnCerrarSesion);