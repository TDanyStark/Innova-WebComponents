import { clienteFound, guardarCliente } from '../helpers/firebase.js';
import { Cliente } from './Cliente.js';
import { ListClientes } from './ListClientes.js';


//TODO: Manejar clientes como pedidos, que no me traiga todos los clientes si no solo el que yo busque
export class Clientes extends HTMLElement {
    constructor() {
        super();

        const container = document.createElement('div');
        container.id = 'cliente-container';
        container.innerHTML = /*html*/`
            <header-element></header-element>
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <h1 class="text-center" style="cursor:pointer; color:#fff;">Clientes</h1>
                        
                    </div>
                    <div id="clienteElement" class="col-12 col-md-4">
                        <cliente-element></cliente-element>
                    </div>
                    <div id="ventaProductoElement" class="col-12 col-md-8">
                        <list-clientes-element></list-clientes-element>
                    </div>
                </div>
            </div>
            `;
        this.appendChild(container);}
}

customElements.define('clientes-element', Clientes);