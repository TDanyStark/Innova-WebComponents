import { obtenerData, eliminarData } from "../helpers/firebase.js";

export class ListClientes extends HTMLElement {
    constructor() {
        super();
        //bind generateRows
        this.generateRows = this.generateRows.bind(this);
        //bind generatePagination
        this.generatePaginationControls = this.generatePaginationControls.bind(this);
        this.searchTable = this.searchTable.bind(this);
        this.clienteFoundHandler = this.clienteFoundHandler.bind(this);
        this.clickHandler = this.clickHandler.bind(this);

        const container = document.createElement('div');
        container.id = 'list-cliente-container';
        container.innerHTML = /*html*/`
            <table class="table table-hover table-dark">
                <thead>
                <tr>
                <th scope="col" colspan="1" class="col-sm-3 col-md-3 col-lg-2">Buscar: </th>
                <th scope="col" colspan="2" class="col-sm-3 col-md-3 col-lg-2"><input type="text" id="input-search-cliente"/></th>
                </tr>
                <tr>
                <th scope="col" class="col-sm-3 col-md-3 col-lg-2">ID</th>
                <th scope="col" class="col-sm-3 col-md-3 col-lg-2">Nombre</th>
                <th scope="col" class="col-sm-3 col-md-3 col-lg-2">Accion</th>
                </tr>
            </thead>
            <tbody id="data-table-body">
                
            </tbody>
                
            </table>
            <div id="pagination-controls">
                <button id="prev-page-btn">Anterior</button>
                <select id="page-select"></select>
                <button id="next-page-btn">Siguiente</button>
                </div>
            `;
        this.appendChild(container);
        this.$prevPageBtn = this.querySelector('#prev-page-btn');
        this.$nextPageBtn = this.querySelector('#next-page-btn');
        this.$pageSelect = this.querySelector('#page-select');
        this.$inputSearchCliente = this.querySelector('#input-search-cliente');
        this.$dataTbody = this.querySelector('#data-table-body');

        this.isBusqueda = false;
        this.rowsPerPage = 5;
        this.currentPage = 1;
        this.filterClientes = [];
        this.clientes = [];
        obtenerData('clientes').then((clientes) => {
            this.clientes = clientes;
            this.generateRows(this.clientes, this.rowsPerPage);
            this.generatePaginationControls(this.clientes, this.rowsPerPage);
        });
    }

