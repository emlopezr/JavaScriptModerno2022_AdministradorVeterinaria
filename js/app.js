// CLASES

class Citas {
    constructor() {
        this.citas = [];
    }

    agregarCita(cita) {
        this.citas = [...this.citas, cita];
    }

    eliminarCita(id) {
        this.citas = this.citas.filter(cita => cita.id !== id);
    }

    editarCita(citaActualizada) {
        // Si la cita del arreglo es la que estamos cambiando, reescribir su valor, si no, dejarlo como antes
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita)
    }
}

class UI {
    mostrarAlerta(mensaje, tipo, tiempo) {
        // Crear el elemento HTML
        const div = document.createElement('DIV');
        div.classList.add('text-center', 'alert', 'd-block', 'col-12');
        div.textContent = mensaje;

        // Tipos de alertas
        if (tipo === 'error') {
            div.classList.add('alert-danger');
        } else {
            div.classList.add('alert-success');
        }

        // Insertar en el DOM
        document.querySelector('#contenido').insertBefore(div, document.querySelector('.agregar-cita'));

        // Quitar mensaje luego de cierto tiempo
        setTimeout(() => div.remove(), tiempo * 1000);
    }

    imprimirCitas({ citas }) { // Destructuring -> Extraer las citas del objeto que se le pase
        // Limpiar HTML previo
        while (contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }

        // Iterar sobre el arreglo de citas
        citas.forEach(cita => {
            // Destucturing de la cita
            const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

            // Generar el HTML de la cita
            const divCita = document.createElement('DIV');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            // Scripting de los elementos de la cita
            const h2Mascota = document.createElement('h2');
            h2Mascota.classList.add('card-title', 'font-weight-bolder');
            h2Mascota.textContent = mascota;

            const pPropietario = document.createElement('p');
            pPropietario.innerHTML = `
                <span class="font-weight-bolder">Propietario: </span> ${propietario}
            `;

            const pTelefono = document.createElement('p');
            pTelefono.innerHTML = `
                <span class="font-weight-bolder">Telefono: </span> ${telefono}
            `;

            const pFecha = document.createElement('p');
            pFecha.innerHTML = `
                <span class="font-weight-bolder">Fecha: </span> ${fecha}
            `;

            const pHora = document.createElement('p');
            pHora.innerHTML = `
                <span class="font-weight-bolder">Hora: </span> ${hora}
            `;

            const pSintomas = document.createElement('p');
            pSintomas.innerHTML = `
                <span class="font-weight-bolder">Sintomas: </span> ${sintomas}
            `;

            // Botón para elminiar la cita
            const btnEliminar = document.createElement('BUTTON');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = `Eliminar <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
            btnEliminar.onclick = () => eliminarCita(id);

            // Botón para editar la cita
            const btnEditar = document.createElement('BUTTON');
            btnEditar.classList.add('btn', 'btn-info', 'mr-2');
            btnEditar.innerHTML = `Editar <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>`;
            btnEditar.onclick = () => cargarEdicion(cita);

            // Agregar todos los elementos al div
            divCita.appendChild(h2Mascota);
            divCita.appendChild(pPropietario);
            divCita.appendChild(pTelefono);
            divCita.appendChild(pFecha);
            divCita.appendChild(pHora);
            divCita.appendChild(pSintomas);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            // Agregar la cita al DOM
            contenedorCitas.appendChild(divCita);
        });
    }
}

// VARIABLES, SELECTORES E INSTANCIAS GLOBALES

// Modo de edición
let modoEdicion;

// Inputs
const inpMascota = document.querySelector('#mascota');
const inpPropietario = document.querySelector('#propietario');
const inpTelefono = document.querySelector('#telefono');
const inpFecha = document.querySelector('#fecha');
const inpHora = document.querySelector('#hora');
const inpSintomas = document.querySelector('#sintomas');

// Otros selectores
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

// Objeto de la cita
const objCita = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}

// Instancias
const adminCitas = new Citas();
const ui = new UI();

// EVENTS

eventListeners();
function eventListeners() {
    // Llenar los datos de la cita (Objeto)
    inpMascota.addEventListener('input', datosCita);
    inpPropietario.addEventListener('input', datosCita);
    inpTelefono.addEventListener('input', datosCita);
    inpFecha.addEventListener('input', datosCita);
    inpHora.addEventListener('input', datosCita);
    inpSintomas.addEventListener('input', datosCita);

    // Validar el formulario y agregar una nueva cita
    formulario.addEventListener('submit', nuevaCita)
}

// FUNCIONES

function datosCita(e) {
    objCita[e.target.name] = e.target.value;
}

function nuevaCita(e) {
    e.preventDefault(); // Prevenir acción predeterminada

    // Extraer información del objeto de cita
    const { mascota, propietario, telefono, fecha, hora, sintomas } = objCita;

    // Validar los campos obligatorios
    if (mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '') {
        ui.mostrarAlerta('Todos los campos son obligatorios', 'error', 5);
        return;
    }

    if (modoEdicion) {
        // Editar el objeto de la cita -> No pasar la referencia del objeto global si no una copia
        adminCitas.editarCita({ ...objCita });

        // Cambiar el texto del botón "Editar" por "Crear"
        formulario.querySelector('button[type="submit"]').textContent = 'Crear cita';

        // Mostrar un mensaje de "Correcto"
        ui.mostrarAlerta('Cita actualizada correctamente', 'correcto', 5)

        // Deshabilitar el modo edición
        modoEdicion = false;
    } else {
        // Generar un ID único para cada cita
        objCita.id = Date.now();

        // Agregar la cita -> No pasar la referencia del objeto global si no una copia
        adminCitas.agregarCita({ ...objCita });

        // Mostrar un mensaje de "Correcto"
        ui.mostrarAlerta('Cita añadida correctamente', 'correcto', 5)
    }

    // Reiniciar el formulario, el objeto y 
    formulario.reset();
    reiniciarObjeto();

    // Imprimir en el HTML de las citas
    ui.imprimirCitas(adminCitas);
}

function reiniciarObjeto() {
    objCita.mascota = '';
    objCita.propietario = '';
    objCita.telefono = '';
    objCita.fecha = '';
    objCita.hora = '';
    objCita.sintomas = '';
}

function eliminarCita(id) {
    // Eliminar la cita
    adminCitas.eliminarCita(id);

    // Mostrar alerta de "Correcto"
    ui.mostrarAlerta('Cita eliminada correctamente', 'correcto', 5)

    // Refrescar las citas en el HTML
    ui.imprimirCitas(adminCitas);
}

function cargarEdicion(cita) {
    // Cargar los datos de la cita
    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    // Llenar los inputs y el objeto global
    inpMascota.value = mascota;
    objCita.mascota = mascota;

    inpPropietario.value = propietario;
    objCita.propietario = propietario;

    inpTelefono.value = telefono;
    objCita.telefono = telefono;

    inpFecha.value = fecha;
    objCita.fecha = fecha;

    inpHora.value = hora;
    objCita.hora = hora;

    inpSintomas.value = sintomas;
    objCita.sintomas = sintomas;

    objCita.id = id;

    // Cambiar el texto del botón "Crear" por "Editar"
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar cambios';

    // Activar el modo edición
    modoEdicion = true;
}