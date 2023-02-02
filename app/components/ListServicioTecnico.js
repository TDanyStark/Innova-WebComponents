import { editDocMerge, estadoSesion, obtenerDataWhere, obtenerServiciosTecnicosDateStarttoEnd, eliminarData} from "../helpers/firebase.js";
import { ModalViewST  } from "./ModalViewST.js";
import { ModalRetirarST } from "./ModalRetirarST.js";

export class listServicioTecnico extends HTMLElement {
    constructor() {
        super();
        // bind 
        this.llenarTabla = this.llenarTabla.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
        this.ActualizarTablaSTHandler = this.ActualizarTablaSTHandler.bind(this);
        this.innerHTML = /*html*/`
        <div class="container bg-dark text-white">
            <div class="row">
                <div class="col-12 p-2">
                    <table id="tablaServicioTecnico" class="table table-dark table-striped table-hover" style="border: 1px solid white">
                        <thead>
                            <tr>
                                <th scope="col">Recibo</th>
                                <th scope="col">Fecha</th>
                                <th scope="col">Cliente</th>
                                <th scope="col">Equipo</th>
                                <th scope="col">Marca y Ref</th>
                                <th scope="col">Total</th>
                                <th scope="col">Saldo</th>
                                <th scope="col">Estado</th>
                                ${window.isAdmin ? '<th scope="col">User</th>' : ''}
                                <th scope="col">ST C</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tbody">
                            
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <modal-view-st></modal-view-st>
        <modal-retirar-st></modal-retirar-st>
        `;

        this.$btnfiltrar;
        this.$inputSearch;
        this.$tbody = this.querySelector('#tbody');
        this.$btnlimpiar;

        this.fechaStart;
        this.fechaEnd;

        this.isfilter = false;

        this.estadoActivo = false;

        this.STActivo = {};

    }

