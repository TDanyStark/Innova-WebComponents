// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
// import firestore
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
  setDoc,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6PdFpNxQilnubzDnIeB4wedMgD-Nlv6o",
  authDomain: "innova-system.firebaseapp.com",
  projectId: "innova-system",
  storageBucket: "innova-system.appspot.com",
  messagingSenderId: "573259188991",
  appId: "1:573259188991:web:904df210bd04239d87daca",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// TITLE: SMS Bot Telegram

let enviarMensaje = async (sms) => {
  let TOKEN = '6158754389:AAHgxVsb6hOVqah1I7f7L_8Gwf3PPr4mjKE'
  let URL = `https://api.telegram.org/bot${TOKEN}/sendMessage`
  let chat_id = -1001461846906

  let data = {
    chat_id,
    text: sms,
    parse_mode: 'HTML'
  }  
  
  fetch(URL, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
          'Content-Type': 'application/json'
      }
  })
}

let sms = '📦';
// enviarMensaje(sms);



//////////////////

let auth = getAuth();
let estadoSesion = null;
let intervalo;
//duración de la sesión 4 horas
let duracionSesion = 1000 * 60 * 60 * 8; // 8 horas
onAuthStateChanged(auth, (user) => {
	if (user) {
    intervalo = setTimeout(() => {
    	auth.signOut()
        .then(() => {
          // Sign-out successful.
          console.log('sesión cerrada');
        	location.hash = "#/login";
        })
        .catch((error) => {
          // An error happened.
        });
    	}, duracionSesion);
	}
	return;
});

onAuthStateChanged(auth, async (user) => {
	if (user) {
    estadoSesion = user;
	} else {
    console.warn('no hay usuario')
    estadoSesion = false;
	}
});

export let signInEmail = (email, password, cbSuccess, cbError) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      cbSuccess(user);
    })
    .catch((error) => {
      cbError(error);
      const errorCode = error.code;
      const errorMessage = error.message;
    });
};

export let CerrarSesion = (cbSuccess, cbError) => {
  auth
    .signOut()
    .then(() => {
      // Sign-out successful.
      //clear interval
      clearTimeout(intervalo);
      cbSuccess();

    })
    .catch((error) => {
      // An error happened.
      cbError(error);
    });
};

/////////////////firestore/////////////////////
const db = getFirestore();
export let getCollection = async (collectionName) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  let docs = [];
  querySnapshot.forEach((doc) => {
    docs.push({ id: doc.id, ...doc.data() });
  });
  return docs;
};

