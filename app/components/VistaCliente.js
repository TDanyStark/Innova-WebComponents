export class VistaCliente extends HTMLElement {
    constructor() {
        super();
        // bind 
        const idCliente = this.getAttribute('idCliente');
        let nombreCliente = this.getAttribute('nombreCliente');
        nombreCliente = nombreCliente.replace('@@', " ");
        const container = document.createElement('div');
        container.id = 'vistaCliente-container';
        container.innerHTML = /*html*/`
            <header-element></header-element>
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <h1 class="text-center" style="cursor:pointer; color:#fff;">Vista Cliente - ${nombreCliente} - ${idCliente} </h1>
                        
                    </div>
                    <div id="asdasdas" class="col-12 col-md-4">
                        <h2 class="text-white">${idCliente}</h2>
                        <h2 class="text-white">${nombreCliente}</h2>

                    </div>
                    
                </div>
            </div>
            `;
        this.appendChild(container);
    }
}

customElements.define('vista-cliente-element', VistaCliente);
