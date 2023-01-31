export class ListPedidos extends HTMLElement{
    constructor(){
        super();
        this.listPedidosHandler = this.listPedidosHandler.bind(this);
        this.pintarPedidos = this.pintarPedidos.bind(this);
        this.innerHTML = /*html*/`
            <table id="tablaPedidos" class="table table-hover table-dark">
                <thead>
                    <tr>
                        <th scope="col" class="col-sm-3 col-md-3 col-lg-2">ID</th>
                        <th scope="col" class="col-sm-3 col-md-3 col-lg-2">Recibo ST</th>
                        <th scope="col" class="col-sm-3 col-md-3 col-lg-2">Cliente</th>
                        <th scope="col" class="col-sm-3 col-md-3 col-lg-2">Pedido</th>
                        <th scope="col" class="col-sm-3 col-md-3 col-lg-2">Abono</th>
                        <th scope="col" class="col-sm-3 col-md-3 col-lg-2">Precio Final</th>
                        <th scope="col" class="col-sm-3 col-md-3 col-lg-2">Estado</th>
                        <th scope="col" class="col-sm-3 col-md-3 col-lg-2">Proveedor</th>
                        <th scope="col" class="col-sm-3 col-md-3 col-lg-2">User</th>
                        <th scope="col" class="col-sm-3 col-md-3 col-lg-2">Accion</th>
                    </tr>
                </thead>
                <tbody id="data-table-body">
                    
                </tbody>
            
            </table>
            `;

            this.$dataTableBody = this.querySelector('#data-table-body');
    }

    validarUndefined = (value) => {
        if(value === undefined){
            return 'No Asignado';
        }else{
            return value;
        }
    };

    funcMiles = (value) => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");


    pintarPedidos(data){
        this.$dataTableBody.innerHTML = '';
        data.forEach(pedido => {
            console.log(pedido);
            this.$dataTableBody.innerHTML += /*html*/`
                <tr>
                    <td>${pedido.id}</td>
                    <td data-idst="${pedido.idST}">${pedido.recibo}</td>
                    <td>${pedido.cliente}</td>
                    <td>${pedido.pedido}</td>
                    <td>${this.funcMiles(pedido.abono)}</td>
                    <td>${this.funcMiles(pedido.total)}</td>
                    <td>${this.validarUndefined(pedido.estado)}</td>
                    <td>${this.validarUndefined(pedido.proveedor)}</td>
                    <td>${pedido.vendedor.split('@')[0]}</td>
                    <td>
                        <button class="btn btn-primary"><i class="fa fa-eye"></i></button>
                        <button class="btn btn-success"><i class="fa-solid fa-check"></i></button>
                    </td>
                </tr>
            `;
        });
    }

    listPedidosHandler(e){
        this.pintarPedidos(e.detail);
    }

    connectedCallback(){
        document.addEventListener('listPedidos', this.listPedidosHandler);
    }

    disconnectedCallback(){
        document.removeEventListener('listPedidos', this.listPedidosHandler);
    }

}

customElements.define('list-pedidos', ListPedidos);