import { obtenerData } from "../helpers/firebase.js";

export class listServicioTecnico extends HTMLElement {
    constructor() {
        super();
        // bind 
        this.llenarTabla = this.llenarTabla.bind(this);
        this.innerHTML = /*html*/`
        <div class="container bg-dark text-white">
            <div class="row">
                <div class="col-8 p-2">
                    <label class="form-label" for="start">Fecha inicio:</label>
                    <input class="form-control-sm" type="date" id="start" name="trip-start">

                    <label class="form-label" for="end">Fecha fin:</label>
                    <input class="form-control-sm" type="date" id="end" name="trip-end">

                    <button class="btn btn-primary" id="filtrar">Filtrar</button>
                </div>
            </div>
            <div class="row">
                <div class="col-12 p-2">
                    <table id="tablaServicioTecnico" class="table table-dark table-striped table-hover" style="border: 1px solid white">
                        <thead>
                            <tr>
                                <th scope="col">Fecha</th>
                                <th scope="col">Cliente</th>
                                <th scope="col">Equipo</th>
                                <th scope="col">Marca</th>
                                <th scope="col">Estado</th>
                                <th scope="col">ST Cancelado</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tbody">
                            
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        `;

        this.$btnfiltrar = this.querySelector('#filtrar');
        this.$inputSearch = "";
        this.$tbody = this.querySelector('#tbody');

    }

    async llenarTabla() {
        let data = await obtenerData('servicioTecnico');
        this.$tbody.innerHTML = '';
        data.forEach(element => {
            this.$tbody.innerHTML += /*html*/`
                <tr >
                    <td>${element.fecha.toDate().toLocaleString()}</td>
                    <td>${element.cliente}</td>
                    <td>${element.equipo}</td>
                    <td>${element.marca}</td>
                    <td>${element.estado}</td>
                    <td>${element.PagadoATecnico == false ? "No" : "Si"}</td>
                    <td>
                        <button ${element.PagadoATecnico ? "disabled" : ""} class="btn btn-primary" id="btn-edit" data-pagadotec="${element.PagadoATecnico}" data-id="${element.id}"><i data-pagadotec="${element.PagadoATecnico}" data-id="${element.id}" class="fa fa-eye"></i></button>
                        <button ${element.PagadoATecnico ? "disabled" : ""} class="btn btn-danger" id="btn-delete" data-pagadotec="${element.PagadoATecnico}" data-id="${element.id}"><i data-pagadotec="${element.PagadoATecnico}" data-id="${element.id}"  class="fa fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
        $('#tablaServicioTecnico').DataTable({
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
            pageLength: 5,
            pagingType: "simple_numbers",
        });
        this.$inputSearch = this.querySelector('#tablaServicioTecnico_filter input');
        this.$inputSearch.classList.add('text-white');
    }

    async connectedCallback() {
        this.llenarTabla();
        
    }
}

customElements.define('list-servicio-tecnico-element', listServicioTecnico);