    milesFunc = (num) => {
        return "$ "+num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    async llenarTabla(data) {

        this.$tbody.innerHTML = '';
        data.forEach(element => {
            let theFecha = new Date(element.id);
            // para quitarle los segundos a la fecha se usa la expresion regular y se reemplaza por nada
            theFecha = theFecha.toLocaleString().replace(/:\d{2}/, "");

            function styleEstado (saldo, estado) {
                if (saldo > 0) {
                    if (estado != "Entregado") {
                        if (estado == "Sin Solucion" || estado == "Retirado"){
                            return "border-right: 5px solid yellow";
                        }else{
                            return "border-right: 5px solid blue";
                        }
                    } else {
                        return "border-right: 5px solid red";
                    }
                } else {
                    if (estado != "Entregado") {
                        if (estado == "Sin Solucion" || estado == "Retirado"){
                            return "border-right: 5px solid yellow";
                        }else{
                            return "border-right: 5px solid blue";
                        }
                    } else {
                        return "border-right: 5px solid green";
                    }
                }
            }

            let saldo = element.total - element.abono;
            this.$tbody.innerHTML += /*html*/`
                <tr >
                    <td>${element.recibo}</td>
                    <td>${theFecha}</td>
                    <td>${element.cliente}</td>
                    <td>${element.equipo}</td>
                    <td>${element.marca}</td>
                    <td style="${styleEstado(saldo, element.estado)} ">
                        ${this.milesFunc(element.total)}
                    </td>
                    <td style="${styleEstado(saldo, element.estado)}">
                        ${this.milesFunc(saldo)}
                    </td>
                    <td>${element.estado}</td>
                    ${window.isAdmin ? `<td> ${element.vendedor.split("@")[0]}</td>` : ''}
                    <td>${element.PagadoATecnico == false ? "No" : "Si"}</td>
                    <td>
                        <input type="hidden" id="inputId" data-info="${element.id}" />
                        <input type="hidden" id="inputRecibo" data-info="${element.recibo}" />
                        <input type="hidden" id="inputCliente" data-info="${element.cliente}" />
                        <input type="hidden" id="inputCelular" data-info="${element.celular}" />
                        <input type="hidden" id="inputEquipo" data-info="${element.equipo}" />
                        <input type="hidden" id="inputMarca" data-info="${element.marca}" />
                        <input type="hidden" id="inputCargador" data-info="${element.cargador}" />
                        <input type="hidden" id="inputfallaReportada" data-info="${element.fallaReportada}" />
                        <input type="hidden" id="inputObservaciones" data-info="${element.observaciones}" />
                        <input type="hidden" id="inputAbono" data-info="${element.abono}" />
                        <input type="hidden" id="inputTotal" data-info="${element.total}" />
                        <input type="hidden" id="inputEstado" data-info="${element.estado}" />
                        <input type="hidden" id="inputPagadoATecnico" data-info="${element.PagadoATecnico}" />
                        <input type="hidden" id="inputFechaSalida" data-info="${element.fechaSalida}" />
                        <input type="hidden" id="inputVendedor" data-info="${element.vendedor}" />
                        <input type="hidden" id="inputExistePedido" data-info="${element.existePedido}" />

                        <button ${element.PagadoATecnico ? "disabled" : ""} class="btn btn-primary" id="btn-ver" data-pagadotec="${element.PagadoATecnico}" data-id="${element.id}"><i data-pagadotec="${element.PagadoATecnico}" data-id="${element.id}" id="btn-ver" class="fa fa-eye"></i></button>
                        <button ${element.PagadoATecnico || element.estado == "Entregado" || element.estado == "Retirado" ? "disabled" : ""} class="btn btn-success" id="btn-retirar" data-pagadotec="${element.PagadoATecnico}" data-id="${element.id}"><i data-pagadotec="${element.PagadoATecnico}" data-id="${element.id}" id="btn-retirar" class="fa-solid fa-check"></i></button>
                        ${window.isAdmin ? '<button class="btn btn-danger btnEliminar"><i class="fa fa-trash"></i></button>' : ''}
                        </td>
                </tr>
            `;
        });

        $('#tablaServicioTecnico').DataTable({
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
        this.$inputSearch = this.querySelector('#tablaServicioTecnico_filter input');
        this.$inputSearch.classList.add('text-white');
        this.querySelector('#tablaServicioTecnico_filter').style.marginTop = '10px';

        this.querySelector('#tablaServicioTecnico_length').innerHTML =/*html*/ `
            <div style="margin:10px;">
                    <label class="form-label" for="start">Fecha inicio:</label>
                    <input class="form-control-sm" type="date" id="start" name="trip-start">

                    <label class="form-label" for="end">Fecha fin:</label>
                    <input class="form-control-sm" type="date" id="end" name="trip-end">

                    <button class="btn btn-primary" id="filtrar">Filtrar</button>
                    <button class="btn btn-primary" id="limpiar">Limpiar</button>
            </div>
        `;

        this.fechaStart = this.querySelector('#start');
        this.fechaEnd = this.querySelector('#end');
        this.$btnfiltrar = this.querySelector('#filtrar');
        this.$btnlimpiar = this.querySelector('#limpiar');

    }

    async clickHandler(e) {
        if (e.target === this.$btnfiltrar) {
            // si las fechas estan vacias no hacer nada
            if(this.fechaStart.value === "" || this.fechaEnd.value === "")return;

            let dateInicio = new Date(this.fechaStart.value+" 00:00:00").getTime();
            let dateFin = new Date(this.fechaEnd.value+" 23:59:59").getTime();

            if(dateInicio > dateFin){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'La fecha de inicio no puede ser mayor a la fecha final',
                });
                //limpiar los input de fecha
                this.fechaStart.value = "";
                this.fechaEnd.value = "";
                return;
            }

            // limpiar la datatable
            $('#tablaServicioTecnico').DataTable().destroy();
            // pintar la tabla con los datos filtrados
            let data = await obtenerServiciosTecnicosDateStarttoEnd(dateInicio, dateFin);
            this.llenarTabla(data);
            this.isfilter = true;
        }
        if (e.target == this.$btnlimpiar) {
            if(this.isfilter == true){
                this.ActualizarTablaSTHandler();
                this.isfilter = false;
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No hay filtro para limpiar',
                });
            }
            
        }

