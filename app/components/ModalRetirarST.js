import {editDocMerge} from '../helpers/firebase.js';

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

    retirarSTHandler(e){
        this.ventanaModal.show();
        console.log(e.detail);
        this.ID = e.detail.id;


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

            abono += pago;

            let id = this.ID

            let data = {
                abono,
                total,
                fechaSalida: new Date().getTime(),
                estado: 'Entregado'
            }


            let res = await editDocMerge('servicioTecnico', id, data);
            console.log(res);
            if (res) {
                Swal.fire({
                    icon: 'success',
                    title: 'Salida de ST',
                    text: 'Salida de ST exitosa',
                }).then(() => {
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