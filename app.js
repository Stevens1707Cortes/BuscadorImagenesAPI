
// Variables
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const paginacion = document.querySelector('#paginacion');

const registrosPorPagina = 30;
let totalPaginas;
let iterador;
let paginaActual = 1;

// EventListeners
window.onload = () => {

    //Validar Formulario
    formulario.addEventListener('submit', validarFormulario);

    //
}

// Funciones

function validarFormulario(e) {
    e.preventDefault();
    
    const inputBusqueda = document.querySelector('#termino').value;

    if (inputBusqueda === '') {
        mostrarAlerta('El campo esta vacio');

        return;
    }

    //Reiniciar paginador al realizar una nueva busqueda
    paginaActual = 1;

    // Consultar API Pixabay
    buscarImagenes();
    
}

function buscarImagenes() {
    const inputBusqueda = document.querySelector('#termino').value;
    // Preparar entrada de busqueda

    const palabras = inputBusqueda.split(" "); // El espacio se utiliza como caracter separador
    const terminoBusqueda = palabras.join("+"); // Se le agrega un +, en el lugar donde estaba el espacio

    // Consultar API
    const apiKey = '40672188-9fdc1ef156d0f5b2c67e944f6';
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${terminoBusqueda}&per_page=${registrosPorPagina}&page=${paginaActual}`;
    console.log(url);

    fetch(url)
        .then( resultado => resultado.json())
        .then( datos => {
            totalPaginas = calcularPaginas(datos.totalHits)
            mostrarImagenes(datos.hits);
        })
}

//Generador que va  a registrar la cantidad de elementos de acuerdo a las paginas
function *crearPaginador(total) {
    for (let i = 1; i <= total; i++) {
        yield i;
        
    }
}

function calcularPaginas(total) {
    return parseInt(Math.ceil(total / registrosPorPagina));
}

function mostrarImagenes(imagenes) {
    
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }


    // Iterar sobre arreglo de imagenes
    imagenes.forEach(imagen => {
        const {previewURL, likes, views, largeImageURL} = imagen;
        // console.log(imagen);

        resultado.innerHTML += `
        <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
            <div class="bg-white">
                <img class="w-full" src="${previewURL}">

                <div class="p-4">
                    <p class="font-bold">${likes} <span class="font-light">Me gusta</span> </p>
                    <p class="font-bold">${views} <span class="font-light">Veces vista</span> </p>

                    <a 
                    class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1" 
                    href="${largeImageURL}" target="_blank" rel="noopener noreferrer">Ver imagen
                    </a>
                </div>
            </div>
        </div>
        `;
    });

    // Limpiar paginador

    while (paginacion.firstChild) {
        paginacion.removeChild(paginacion.firstChild);
    }

    imprimirPaginador();
}


function mostrarAlerta(mensaje) {
    const existeAlerta = document.querySelector('.alerta');

    if (!existeAlerta) {
        const alerta = document.createElement('p');
        alerta.className = 'alerta bg-red-100 border-red-400 text-red-700 px-4 py-3 rounded max-w-lg mt-6 text-center';
        alerta.innerHTML = `
            <strong class="font-bold">Error:</strong>
            <span class="block sm:inline">${mensaje}</span>
        `;

        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
    
}

function imprimirPaginador() {
    iterador = crearPaginador(totalPaginas);

    while (true) {
        const {value, done} = iterador.next(); // .next() para despertar al generador
    
        if (done) return;

        // Generar boton por cada elemento en el generador
        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.className = 'siguiente bg-yellow-400 px-4 py-1 mr-2 font-bold mb-5 rounded';
        boton.onclick = () => {

            paginaActual = value;

            buscarImagenes();
        }
        
        paginacion.appendChild(boton);
    }
}