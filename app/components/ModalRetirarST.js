import {editDocMerge, obtenerDataWhere} from '../helpers/firebase.js';

export class ModalRetirarST extends HTMLElement{
    constructor(){
        super();
        this.retirarSTHandler = this.retirarSTHandler.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
        this.inputHandler = this.inputHandler.bind(this);

        this.innerHTML = /*html*/`
            <div class="modal fade " id="modalRetirarST" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content bg-dark text-white">
                        <div class="modal-header">
                            <h5 class="modal-title" id="modalRetirarSTLabel">Retirar Servicio Tecnico</h5>
                            <button type="button" id="btnCerrar" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col">
                                    <label for="inputCliente" class="form-label">Cliente</label>
                                    <input type="text" class="form-control" id="inputCliente" disabled>
                                </div>
                                <div class="col">
                                    <label for="inputCelular" class="form-label">Celular</label>
                                    <input type="text" class="form-control" id="inputCelular" disabled>
                                </div>
                            </div>
                            <hr />
                            <div class="row">
                                <div class="col text-center">
                                    <h3><span id="equipo">Impresora</span> <span id="marca">EPSON</span> </h3>
                                </div>
                            </div>
                            <hr />
                            <div class="row">
                                <div class="col text-center">
                                    <h3>Abonos</h3>
                                    <p id="inputAbono" style="font-size:2rem; margin-top:-1.2rem;"></p>
                                </div>
                                <div class="col text-center">
                                    <h3>Total</h3>
                                    <p id="inputTotal" style="font-size:2rem; margin-top:-1.2rem;"></p>
                                </div>
                                <div class="col text-center">
                                    <h2>Saldo</h2>
                                    <p id="saldo" style="font-size:2rem; margin-top:-1.2rem;"></p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col text-center">
                                <h4>Metodos de Pago: </h4>
                                    <select id="paymentMethod" class="form-select" style="width: 95%;" aria-label="Default select example">
                                        <option selected value="Efectivo" >Efectivo</option>
                                        <option value="Davivienda - Daniel">Davivienda - Daniel - 4884 0357 8609</option>
                                        <option value="Nequi - Daniel">Nequi - Daniel - 314 431 6062</option>
                                        <option value="Ahorro a la Mano - Daniel">Ahorro a la Mano - Daniel - 0 314 431 6062</option>
                                        <option value="Davivienda - Oscar">Davivienda - Oscar - 5064 0007 0146</option>
                                        <option value="Daviplata - Oscar">Daviplata - Oscar - 310 346 9101</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <div class="row">
                                <div class="col text-center">
                                    <h3>Pago: </h3>
                                </div>
                                <div class="col">
                                    <input type="number" class="form-control" id="inputPago" >
                                </div>
                                <div class="col">
                                    <button class="btn btn-primary">Retirar ST</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.modal = this.querySelector('#modalRetirarST');
        this.ventanaModal = new bootstrap.Modal(this.modal);

        this.$nombre = this.querySelector('#inputCliente');
        this.$celular = this.querySelector('#inputCelular');
        this.$equipo = this.querySelector('#equipo');
        this.$marca = this.querySelector('#marca');
        this.$abono = this.querySelector('#inputAbono');
        this.$total = this.querySelector('#inputTotal');
        this.$saldo = this.querySelector('#saldo');

        this.$inputPago = this.querySelector('#inputPago');

        this.$btnRetirar = this.querySelector('button.btn-primary');
        this.ID = '';

        this.pedidos = [];

        this.paymentMethod = this.querySelector('#paymentMethod');

    }

    milesFuncion(precio){
        return precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    validacionSaldo(){
        let saldo = parseInt(this.$saldo.textContent.replace(/\./g, ''));
        if (saldo != 0) {
            this.$saldo.parentElement.style.color = 'red';
        }else{
            this.$saldo.parentElement.style.color = 'green';
        }
    }

    async retirarSTHandler(e){
        this.ventanaModal.show();
        console.log(e.detail);
        let idST = parseInt(e.detail.id);
        console.log(this.pedidos.length)
        this.pedidos = [];
        this.pedidos = await obtenerDataWhere('pedidos', 'idST', '==', idST);

        this.ID = e.detail.id;
        this.$inputPago.value = '';


        this.$nombre.value = e.detail.cliente;
        this.$celular.value = e.detail.celular;
        this.$equipo.textContent = e.detail.equipo;
        this.$marca.textContent = e.detail.marca;
        this.$abono.textContent = this.milesFuncion(e.detail.abono);
        this.$total.textContent = this.milesFuncion(e.detail.total);

        this.$abono.dataset.abono = e.detail.abono;
        this.$total.dataset.total = e.detail.total;
        this.$saldo.dataset.saldo = e.detail.total - e.detail.abono;

        let saldo = parseInt(e.detail.total - e.detail.abono);
        this.$saldo.textContent = this.milesFuncion(saldo);

        this.validacionSaldo();
    }

    async clickHandler(e){
        if(e.target == this.$btnRetirar){
            let abono = parseInt(this.$abono.dataset.abono);
            let total = parseInt(this.$total.dataset.total);
            let pago = isNaN(parseInt(this.$inputPago.value)) ? 0 : parseInt(this.$inputPago.value);
            let metodoPago = this.paymentMethod.options[this.paymentMethod.selectedIndex].value;


            abono += pago;
            // para poder usar el abono original para mandan un mensaje al retirar
            let antAbono = abono;
            console.log(antAbono, 'antAbono');

            let id = this.ID

            let estado = total == 0 ? "Retirado" : "Entregado";

            // si el total es 0 tambien se resetea el abono a 0
            abono = total == 0 ? 0 : abono;
            console.log(abono, 'abono');

            let fechaSalida = new Date().getTime();
            // le damos estado y fehca de salida a los pedidos asociados

            async function updatePedidosAsync (pedidos){
                let resPedido;
                for (const pedido of pedidos) {
                    const data = {
                        estado,
                        fechaSalida,
                        metodoPago,
                    };
                    resPedido = await editDocMerge('pedidos', pedido.id.toString(), data);
                }
                console.log(resPedido);
                return resPedido;
            }
            let resUpdate;
            if (this.pedidos.length > 0) {
                resUpdate = await updatePedidosAsync(this.pedidos);
            }
            
            if (resUpdate){
                Swal.fire({
                    icon: 'success',
                    title: 'Pedidos actualizados',
                    text: 'Pedidos actualizados correctamente',
                })
            } else if (resUpdate == undefined){
                // NO Hacer Nada
            } else{
                Swal.fire({
                    icon: 'error',
                    title: 'Pedidos no actualizados',
                    text: 'No se pudieron actualizar los pedidos, Vuelve a intentarlo',
                })
                return;
            }

            let data = {
                abono,
                total,
                fechaSalida,
                estado,
                metodoPago,
            }

            // un abono pendiente para entregar
            // tambien que haya un confirmacion si se va a retirar y el saldo es 0
            let res = await editDocMerge('servicioTecnico', id, data);
            console.log(res);
            if (res) {
                Swal.fire({
                    icon: 'success',
                    title: 'Salida de ST',
                    text: 'Salida de ST exitosa',
                }).then(() => {
                    if (estado == "Retirado" && antAbono != 0) {
                        Swal.fire({
                            icon: 'info',
                            title: 'Abono pendiente',
                            text: 'El cliente tiene un abono pendiente: '+ this.milesFuncion(antAbono),
                        })
                    }
                    document.dispatchEvent(new CustomEvent('ActualizarTablaST'));
                    this.ventanaModal.hide();
                });
        }
    }
    }

    inputHandler(e){
        if(e.target == this.$inputPago){
            if(e.target.value == '') {
                this.$saldo.textContent = this.milesFuncion(this.$saldo.dataset.saldo);
                this.validacionSaldo();
                return;
            }
            let abono = parseInt(this.$abono.dataset.abono);
            let total = parseInt(this.$total.dataset.total);
            let pago = parseInt(e.target.value);
            let saldo = total - abono - pago;
            
            if (saldo < 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'El pago mas los abonos no pueden ser mayor al total',
                });
                e.target.value = '';
                this.$saldo.textContent = this.milesFuncion(this.$saldo.dataset.saldo);
                this.validacionSaldo();
                return;
            }

            this.$saldo.textContent = this.milesFuncion(saldo);
            this.validacionSaldo();

        }
    }

    connectedCallback(){
        document.addEventListener('retirarST', this.retirarSTHandler);
        this.addEventListener('click', this.clickHandler);
        this.addEventListener('input', this.inputHandler)
    }

    disconnectedCallback(){
        document.removeEventListener('retirarST', this.retirarSTHandler);
        this.removeEventListener('click', this.clickHandler);
        this.removeEventListener('input', this.inputHandler)
    }

}

customElements.define('modal-retirar-st', ModalRetirarST);