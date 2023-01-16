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
                    <div id="inventarioElement" class="col-12 col-md-4">
                        <busqueda-producto-element></busqueda-producto-element>
                    </div>
                    <div id="ventaProductoElement" class="col-12 col-md-8">
                        <list-inventario-element></list-inventario-element>
                    </div>
                </div>
            </div>
            `;
        this.appendChild(container);

    }

}

customElements.define('inventario-element', Inventario);