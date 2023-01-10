import { estadoSesion, Admin,  signInEmail } from "../helpers/firebase.js";

export class Login extends HTMLElement {
    constructor() {
        super();
        this.onSubmit = this.onSubmit.bind(this);
        this.loginSuccess = this.loginSuccess.bind(this);
        this.loginError = this.loginError.bind(this);
        const container = document.createElement('div');
        container.id = 'login-container';
        container.innerHTML = /*html*/`
        <section class="vh-100 gradient-custom">
            <div class="container py-5 h-100">
                <div class="row d-flex justify-content-center align-items-center h-100">
                    <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div class="card bg-dark text-white" style="border-radius: 1rem;">
                            <div class="card-body p-5 text-center">
                            <form>
                                <div class="mb-md-5 mt-md-4 pb-5">
                                    <h2 class="fw-bold mb-2 text-uppercase">INNOVACENTER</h2>
                                    <p class="text-white-50 mb-5">Ingrese el correo y contraseña!</p>
                                    <div class="form-outline form-white mb-4">
                                        <input type="email" id="typeEmailX" class="form-control form-control-lg text-center" />
                                        <label class="form-label" for="typeEmailX">Email</label>
                                    </div>
                                    <div class="form-outline form-white mb-4">
                                        <input type="password" id="typePasswordX" class="form-control form-control-lg text-center" />
                                        <label class="form-label" for="typePasswordX">Password</label>
                                    </div>
                                    <button class="btn btn-outline-light btn-lg px-5" type="submit">Login</button>
                                </div>
                            </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        `;
        this.appendChild(container);
        this.form = container.querySelector('form');

    
    }
    onSubmit(e) {
        e.preventDefault();
        const username = this.form.querySelector('input[type="email"]').value;
        const password = this.form.querySelector('input[type="password"]').value;
    
        // llamamos a la función que nos pasan por parámetro
        signInEmail(username, password, this.loginSuccess, this.loginError);
        }

        async loginSuccess() {
            window.isAdmin = await Admin(estadoSesion.uid);
            location.hash = '#/home';
        }
    
        loginError() {
            alert('Login incorrecto');
        }

    connectedCallback() {
        // añadimos el event listener al formulario
        console.log("conectado");
        this.form.addEventListener('submit', this.onSubmit);
        }
    

    disconnectedCallback() {
      // eliminamos los event listeners del componente
        this.form.removeEventListener('submit', this.onSubmit);
        console.log("desconectado")
    }
}

customElements.define('login-element', Login);
