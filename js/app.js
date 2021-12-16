// Formulario
const criptoMonedasSelect = document.querySelector("#criptomonedas");
const monedasSelect = document.querySelector("#moneda");
const criptomonedasSelect = document.querySelector("#criptomonedas");

const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");

const objBusqueda = {
	moneda: "",
	criptomoneda: "",
};

// Crear un promise
const obtenerCriptomonedas = (criptomonedas) =>
	new Promise((resolve) => {
		resolve(criptomonedas);
	});

document.addEventListener("DOMContentLoaded", () => {
	consultarCriptomonedas();

	formulario.addEventListener("submit", submitFormulario);
	criptomonedasSelect.addEventListener("change", leerValor);
	monedasSelect.addEventListener("change", leerValor);
});

function submitFormulario(e) {
	e.preventDefault();

	// Validar
	const { moneda, criptomoneda } = objBusqueda;
	if (moneda === "" || criptomoneda === "") {
		mostrarAlerta("Ambos campos son obligatorios");
		return;
	}

	// Consultar la api con los resultados
	consultarApi();
}

function consultarApi() {
	const { moneda, criptomoneda } = objBusqueda;

	const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

	mostrarSpinner();

	fetch(url)
		.then((respuesta) => respuesta.json())
		.then((cotizacion) => {
			mostrarCotizacion(cotizacion.DISPLAY[criptomoneda][moneda]);
		});
}

function mostrarSpinner() {
	limpiarHTML();

	const spinner = document.createElement("DIV");
	spinner.classList.add("spinner");

	spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

	resultado.appendChild(spinner);
}

function mostrarCotizacion(cotizacion) {
	limpiarHTML();
	const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

	// Precio
	const precio = document.createElement("P");
	precio.classList.add("precio");
	precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

	// Precio alto
	const precioAlto = document.createElement("P");
	precioAlto.innerHTML = `El precio más alto del día: <span>${HIGHDAY}</span>`;

	// Precio Bajo
	const precioBajo = document.createElement("P");
	precioBajo.innerHTML = `El precio más bajo del día: <span>${LOWDAY}</span>`;

	// Precio de la ultima hora
	const ultimasHoras = document.createElement("P");
	ultimasHoras.innerHTML = `Variación del las ultimas 24hrs: <span>${CHANGEPCT24HOUR}%</span>`;

	// Ultima Actualizacion
	const ultimaActualizacion = document.createElement("P");
	ultimaActualizacion.innerHTML = `Ultima Actualización: <span>${LASTUPDATE}</span>`;

	resultado.appendChild(precio);
	resultado.appendChild(precioAlto);
	resultado.appendChild(precioBajo);
	resultado.appendChild(ultimasHoras);
	resultado.appendChild(ultimaActualizacion);
}

function limpiarHTML() {
	while (resultado.firstChild) {
		resultado.removeChild(resultado.firstChild);
	}
}

function mostrarAlerta(mensaje) {
	const alertaExistente = document.querySelector(".error");
	if (alertaExistente) return;

	const divMensaje = document.createElement("DIV");
	divMensaje.classList.add("error");

	// Mensaje de error
	divMensaje.textContent = mensaje;
	formulario.appendChild(divMensaje);

	setTimeout(() => {
		divMensaje.remove();
	}, 3000);
}

function leerValor(e) {
	objBusqueda[e.target.name] = e.target.value;
	if (objBusqueda.criptomoneda === "" || objBusqueda.moneda === "") return;
	consultarApi();
}

// Inspeccionar la api
function consultarCriptomonedas() {
	const url =
		"https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

	fetch(url)
		.then((respuesta) => respuesta.json())
		.then((respuestaJson) => obtenerCriptomonedas(respuestaJson.Data))
		.then((criptomonedas) => selectCriptomonedas(criptomonedas));
}

function selectCriptomonedas(criptomonedas) {
	criptomonedas.forEach((criptomoneda) => {
		const { FullName, Name } = criptomoneda.CoinInfo;

		const option = document.createElement("OPTION");
		option.value = Name;
		option.textContent = FullName;

		// Insertar en el dom
		criptoMonedasSelect.appendChild(option);
	});
}
