import { obtenerData } from "../helpers/firebase.js";
import { BusquedaProducto } from "./BusquedaProducto.js";
import { Header } from "./Header.js";
import { ListInventario } from "./ListInventario.js";
import { ModalSaveProduct } from "./ModalSaveProduct.js";

export class Inventario extends HTMLElement {
    constructor() {
        super();
        // bind 
        const container = document.createElement('div');
        container.id = 'inventario-container';
        container.innerHTML = /*html*/`
            <header-element></header-element>
            <modal-save-product-element></modal-save-product-element>
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <h1 class="text-center" style="cursor:pointer; color:#fff;">Inventario</h1>
                    </div>
                </div>
                <div class="row">
                    <div id="inventarioElement" class="col-12 col-md-4">
                        <busqueda-producto-element></busqueda-producto-element>
                    </div>
                    <div id="ventaProductoElement" class="col-12 col-md-8">
                        <div class="row">
                            <div class="col-12">
                                <button class="btn btn-primary" id="verInventario">Ver Inventario</button>
                            </div>
                        </div>
                        <p class="text-white">Para ver todos los productos en el inventario dale click en Ver Inventario</p>
                        <div class="row">
                            <div class="col-12 d-none" id="listInventario">
                                <list-inventario-element></list-inventario-element>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        this.appendChild(container);

        this.btnVerInventario = this.querySelector('#verInventario');
        this.$listInventario = this.querySelector('#listInventario');

    }

    clickHandler = async (e) => {
        if (e.target.id === 'verInventario') {
            this.$listInventario.classList.remove('d-none');
            document.dispatchEvent(new CustomEvent('verInventario'));
        }
    }

    productoFoundHandler = (e) => {
        this.$listInventario.classList.remove('d-none');
    }

    connectedCallback() {
        document.addEventListener('productoFound', this.productoFoundHandler);
        this.addEventListener('click', this.clickHandler);
    }

    disconnectedCallback() {
        document.removeEventListener('productoFound', this.productoFoundHandler);
        this.removeEventListener('click', this.clickHandler);
    }

}

customElements.define('inventario-element', Inventario);