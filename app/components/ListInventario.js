import { obtenerData, eliminarData } from "../helpers/firebase.js";


export class ListInventario extends HTMLElement {
    constructor() {
        super();
        const container = document.createElement('div');
        container.id = 'list-inventario-container';
        container.innerHTML = /*html*/`
            <table class="table table-hover table-dark">
                <thead>
                    <tr>
                        <th scope="col" colspan="3" class="col-sm-3 col-md-3 col-lg-2">Buscar: </th>
                        <th scope="col" colspan="3" class="col-sm-3 col-md-3 col-lg-2"><input type="text" id="input-search-producto"/></th>
                    </tr>
                    <tr>
                        <th scope="col" class="col-sm-3 col-md-3 col-lg-2">ID</th>
                        <th scope="col" class="col-sm-3 col-md-3 col-lg-2">Descripcion</th>
                        <th scope="col" class="col-sm-3 col-md-3 col-lg-2">Cantidad Inventario</th>
                        <th scope="col" class="col-sm-3 col-md-3 col-lg-2">Precio</th>
                        <th scope="col" class="col-sm-3 col-md-3 col-lg-2">Proveedor</th>
                        <th scope="col" class="col-sm-3 col-md-3 col-lg-2">Accion</th>
                    </tr>
                </thead>
                <tbody id="data-table-body">
                    
                </tbody>
            
            </table>
            `;
        this.appendChild(container);

        this.$inputSearchProducto = this.querySelector('#input-search-producto');
        this.$dataTableBody = this.querySelector('#data-table-body');

        this.productos = [];
        this.productosFiltrados = [];

        obtenerData('productos').then((productos) => {
            this.productos = productos;
            console.log(this.productos);
        });

    }

    connectedCallback() {
    }

    disconnectedCallback() {

    }
}

customElements.define('list-inventario-element', ListInventario);