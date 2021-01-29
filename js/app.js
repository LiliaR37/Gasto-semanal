
//Variables 
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');





//Eventos 
eventListeners()
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto)
}

//Clases

class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {

        //Agregarlo al []

        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }
    calcularRestante() {
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
        console.log(this.restante);

    }
    eliminarGasto(id) {
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante()

        console.log(this.gastos);
    }

}

class UI {
    insertarPresupuesto(cantidad) {

        //Se extraen los valores
        const { presupuesto, restante } = cantidad;

        //Se agrega al html 
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;

    }
    imprimirAlerta(mensaje, tipo) {
        // Creación de div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger')
        } else {
            divMensaje.classList.add('alert-success');
        }

        //Agregar el mensaje
        divMensaje.textContent = mensaje;

        //Insertar en el html
        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        //Quitar alerta

        setTimeout(() => {
            divMensaje.remove();

        }, 3000);

    }
    mostrarGastos(gastos) {
        //Limpia HTML
        this.limpiarHTML()
        gastos.forEach(gasto => {

            const { cantidad, nombre, id } = gasto;

            //Crear li
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;

            //Agregar el HTML del gasto
            nuevoGasto.innerHTML = `
            ${nombre} <span class="badge badge-primary badge-pill"> ${cantidad}</span> `;

            //Agregar Btn borrar 
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');

            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }

            btnBorrar.innerHTML = 'Borrar &times'

            nuevoGasto.appendChild(btnBorrar);

            //Agregar al HTML
            gastoListado.appendChild(nuevoGasto);





        });
    }
    limpiarHTML() {
        while (gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }
    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    }
    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj;

        const restanteDiv = document.querySelector('.restante')

        //Comprobar el 25%
        if ((presupuesto / 4) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if ((presupuesto / 2) > restante) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');


        }

        if (restante <= 0) {
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;

        }
    }
}


const ui = new UI();
let presupuesto;

// Funciones 

function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('¿Cuál es tu presupuesto?');

    // Validación
    if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload();
    }


    //Presupuesto válido
    presupuesto = new Presupuesto(presupuestoUsuario);
    console.log(presupuesto);

    ui.insertarPresupuesto(presupuesto)
}



function agregarGasto(e) {
    e.preventDefault();
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    if (nombre === '' || cantidad === '') {
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
        return;

    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('Cantidad no válida', 'error');
        return;

    }

    //Generar un objeto de tipo gasto
    const gasto = { nombre, cantidad, id: Date.now() };

    presupuesto.nuevoGasto(gasto);

    //Imprimir mensaje de agregado correctamente 
    ui.imprimirAlerta('Gasto agregado correctamente..');

    //Imprimir los gastos 
    const { gastos, restante } = presupuesto
    ui.mostrarGastos(gastos);

    //Actualizar restante
    ui.actualizarRestante(restante);

    //Comprobar Presupuesto
    ui.comprobarPresupuesto(presupuesto);

    //Reset de formulario
    formulario.reset();


}

function eliminarGasto(id) {
    presupuesto.eliminarGasto(id);

    //Elimina del HTML
    const { gastos, restante } = presupuesto;

    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}