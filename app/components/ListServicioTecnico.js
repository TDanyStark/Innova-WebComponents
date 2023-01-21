import { estadoSesion, obtenerDataWhere, obtenerServiciosTecnicosDateStarttoEnd} from "../helpers/firebase.js";

export class listServicioTecnico extends HTMLElement {
    constructor() {
        super();
        // bind 
        this.llenarTabla = this.llenarTabla.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
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
                                <th scope="col">Marca</th>
                                <th scope="col">Total</th>
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
        `;

        this.$btnfiltrar;
        this.$inputSearch;
        this.$tbody = this.querySelector('#tbody');
        this.$btnlimpiar;

        this.fechaStart;
        this.fechaEnd;

        this.isfilter = false;

    }

    async llenarTabla(data) {
        
        this.$tbody.innerHTML = '';
        data.forEach(element => {
            this.$tbody.innerHTML += /*html*/`
                <tr >
                    <td>${element.recibo}</td>
                    <td>${element.fecha.toDate().toLocaleString()}</td>
                    <td>${element.cliente}</td>
                    <td>${element.equipo}</td>
                    <td>${element.marca}</td>
                    <td>${element.total}</td>
                    <td>${element.estado}</td>
                    ${window.isAdmin ? `<td> ${element.vendedor.split("@")[0]}</td>` : ''}
                    <td>${element.PagadoATecnico == false ? "No" : "Si"}</td>
                    <td>
                        <button ${element.PagadoATecnico ? "disabled" : ""} class="btn btn-primary" id="btn-edit" data-pagadotec="${element.PagadoATecnico}" data-id="${element.id}"><i data-pagadotec="${element.PagadoATecnico}" data-id="${element.id}" class="fa fa-eye"></i></button>
                        <button ${element.PagadoATecnico ? "disabled" : ""} class="btn btn-danger" id="btn-delete" data-pagadotec="${element.PagadoATecnico}" data-id="${element.id}"><i data-pagadotec="${element.PagadoATecnico}" data-id="${element.id}"  class="fa fa-trash"></i></button>
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
            pageLength: 8,
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
                let date = new Date();
                date.setDate(1); // Establece el día en el primer día del mes
                date.setHours(0, 0, 0, 0); // Establece la hora en 00:00:00.000
                let firstDayOfMonth = date.getTime(); // Obtiene el número de milisegundos desde el epoch
                console.log(firstDayOfMonth);


                let data = await obtenerDataWhere('servicioTecnico', 'id', '>=', firstDayOfMonth);
                // limpiar la datatable
                $('#tablaServicioTecnico').DataTable().destroy();
                this.llenarTabla(data);
                this.isfilter = false;
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No hay filtro para limpiar',
                });
            }
            
        }
    }

    async connectedCallback() {
        // obtener el numero desde epoch hasta el primer dia del mes
        let date = new Date();
        date.setDate(1); // Establece el día en el primer día del mes
        date.setHours(0, 0, 0, 0); // Establece la hora en 00:00:00.000
        let firstDayOfMonth = date.getTime(); // Obtiene el número de milisegundos desde el epoch
        console.log(firstDayOfMonth);


        let data = await obtenerDataWhere('servicioTecnico', 'id', '>=', firstDayOfMonth);
        this.llenarTabla(data);
        this.addEventListener('click', this.clickHandler);
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.clickHandler);
    }   
}

customElements.define('list-servicio-tecnico-element', listServicioTecnico);