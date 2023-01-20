import { Cliente } from "./Cliente.js";
import { Header } from "./Header.js";
import { VentaProducto } from "./VentaProducto.js";
import { ModalSaveProduct } from "./ModalSaveProduct.js";
import { ModalServicioTecnico } from "./ModalServicioTecnico.js";

export class Ventas extends HTMLElement {
    constructor() {
        super();
        // bind clienteFoundHandler
        this.clienteFoundHandler = this.clienteFoundHandler.bind(this);
        const container = document.createElement('div');
        container.id = 'ventas-container';
        container.innerHTML = /*html*/`
            <header-element></header-element>
            <modal-save-product-element></modal-save-product-element>
            <modal-servicio-tecnico></modal-servicio-tecnico>
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <h1 id="title" class="text-center" style="cursor:pointer; color:#fff;">Ventas</h1>
                        
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

    clickHandler(e) {
        //comprobar si se hace click en el h1
        if(e.target.id !== 'title') return;
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
        this.addEventListener('click', this.clickHandler);
        document.addEventListener('clienteFound', this.clienteFoundHandler);
        document.addEventListener('ventaRealizada', this.ventaRealizadaHandler)
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.clickHandler);
        document.removeEventListener('clienteFound', this.clienteFoundHandler);
        document.removeEventListener('ventaRealizada', this.ventaRealizadaHandler)
    }

}

customElements.define('ventas-element', Ventas);