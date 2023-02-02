import { clienteFound, guardarCliente } from '../helpers/firebase.js';
import { Cliente } from './Cliente.js';
import { ListClientes } from './ListClientes.js';


export class Clientes extends HTMLElement {
    constructor() {
        super();

        this.resetClienteHandler = this.resetClienteHandler.bind(this);
        this.clienteFoundHandler = this.clienteFoundHandler.bind(this);


        const container = document.createElement('div');
        container.id = 'cliente-container';
        container.innerHTML = /*html*/`
            <header-element></header-element>
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <h1 class="text-center" style="cursor:pointer; color:#fff;">Clientes</h1>
                    </div>
                </div>
                <div class="row">
                    <div id="clienteElement" class="col-12 col-md-4">
                        <cliente-element></cliente-element>
                    </div>
                    <div class="col-12 col-md-8">
                        <div class="row row-cols-auto">
                            <div class="col-12">
                                <button class="btn btn-primary btnVerClientes">Ver Clientes</button>
                            </div>
                            <div class="col-12">
                                <p class="text-white">Para ver todos los clientes dale click en Ver Clientes</p>
                            </div>
                            <div class="col-12 d-none" id="listVerClientes">
                                <list-clientes-element></list-clientes-element>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        this.appendChild(container);
    }

    clienteFoundHandler = (e) => {
        const divListClientes = this.querySelector('#listVerClientes');
        divListClientes.classList.remove('d-none');
    }

    clickHandler = (e) => {
        if(e.target.classList.contains('btnVerClientes')) {
            e.target.disabled = true;
            const divListClientes = this.querySelector('#listVerClientes');
            divListClientes.classList.remove('d-none');
            document.dispatchEvent(new CustomEvent('verClientes'));
        }
    }

    resetClienteHandler = (e) => {
        const btnVerClientes = this.querySelector('.btnVerClientes');
        btnVerClientes.disabled = false;
        const divListClientes = this.querySelector('#listVerClientes');
        divListClientes.classList.add('d-none');
    }

    connectedCallback() {
        document.addEventListener('clienteFound', this.clienteFoundHandler);
        this.addEventListener('click', this.clickHandler);
        document.addEventListener('resetCliente', this.resetClienteHandler);
    }

    disconnectedCallback() {
        document.removeEventListener('clienteFound', this.clienteFoundHandler);
        this.removeEventListener('click', this.clickHandler);
        document.removeEventListener('resetCliente', this.resetClienteHandler);
    }
}

customElements.define('clientes-element', Clientes);