import { estadoSesion, Admin,  signInEmail } from "../helpers/firebase.js";

export class Login extends HTMLElement {
    constructor() {
        super();
        this.onSubmit = this.onSubmit.bind(this);
        this.loginSuccess = this.loginSuccess.bind(this);
        this.loginError = this.loginError.bind(this);

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = /*html*/`
        <style>
        form {
            display: flex;
            flex-direction: column;
            width: 300px;
            margin: 0 auto;
            border: 1px solid #ccc;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            /*centrar form */
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            

        }
        input {
            margin: 5px 0;
        }
        </style>
        <form>
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <button type="submit">Login</button>
        </form>
        `;
        this.form = this.shadowRoot.querySelector('form');
    }
    onSubmit(e) {
        e.preventDefault();
        const username = this.form.querySelector('input[type="text"]').value;
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
