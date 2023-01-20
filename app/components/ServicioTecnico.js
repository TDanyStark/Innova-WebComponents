
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
                    <div id="clienteElement" class="col-12 col-md-4">
                    </div>
                    <div id="ventaProductoElement" class="col-12 col-md-8">
                    </div>
                </div>
            </div>
            `;
        this.appendChild(container);
    }
}

customElements.define('servicio-tecnico-element', ServicioTecnico);