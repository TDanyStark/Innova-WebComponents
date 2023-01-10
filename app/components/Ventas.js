import { Cliente } from "./Cliente.js";
import { Header } from "./Header.js";
import { VentaProducto } from "./VentaProducto.js";
export class Ventas extends HTMLElement {
    constructor() {
        super();
        // bind clienteFoundHandler
        this.clienteFoundHandler = this.clienteFoundHandler.bind(this);
        const container = document.createElement('div');
        container.id = 'ventas-container';
        container.innerHTML = /*html*/`
            <header-element></header-element>
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <h1 class="text-center" style="cursor:pointer;">Ventas</h1>
                        
                    </div>
                    <div id="clienteElement" class="col-12 col-md-4">
                        <cliente-element></cliente-element>
                    </div>
                    <div id="ventaProductoElement" class="col-12 col-md-8">
                        <venta-producto-element></venta-producto-element>
                    </div>
                </div>
            </div>
        `;
        this.appendChild(container);
    }

    clickHandler() {
        location.reload();
    }

    clienteFoundHandler() {
        if (window.innerWidth < 600) {
            const $clienteElement = this.querySelector('#clienteElement');
            $clienteElement.classList.add('d-none');
            
        }
    }

    ventaRealizadaHandler() {
        if (window.innerWidth < 600) {
            const $clienteElement = this.querySelector('#clienteElement');
            $clienteElement.classList.remove('d-none');
            document.querySelector('.formCliente').classList.remove('was-validated');
        }
    }

    connectedCallback() {
        const $h1 = this.querySelector('h1');
        $h1.addEventListener('click', this.clickHandler);
        document.addEventListener('clienteFound', this.clienteFoundHandler);
        document.addEventListener('ventaRealizada', this.ventaRealizadaHandler)
    }

    disconnectedCallback() {
        const $h1 = this.querySelector('h1');
        $h1.removeEventListener('click', this.clickHandler);
        document.removeEventListener('clienteFound', this.clienteFoundHandler);
        document.removeEventListener('ventaRealizada', this.ventaRealizadaHandler)
    }

}

customElements.define('ventas-element', Ventas);