        if (e.target.classList.contains('btnEliminar') || e.target.parentElement.classList.contains('btnEliminar')) {
            // SOlo si es admin
            let target = e.target.classList.contains('btnEliminar') ? e.target : e.target.parentElement;
            let id = target.parentElement.parentElement.querySelector('#inputId').dataset.info;
            
            let res = await Swal.fire({
                title: '¿Estas seguro de eliminar el registro?',
                text: "No podras revertir esta accion",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, eliminar',
                cancelButtonText: 'Cancelar'
            });

            if (res.isConfirmed) {
                let data = await eliminarData('servicioTecnico', id);
                if (data) {
                    Swal.fire(
                        'Eliminado!',
                        'El registro ha sido eliminado.',
                        'success'
                    );
                    this.ActualizarTablaSTHandler();
                }
            }
        }

        if(e.target.id === "btn-ver"){  
            let td = e.target.closest('td');
            let ST = {
                id: td.querySelector('#inputId').dataset.info,
                recibo: td.querySelector('#inputRecibo').dataset.info,
                cliente: td.querySelector('#inputCliente').dataset.info,
                celular: td.querySelector('#inputCelular').dataset.info,
                equipo: td.querySelector('#inputEquipo').dataset.info,
                marca: td.querySelector('#inputMarca').dataset.info,
                cargador: td.querySelector('#inputCargador').dataset.info,
                fallaReportada: td.querySelector('#inputfallaReportada').dataset.info,
                observaciones: td.querySelector('#inputObservaciones').dataset.info,
                abono: td.querySelector('#inputAbono').dataset.info,
                total: td.querySelector('#inputTotal').dataset.info,
                estado: td.querySelector('#inputEstado').dataset.info,
                PagadoATecnico: td.querySelector('#inputPagadoATecnico').dataset.info,
                fechaSalida: td.querySelector('#inputFechaSalida').dataset.info,
                vendedor: td.querySelector('#inputVendedor').dataset.info,
                existePedido: td.querySelector('#inputExistePedido').dataset.info,
            }
            document.dispatchEvent(new CustomEvent('verST', {detail: ST}));
        }

        if(e.target.id === "btn-retirar"){
            // obetner el td con closest
            let td = e.target.closest('td');
            let ST = {
                id: td.querySelector('#inputId').dataset.info,
                recibo: td.querySelector('#inputRecibo').dataset.info,
                cliente: td.querySelector('#inputCliente').dataset.info,
                celular: td.querySelector('#inputCelular').dataset.info,
                equipo: td.querySelector('#inputEquipo').dataset.info,
                marca: td.querySelector('#inputMarca').dataset.info,
                cargador: td.querySelector('#inputCargador').dataset.info,
                fallaReportada: td.querySelector('#inputfallaReportada').dataset.info,
                observaciones: td.querySelector('#inputObservaciones').dataset.info,
                abono: td.querySelector('#inputAbono').dataset.info,
                total: td.querySelector('#inputTotal').dataset.info,
                estado: td.querySelector('#inputEstado').dataset.info,
                PagadoATecnico: td.querySelector('#inputPagadoATecnico').dataset.info,
                fechaSalida: td.querySelector('#inputFechaSalida').dataset.info,
                vendedor: td.querySelector('#inputVendedor').dataset.info,
                existePedido: td.querySelector('#inputExistePedido').dataset.info,

            }
            document.dispatchEvent(new CustomEvent('retirarST', {detail: ST}));
        }
    }


    async ActualizarTablaSTHandler(e){
        // obtener el numero desde epoch hasta el primer dia del mes
        let today = new Date();
        let quinceAgo = new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000); // 15 días atrás
        quinceAgo = quinceAgo.getTime();


        let data = await obtenerDataWhere('servicioTecnico', 'id', '>=', quinceAgo);
        // limpiar la datatable
        $('#tablaServicioTecnico').DataTable().destroy();
        // llenar la tabla
        this.llenarTabla(data);
    }


    async connectedCallback() {
        let today = new Date();
        let quinceAgo = new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000); // 15 días atrás
        quinceAgo = quinceAgo.getTime();


        let data = await obtenerDataWhere('servicioTecnico', 'id', '>=', quinceAgo);
        this.llenarTabla(data);
        this.addEventListener('click', this.clickHandler);
        document.addEventListener('ActualizarTablaST', this.ActualizarTablaSTHandler);
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.clickHandler);
        document.removeEventListener('ActualizarTablaST', this.ActualizarTablaSTHandler);
    }   
}

customElements.define('list-servicio-tecnico-element', listServicioTecnico);