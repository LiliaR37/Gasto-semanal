
//Variables 
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');





//Eventos 
eventListeners()
function eventListeners() {
    document.addEventListener('DOMContentLoaded',preguntarPresupuesto);

    formulario.addEventListener('submit',agregarGasto)
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

        this.gastos = [...this.gastos,gasto];
        console.log(this.gastos);
    }

}

class UI {
    insertarPresupuesto(cantidad) {
       
        //Se extraen los valores
        const {presupuesto, restante} = cantidad;

        //Se agrega al html 
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;

    }
    imprimirAlerta(mensaje, tipo) {
        // Creación de div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center','alert');

        if(tipo === 'error') {
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
    agregarGastoListado(gastos) {
        //Limpia HTML
        this.limpiarHTML() 
        gastos.forEach(gasto => {
            
            const {cantidad, nombre, id} = gasto;

            //Crear li
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;

            //Agregar el HTML del gasto
            nuevoGasto.innerHTML = `
            ${nombre} <span class="badge badge-primary badge-pill"> ${cantidad}</span> `;

            //Agregar Btn borrar 
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn','btn-danger','borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times'

            nuevoGasto.appendChild(btnBorrar);

            //Agregar al HTML
            gastoListado.appendChild(nuevoGasto);




            
        });
    }
    limpiarHTML() {
        while(gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }
}


const ui = new UI();
let presupuesto;

// Funciones 

 function preguntarPresupuesto() {
        const presupuestoUsuario = prompt('¿Cuál es tu presupuesto?');
        
    // Validación
        if(presupuestoUsuario === '' || presupuestoUsuario === null ||  isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
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

        if(nombre === '' || cantidad === ''){
            ui.imprimirAlerta('Todos los campos son obligatorios','error');
            return;

        } else if (cantidad <= 0 || isNaN(cantidad)) {
            ui.imprimirAlerta('Cantidad no válida','error');
            return;

        }

        //Generar un objeto de tipo gasto
         const gasto = {nombre, cantidad, id: Date.now()};

         presupuesto.nuevoGasto(gasto);

         //Imprimir mensaje de agregado correctamente 
         ui.imprimirAlerta('Gasto agregado correctamente..');

        //Imprimir los gastos 
         const { gastos } = presupuesto
         ui.agregarGastoListado(gastos);

         //Reset de formulario
         formulario.reset();
         


    }