// funcion que retorne true si se encuentra un documento con el mismo id
export let Admin = async (id) => {
  const docRef = doc(db, "admins", id);
  const docSnap = await getDoc(docRef);

  return new Promise((resolve, reject) => {
    if (docSnap.exists()) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
};

// funcion que retorne true si se encuentra un un id en la coleccion de usuarios
export let clienteFound = async (id) => {
  const docRef = doc(db, "clientes", id);
  const docSnap = await getDoc(docRef);

  return new Promise((resolve, reject) => {
    if (docSnap.exists()) {
      //retorne el documento
      resolve(docSnap.data());
    } else {
      resolve(false);
    }
  });
};

// guardar en la base de datos firestore
export let guardarCliente = async (data) => {
  let { $celular, $nombre } = data;
  const docData = {
    celular: $celular,
    nombre: $nombre,
    fecha_creacion: Timestamp.fromDate(new Date()),
  };
  try {
    await setDoc(doc(db, "clientes", $celular), docData);

    let sms =`<b>🥳 Nuevo Cliente 🥳 </b> \n`;
    sms += `<b>Nombre: </b> ${$nombre} \n`;
    sms += `<b>Celular: </b> ${$celular} \n`;
    enviarMensaje(sms);

    return true;
  } catch (e) {
    return e;
  }
};

// guardar en la base datos firestore un producto
export let guardarProducto = async (data) => {
  let { id, descripcion, precio_compra, precio, cantidad_inventario, proveedor, usuario } = data;
  precio_compra = Number(precio_compra);
  precio = Number(precio);
  cantidad_inventario = Number(cantidad_inventario);
  let docData = {
    id,
    descripcion,
    precio,
    precio_compra,
    cantidad_inventario,
    proveedor,
    usuario,
  };
  console.log(docData)
  try {
    await setDoc(doc(db, "productos", id), docData);

    let sms =`<b>📦 Nuevo Producto 📦</b> \n`;
    sms += `<b>Descripcion:</b> ${descripcion} \n`;
    sms += `<b>Cantidad:</b> ${cantidad_inventario} \n`;
    sms += `<b>Precio Compra:</b> ${precio_compra} \n`;
    sms += `<b>Precio:</b> ${precio} \n`;
    sms += `<b>Usuario:</b> ${usuario} \n`;
    
    enviarMensaje(sms);

    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

// buscar un producto en la base de datos
export let buscarProducto = async (id) => {
  const docRef = doc(db, "productos", id);
  const docSnap = await getDoc(docRef);

  return new Promise((resolve, reject) => {
    if (docSnap.exists()) {
      //retorne el documento
      resolve(docSnap.data());
    } else {
      resolve(false);
    }
  });
};

// realizar consulta donde la descripcion contenga la palabra buscada
export let buscarProductoDescripcionLike = async (descripcion) => {
  const querySnapshot = await getDocs(collection(db, "productos"));
  let docs = [];
  querySnapshot.forEach((doc) => {
    // convertir a minusculas
    descripcion = descripcion.toLowerCase();
    let info = doc.data().descripcion.toLowerCase();
    if (info.includes(descripcion)) {
      docs.push({ id: doc.id, ...doc.data() });
    }
  });
  return docs;
};

//guardar en la base de datos firestore una venta
export let guardarVenta = async (data) => {
  let { celular, nombre, productos, metodoPago, abono, total, descuento, vendedor } = data;
  let id = new Date().getTime();
  const docData = {
    id,
    celular,
    nombre,
    productos,
    abono,
    total,
    descuento,
    vendedor,
    metodoPago,
  };
  id = id.toString();

  // console.log(docData);
  try {
    await setDoc(doc(db, "ventas", id), docData);

    let sms =`<b>✅ Nueva Venta ✅ </b> \n`;
    sms += `<b>Cliente:</b> ${nombre} \n`;
    sms += `<b>Productos:</b> \n`;
    productos.forEach((producto) => {
      sms += `=> <i>${producto.descripcion}</i> \n`;
    });
    sms += `<b>Abono:</b> ${abono} \n`;
    sms += `<b>Total:</b> ${total} \n`;
    sms += `<b>Descuento:</b> ${descuento} \n`;
    sms += `<b>Metodo de Pago:</b> ${metodoPago} \n`;
    sms += `<b>Vendedor:</b> ${vendedor.split("@")[0]} \n`;
    enviarMensaje(sms);

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export let obtenerDataforId = async (collectionName, id) => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  return new Promise((resolve, reject) => {
    if (docSnap.exists()) {
      //retorne el documento
      resolve(docSnap.data());
    } else {
      resolve(false);
    }
  });
};

export let obtenerData = async (collectionName) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  let docs = [];
  querySnapshot.forEach((doc) => {
    docs.push({ id: doc.id, ...doc.data() });
  });
  return docs;
};

export let eliminarData = async (collectionName, id) => {
  try {
    await deleteDoc(doc(db, collectionName, id));

    let sms =`<b>❌ Datos Eliminados ❌ </b> \n`;
    sms += `<b>Id:</b> ${id} \n`;
    sms += `<b>Collection:</b> ${collectionName} \n`;
    enviarMensaje(sms);

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export let editarData = async (collectionName, id, data) => {
  try {
    await updateDoc(doc(db, collectionName, id), data);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export let editDocMerge = async (collectionName, id, data) => {
  try{
    const referencia = doc(db, collectionName, id);
    await setDoc(referencia, data, { merge: true });
    return true;
  }catch(e){
    console.log(e);
    return false;
  }
}
export let obtenerDataWhere = async (collectionName, field, operator, value) => {
  const querySnapshot = await getDocs(query(collection(db, collectionName), where(field, operator, value)));
  let docs = [];
  
  querySnapshot.forEach((doc) => {
    if(doc.data().vendedor == estadoSesion.email || window.isAdmin){
      docs.push({ id: doc.id, ...doc.data() });
    }
  });
  console.log('firebase ',docs);
  return docs;
}

/// NOTE:  Agregar datos a la coleccion servicioTecnico
export let guardarServicioTecnico = async (data) => {
  let {id, recibo, cliente, celular, equipo, marca, cargador, existePedido, fallaReportada, observaciones, abono, total, estado,fechaSalida, PagadoATecnico, vendedor } = data;
  const docData = {
    id : parseInt(id),
    cliente,
    celular,
    equipo,
    marca,
    cargador,
    fallaReportada,
    observaciones,
    abono,
    total,
    estado,
    fechaSalida,
    PagadoATecnico,
    recibo,
    vendedor,
    existePedido,
  };
  // sumar el recibo +1 en la base de datos
  await editDocMerge("data", "recibo", {Nrecibo: parseInt(recibo) + 1});

  console.log(docData);
  id = id.toString();
  try {
    await setDoc(doc(db, "servicioTecnico", id), docData);

    let sms =`<b>⚙️ Nuevo Servicio Técnico 🪛</b> \n`;
    sms += `<b>Cliente:</b> ${cliente} \n`;
    sms += `<b>Equipo:</b> ${equipo} \n`;
    sms += `<b>Marca:</b> ${marca} \n`;
    sms += `<b>Cargador:</b> ${cargador} \n`;
    sms += `<b>Falla:</b> ${fallaReportada} \n`;
    sms += `<b>Abono:</b> ${abono} \n`;
    sms += `<b>Total:</b> ${total} \n`;
    sms += `<b>Vendedor:</b> ${vendedor.split("@")[0]} \n`;

    enviarMensaje(sms);

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

// obtener los servicios tecnicos en un rango de fechas
export let obtenerServiciosTecnicosDateStarttoEnd = async (fechaInicio, fechaFin) => {
  const querySnapshot = await getDocs(query(collection(db, "servicioTecnico"), where("id", ">=", fechaInicio), where("id", "<=", fechaFin)));
  let docs = [];
  querySnapshot.forEach((doc) => {
    docs.push({ id: doc.id, ...doc.data() });
  });
  return docs;
};


// TITLE: Pedidos
//guardar pedidos en la base de datos firestore
export let guardarPedido = async (data) => {
  let { inST, idST, cliente, celular, pedido, estado, abono, total,recibo } = data;
  let id = new Date().getTime();
  const docData = {
    id: parseInt(id),
    inST,
    idST,
    recibo,
    cliente,
    celular,
    estado,
    pedido,
    abono,
    total,
    vendedor: estadoSesion.email,
  };
  id = id.toString();

  console.log(docData);
  try {
    await setDoc(doc(db, "pedidos", id), docData);

    let sms =`<b>💸 Nuevo Pedido 💸 </b> \n`;
    sms += `<b>Cliente:</b> ${cliente} \n`;
    sms += `<b>Equipo:</b> ${pedido} \n`;
    sms += `<b>Abono:</b> ${abono} \n`;
    sms += `<b>Total:</b> ${total} \n`;
    sms += `<b>Vendedor:</b> ${estadoSesion.email.split("@")[0]} \n`;
    enviarMensaje(sms);

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

// obtener los pedidos en un rango de fechas
export let obtenerPedidosDateStarttoEnd = async (fechaInicio, fechaFin) => {
  const querySnapshot = await getDocs(query(collection(db, "pedidos"), where("id", ">=", fechaInicio), where("id", "<=", fechaFin)));
  let docs = [];
  querySnapshot.forEach((doc) => {
    docs.push({ id: doc.id, ...doc.data() });
  });
  return docs;
};

//guardar data en la base de datos firestore
export let guardarData = async (collectionName, data) => {
  let { id, ...rest } = data;
  const docData = {
    id: parseInt(id),
    ...rest,
  };
  id = id.toString();
  try {
    await setDoc(doc(db, collectionName, id), docData);

    let sms =`<b>👨🏻‍💻 Nuevos Datos En el Sistema 👨🏻‍💻 </b> \n`;
    sms += `<b>ID:</b> ${id} \n`;
    sms += `<b>Coleccion:</b> ${collectionName} \n`;
    enviarMensaje(sms);


    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};



export { estadoSesion };
