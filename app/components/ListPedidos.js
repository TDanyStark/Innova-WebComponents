export class ListPedidos extends HTMLElement{
    constructor(){
        super();

        this.innerHTML = /*html*/`
            <table id="tablaPedidos" class="table table-hover table-dark">
                <thead>
                    <tr>
                        <th scope="col" class="col-sm-3 col-md-3 col-lg-2">ID</th>
                        <th scope="col" class="col-sm-3 col-md-3 col-lg-2">pedido</th>
                        <th scope="col" class="col-sm-3 col-md-3 col-lg-2">Cantidad Inventario</th>
                        <th scope="col" class="col-sm-3 col-md-3 col-lg-2">Precio Compra</th>
                        <th scope="col" class="col-sm-3 col-md-3 col-lg-2">Precio Final</th>
                        <th scope="col" class="col-sm-3 col-md-3 col-lg-2">Proveedor</th>
                        <th scope="col" class="col-sm-3 col-md-3 col-lg-2">User</th>
                        <th scope="col" class="col-sm-3 col-md-3 col-lg-2">Accion</th>
                    </tr>
                </thead>
                <tbody id="data-table-body">
                    
                </tbody>
            
            </table>
            `;
    }

}

customElements.define('list-pedidos', ListPedidos);