import {editDocMerge, obtenerDataWhere, eliminarData} from '../helpers/firebase.js';

export class ListPedidos extends HTMLElement{
    constructor(){
        super();
        this.listPedidosHandler = this.listPedidosHandler.bind(this);
        this.pintarPedidos = this.pintarPedidos.bind(this);
        this.verlistPedidosHandler = this.verlistPedidosHandler.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
        this.actualizarPedidosHandler = this.actualizarPedidosHandler.bind(this);

        this.innerHTML = /*html*/`
            <table id="tablaPedidos" class="table table-hover table-dark">
                <thead>
                    <tr>
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

            this.$inputSearch;
            this.$wrapper;

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
                    <td data-id="${pedido.id}" data-idst="${pedido.idST}">${pedido.recibo}</td>
                    <td>${pedido.cliente}</td>
                    <td>${pedido.pedido}</td>
                    <td>${this.funcMiles(pedido.abono)}</td>
                    <td>${this.funcMiles(pedido.total)}</td>
                    <td>${this.validarUndefined(pedido.estado)}</td>
                    <td>${this.validarUndefined(pedido.proveedor)}</td>
                    <td>${pedido.vendedor.split('@')[0]}</td>
                    <td>
                        <input type="hidden" id="hiddenId" value="${pedido.id}">
                        <input type="hidden" id="hiddenIdST" value="${pedido.idST}">
                        <input type="hidden" id="hiddenRecibo" value="${pedido.recibo}">
                        <input type="hidden" id="hiddenCliente" value="${pedido.cliente}">
                        <input type="hidden" id="hiddenCelular" value="${pedido.celular}">
                        <input type="hidden" id="hiddenPedido" value="${pedido.pedido}">
                        <input type="hidden" id="hiddenAbono" value="${pedido.abono}">
                        <input type="hidden" id="hiddenPrecioCompra" value="${pedido.precioCompra}">
                        <input type="hidden" id="hiddenTotal" value="${pedido.total}">
                        <input type="hidden" id="hiddenEstado" value="${pedido.estado}">
                        <input type="hidden" id="hiddenProveedor" value="${pedido.proveedor}">
                        <input type="hidden" id="hiddenVendedor" value="${pedido.vendedor}">
                        <input type="hidden" id="hiddenFechaEntrega" value="${pedido.fechaEntrega}">

                        <button class="btn btn-primary"><i class="fa fa-eye"></i></button>
                        <button class="btn btn-success" ${pedido.estado == "Entregado" || pedido.estado == "Entregado, Deuda" ? "disabled" : ""}><i class="fa-solid fa-check"></i></button>
                        <button class="btn btn-danger btnEliminar" ${window.isAdmin ? "" : "disabled"}><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });

        $('#tablaPedidos').DataTable({
            "order": [[ 0, "desc" ]],
            responsive: true,
            autoWidth: false,
            "language": {
                "lengthMenu": "",
                "zeroRecords": "No se encontraron resultados en su busqueda",
                "searchPlaceholder": "Buscar registros",
                "info": "Mostrando de _START_ al _END_ de un total de _TOTAL_ registros",
                "infoEmpty": "No existen registros",
                "infoFiltered": "(filtrado de un total de _MAX_ registros)",
                "search": "Buscar:",
                "paginate": {
                    "first": "Primero",
                    "last": "Último",
                    "next": "Siguiente",
                    "previous": "Anterior"
                },
            },
            pageLength: 10,
            pagingType: "simple_numbers",
        });
        this.$inputSearch = this.querySelector('#tablaPedidos_filter input');
        this.$inputSearch.classList.add('text-white');
        this.$inputSearch.classList.add('bg-dark');

        this.$wrapper = this.querySelector('#tablaPedidos_wrapper');
        this.$wrapper.classList.add('bg-dark');
        this.$wrapper.classList.add('text-white');

    }

    listPedidosHandler(e){
        //destruir la tabla
        $('#tablaPedidos').DataTable().destroy();
        this.pintarPedidos(e.detail);
    }

    verlistPedidosHandler(e){
        $('#tablaPedidos').DataTable().destroy();
        this.pintarPedidos(e.detail);
    }

    clickHandler = async (e) => {
        if(e.target.matches('.btn-primary') || e.target.matches('.btn-primary *')){
            let target = e.target.classList.contains('btn-primary') ? e.target : e.target.parentElement;
            
            let id = target.parentElement.querySelector('#hiddenId').value;
            let idST = target.parentElement.querySelector('#hiddenIdST').value;
            let recibo = target.parentElement.querySelector('#hiddenRecibo').value;
            let cliente = target.parentElement.querySelector('#hiddenCliente').value;
            let celular = target.parentElement.querySelector('#hiddenCelular').value;
            let pedido = target.parentElement.querySelector('#hiddenPedido').value;
            let abono = target.parentElement.querySelector('#hiddenAbono').value;
            let precioCompra = target.parentElement.querySelector('#hiddenPrecioCompra').value;
            let total = target.parentElement.querySelector('#hiddenTotal').value;
            let estado = target.parentElement.querySelector('#hiddenEstado').value;
            let proveedor = target.parentElement.querySelector('#hiddenProveedor').value;
            let vendedor = target.parentElement.querySelector('#hiddenVendedor').value;
            let fechaEntrega = target.parentElement.querySelector('#hiddenFechaEntrega').value;

            let pedidoObj = {
                id,
                idST,
                recibo,
                cliente,
                celular,
                pedido,
                abono,
                precioCompra,
                total,
                estado,
                proveedor,
                vendedor,
                fechaEntrega
            }

            document.dispatchEvent(new CustomEvent('modalVerPedido', {detail: pedidoObj}));
        }

        if(e.target.matches('.btn-success') || e.target.matches('.btn-success *')){
            let target = e.target.classList.contains('btn-success') ? e.target : e.target.parentElement;
            
            let id = target.parentElement.querySelector('#hiddenId').value;
            let cliente = target.parentElement.querySelector('#hiddenCliente').value;
            let celular = target.parentElement.querySelector('#hiddenCelular').value;
            let pedido = target.parentElement.querySelector('#hiddenPedido').value;
            let abono = target.parentElement.querySelector('#hiddenAbono').value;
            let estado = target.parentElement.querySelector('#hiddenEstado').value;
            let total = target.parentElement.querySelector('#hiddenTotal').value;

            let pago;
            // alerta con input para pago
            let resultado = await Swal.fire({
                title: pedido + " \nTotal: " + this.funcMiles(total) + " Abono: " + this.funcMiles(abono) + " saldo: " + this.funcMiles(total - abono),
                text: "Ingrese el monto a pagar",
                input: "number",
                inputPlaceholder: "Monto a pagar " + this.funcMiles(total - abono),
                inputAttributes: {
                    min: 0,
                    max: 1000000000,
                    step: 1,
                },
                showCancelButton: true,
                confirmButtonText: "Aceptar",
                cancelButtonText: "Cancelar",
                showLoaderOnConfirm: true,
                preConfirm: (abono) => {
                    abono = abono === "" ? 0 : parseInt(abono);
                    pago = abono;
                    return abono;
                },
                allowOutsideClick: () => !Swal.isLoading(),
            });

            console.log(resultado);
            if (resultado.isDesmissed) return;
            if(resultado.isConfirmed){
                if (pago >= total - abono) {
                    let res = await Swal.fire({
                        title: "El pago es mayor o igual al saldo",
                        text: "Debes devolver " + this.funcMiles(pago - (total - abono)),
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Aceptar",
                        cancelButtonText: "Cancelar",
                    });
                    if (res.isDesmissed) return;
                    if (res.isConfirmed) {
                        abono = total;
                        estado = "Entregado";
                    }
                    
                } else {
                    let res = await Swal.fire({
                        title: "El pago es menor al saldo",
                        text: "Queda una Deuda de: " + this.funcMiles((total - abono) - pago),
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Aceptar",
                        cancelButtonText: "Cancelar",
                    });
                    if (res.isDesmissed) return;
                    if (res.isConfirmed) {
                        abono = parseInt(abono) + parseInt(pago);
                        estado = "Entregado, Deuda";
                    }
                }
            }

            console.log(abono, estado, total);
            abono = parseInt(abono);
            total = parseInt(total);
            let pedidoObj = {
                id : parseInt(id),
                abono,
                estado,
                total,
                fechaEntrega: new Date().getTime()
            }

            let res = await editDocMerge('pedidos', id, pedidoObj);
            if(res){
                Swal.fire({
                    title: "Pedido Actualizado",
                    icon: "success",
                });
                document.dispatchEvent(new CustomEvent('actualizarPedidos', {detail: {celular}}));
            }else{
                Swal.fire({
                    title: "Error al actualizar el pedido",
                    icon: "error",
                });
            }
        }

        if(e.target.matches('.btnEliminar') || e.target.matches('.btnEliminar *')){
            let target = e.target.classList.contains('btnEliminar') ? e.target : e.target.parentElement;
            let id = target.parentElement.querySelector('#hiddenId').value;
            let celular = target.parentElement.querySelector('#hiddenCelular').value;

            let res = await Swal.fire({
                title: "¿Estas seguro de eliminar el pedido?",
                text: "No se podra recuperar el pedido",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Aceptar",
                cancelButtonText: "Cancelar",
            });
            if (res.isDesmissed) return;
            if (res.isConfirmed) {
                let res = await eliminarData('pedidos', id);
                if(res){
                    Swal.fire({
                        title: "Pedido Eliminado",
                        icon: "success",
                    });
                    document.dispatchEvent(new CustomEvent('actualizarPedidos', {detail: {celular}}));
                }else{
                    Swal.fire({
                        title: "Error al eliminar el pedido",
                        icon: "error",
                    });
                }
            }
        }
    };

    actualizarPedidosHandler = async (e) => {
        let pedidos = await obtenerDataWhere('pedidos', 'celular', '==', e.detail.celular)
        $('#tablaPedidos').DataTable().destroy();
        this.pintarPedidos(pedidos);
    };

    connectedCallback(){
        document.addEventListener('listPedidos', this.listPedidosHandler);
        document.addEventListener('seeAllListPedidos', this.verlistPedidosHandler);
        document.addEventListener('actualizarPedidos', this.actualizarPedidosHandler)
        this.addEventListener('click', this.clickHandler);
    }

    disconnectedCallback(){
        document.removeEventListener('listPedidos', this.listPedidosHandler);
        document.removeEventListener('seeAllListPedidos', this.verlistPedidosHandler);
        document.removeEventListener('actualizarPedidos', this.actualizarPedidosHandler)
        this.removeEventListener('click', this.clickHandler);
    }

}

customElements.define('list-pedidos', ListPedidos);