    generateRows(data, rowsPerPage) {
        console.log(data)
        // obtener los registros de la página actual
        const startIndex = (this.currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const currentPageData = data.slice(startIndex, endIndex);

        // vaciar el cuerpo de la tabla
        const tableBody = document.querySelector('#data-table-body');
        tableBody.innerHTML = '';

        // generar las filas
        currentPageData.forEach((cliente) => {
            const tr = document.createElement('tr');
            tr.innerHTML = /*html*/`
                <td>${cliente.id}</td>
                <td>${cliente.nombre}</td>
                <td>
                    <a class="btn btn-success" href="#/cliente/${cliente.id}/${cliente.nombre.replace(" ", '@@')}" id="btnVerCliente" data-cliente="${cliente.id}"><i title="ver cliente" class="fa-solid fa-eye"></i></a>
                    <button class="btn btn-danger" id="btnEliminarCliente" data-cliente="${cliente.id}"><i data-cliente="${cliente.id}"  class="fa fa-trash"></i></button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    generatePaginationControls(data, rowsPerPage) {
        const pageSelect = document.querySelector('#page-select');
        pageSelect.innerHTML = '';

        // calcular el número total de páginas
        const totalPages = Math.ceil(data.length / rowsPerPage);
        if (totalPages === 1) {
            this.$prevPageBtn.style.display = 'none';
            this.$nextPageBtn.style.display = 'none';
            this.$pageSelect.style.display = 'none';
            return;
        }
        this.$prevPageBtn.style.display = '';
        this.$nextPageBtn.style.display = '';
        this.$pageSelect.style.display = '';

        // generar las opciones del menú desplegable
        for (let i = 1; i <= totalPages; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.text = i;
            pageSelect.appendChild(option);
        }

        // seleccionar la página actual en el menú desplegable
        pageSelect.value = this.currentPage;
    }

    searchTable(e) {
        if (e.target.value === '') {
            this.isBusqueda = false;
            this.generateRows(this.clientes, this.rowsPerPage);
            this.generatePaginationControls(this.clientes, this.rowsPerPage);
            return;
        }
        this.filterClientes = [];
        const filter = e.target.value.toUpperCase();
        this.clientes.forEach((cliente) => {
            if (cliente.nombre.toUpperCase().indexOf(filter) > -1 || cliente.id.toUpperCase().indexOf(filter) > -1) {
                this.filterClientes.push(cliente);
            }
        });

        this.currentPage = 1; // cada vez que se busque, se regresa a la página 1
        this.generateRows(this.filterClientes, this.rowsPerPage);
        this.generatePaginationControls(this.filterClientes, this.rowsPerPage);
        this.isBusqueda = true;
    }

    async clienteFoundHandler(e) {
        obtenerData('clientes').then((clientes) => {
            this.clientes = clientes;
            this.generateRows(this.clientes, this.rowsPerPage);
            this.generatePaginationControls(this.clientes, this.rowsPerPage);
            // colocar en el input busqueda el celular del cliente encontrado
            this.$inputSearchCliente.value = e.detail.celular;
             // Crea un nuevo evento de entrada
            const inputEvent = new Event('input');
            // Asigna el evento al input
            this.$inputSearchCliente.dispatchEvent(inputEvent);
        });


    }

    clickHandler(e) {
        //comprobar si el id del boton es btnEliminarCliente
        if (e.target.id === 'btnEliminarCliente') {
            this.isBusqueda = false;
            //obtener el id del cliente
            const idCliente = e.target.dataset.cliente;
            //eliminar el cliente
            eliminarData('clientes', idCliente).then((response) => {
                if (response) {
                    obtenerData('clientes').then((clientes) => {
                        this.clientes = clientes;
                        this.generateRows(this.clientes, this.rowsPerPage);
                        this.generatePaginationControls(this.clientes, this.rowsPerPage);
                    });
                    this.$inputSearchCliente.value = '';
                }else{
                    alert('No se pudo eliminar el cliente');
                }
            });
        }
    }
    

    connectedCallback() {
        // agregar eventos de click a los botones de paginación
        this.$prevPageBtn.addEventListener('click', () => {
            console.log(this.isBusqueda);
            if (this.currentPage > 1) {
                this.currentPage--;
                if (this.isBusqueda) {
                    this.generateRows(this.filterClientes, this.rowsPerPage);
                    this.generatePaginationControls(this.filterClientes, this.rowsPerPage);
                } else {
                    this.generateRows(this.clientes, this.rowsPerPage);
                    this.generatePaginationControls(this.clientes, this.rowsPerPage);
                }
            }
        });

        this.$nextPageBtn.addEventListener('click', () => {
            console.log(this.isBusqueda);

            const totalPages = Math.ceil(this.clientes.length / this.rowsPerPage);
            if (this.currentPage < totalPages) {
                this.currentPage++;
                if (this.isBusqueda) {
                    console.log(this.filterClientes)

                    this.generateRows(this.filterClientes, this.rowsPerPage);
                    this.generatePaginationControls(this.filterClientes, this.rowsPerPage);
                } else {
                    this.generateRows(this.clientes, this.rowsPerPage);
                    this.generatePaginationControls(this.clientes, this.rowsPerPage);
                }
            }
        });
        // agregar evento de cambio al menú desplegable
        this.$pageSelect.addEventListener('change', event => {
            console.log(this.isBusqueda);
            console.log("cambierchange");
            this.currentPage = Number(event.target.value);
            if (this.isBusqueda) {
                this.generateRows(this.filterClientes, this.rowsPerPage);
            } else {
                this.generateRows(this.clientes, this.rowsPerPage);
            }
        });
        // agregar evento de cambio al input de búsqueda
        this.$inputSearchCliente.addEventListener('input', this.searchTable);

        document.addEventListener('clienteFound', this.clienteFoundHandler);

        this.addEventListener('click', this.clickHandler);
    }

    disconnectedCallback() {
        this.$prevPageBtn.removeEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.generateRows(this.clientes, this.rowsPerPage);
                this.generatePaginationControls(this.clientes, this.rowsPerPage);
            }
        });

        this.$nextPageBtn.removeEventListener('click', () => {
            const totalPages = Math.ceil(this.clientes.length / this.rowsPerPage);
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.generateRows(this.clientes, this.rowsPerPage);
                this.generatePaginationControls(this.clientes, this.rowsPerPage);
            }
        });
        // agregar evento de cambio al menú desplegable
        this.$pageSelect.removeEventListener('change', event => {
            console.log("cambierchange");
            this.currentPage = Number(event.target.value);
            this.generateRows(this.clientes, this.rowsPerPage);
        });
        this.$inputSearchCliente.removeEventListener('input', this.searchTable);

        document.removeEventListener('clienteFound', this.clienteFoundHandler);

        this.removeEventListener('click', this.clickHandler);


    }
}

customElements.define('list-clientes-element', ListClientes);