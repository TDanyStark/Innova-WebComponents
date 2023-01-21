import { listServicioTecnico } from "./ListServicioTecnico.js";
export class ServicioTecnico extends HTMLElement {
    constructor() {
        super();
        // bind 
        const container = document.createElement('div');
        container.id = 'servicioTecnico-container';
        container.innerHTML = /*html*/`
            <header-element></header-element>
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <h1 class="text-center" style="cursor:pointer; color:#fff;">Servicio Tecnico</h1>
                    </div>
                    <div id="listServicioTecnico" class="col-12">
                        <list-servicio-tecnico-element></list-servicio-tecnico-element>
                    </div>
                </div>
            </div>
            `;
        this.appendChild(container);
    }
}

customElements.define('servicio-tecnico-element', ServicioTecnico);