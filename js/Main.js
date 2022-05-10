//////* JUEGO DEL UNO V0.5 *//////

/*AL CARGAR LA WEB*/
window.addEventListener('DOMContentLoaded', webCargada);
function webCargada() {
    console.log("Web cargada");
    /*Habilitar boton de Inicio e Instrucciones*/
    btnIniciar.addEventListener("click", empezarJuego);
    btnInstrucciones.addEventListener('click', mostrarInstrucciones);
}

/////*SELECTORES HTML*/////
const btnIniciar = document.querySelector('#iniciar');
const btnInstrucciones = document.querySelector('#instrucciones');
const mazoCentral = document.querySelector('#mazo-central');
const cartasJugador = document.querySelector('#cartas-jugador');
const cartasMaquina = document.querySelector('#cartas-maquina');
const zonaJuego = document.querySelector('#cartas-mesa');
const btnFinalizar = document.querySelector('#zona-btn button');
const tituloJuego = document.querySelector('#zona-btn h1');
const pJugador = document.querySelector('.zona-jugador p');
const pMaquina = document.querySelector('.zona-maquina p');
const cartaMazo = document.querySelector('#mazo-central img');
const tablero = document.querySelector('#tablero');
const contenedor =document.querySelector('.contenedor-2');

/////*CONTROLADOR DE LOS TURNOS*/////
let turnoJugadores =0;
let colorMesa;


/////*SONIDOS DEL JUEGO*/////
let sonidoClick = new Audio();
sonidoClick.src = "./sound/click.mp3";
let sonidoAmbiente = new Audio();
sonidoAmbiente.src = "./sound/soundtrack.mp3"
let sonidoCarta = new Audio();
sonidoCarta.src = "./sound/card.mp3";
let sonidoRobar = new Audio();
sonidoRobar.src = "./sound/card_dealing.mp3"

/////*VARIABLES PARA LAS BARAJAS*/////
let baraja = [];
let barajaMazo = [];
let barajaJugador = [];
let barajaMaquina = [];
let barajaMesa = [];
let color, numero, tipo;
let id = 1;

////*EMPEZAR EL JUEGO*////
let firstClick = true;
function empezarJuego() {
    if (firstClick == true) {
        crearBaraja();
        setColorMesa();
        setTurno('1');
        gestionTurnos();
        eliminarElementos();
        addListenerCartas();
        obtenerCoordenadas();
        sonidoAmbiente.play();
        sonidoClick.play();
        firstClick = false;
    }
}

/////*FUNCIONNES PARA CREAR CARTAS Y BARAJAS*/////
/*Crea una carta y la añade a la baraja principal*/
function crearCarta(color, tipo, numInicio, cantidad) {
    for (let i = numInicio; i <= cantidad; i++) {
        let image = new Image();
        image.src="./img/cartas/"+ color + tipo + i + ".png";
        let imgBack= new Image();
        imgBack.src="./img/cartas/back.png";

        const carta = {
            color: color,
            numero: i,
            tipo: tipo,
            img: image,
            img2 : imgBack,
            id: id
        }
        baraja.push(carta);
        id++;
    }
}
/*CREAR BARAJA*/
function crearBaraja() {
    /*Cartas rojas*/
    crearCarta('rojo', 'normal', '0', '9');
    crearCarta('rojo', 'normal', '1', '9');
    /*crearCarta('rojo', '+2', '1' , '2');
    crearCarta('rojo', 'cambio-sentido', '1' , '2');
    crearCarta('rojo', 'bloqueo', '1' , '2');*/

    /*Cartas amarillas*/
    crearCarta('amarillo', 'normal', '0', '9');
    crearCarta('amarillo', 'normal', '1', '9');
    /*crearCarta('amarillo', '+2', '1' , '2');
    crearCarta('amarillo', 'cambio-sentido', '1' , '2');
    crearCarta('amarillo', 'bloqueo', '1' , '2');*/

    /*Cartas  azules*/
    crearCarta('azul', 'normal', '0', '9');
    crearCarta('azul', 'normal', '1', '9');
    /*crearCarta('azul', '+2', '1' , '2');
    crearCarta('azul', 'cambio-sentido', '1' , '2');
    crearCarta('azul', 'bloqueo', '1' , '2');*/

    /*Cartas verdes*/
    crearCarta('verde', 'normal', '0', '9');
    crearCarta('verde', 'normal', '1', '9');
    /*crearCarta('verde', '+2', '1' , '2');
    crearCarta('verde', 'cambio-sentido', '1' , '2');
    crearCarta('verde', 'bloqueo', '1' , '2');*/

    /*Cartas comodín*//*
    crearCarta('especial','cambio-color', '1', '4');
    crearCarta('especial','+4', '1', '4');*/

    /*BARAJAR MAZO*/
    let total = baraja.length;
    for (let i = 0; i < total; i++) {
        let cartaAleatoria = Math.floor(Math.random() * (baraja.length));
        carta = baraja[cartaAleatoria];
        barajaMazo.push(carta);
        baraja.splice(cartaAleatoria, 1);
    }

    /*Repartir las cartas a los jugadores*/
    repartirCartas(barajaJugador, 7);
    repartirCartas(barajaMaquina, 7);
    repartirCartas(barajaMesa, 1);

    /*Mostrar las cartas en el tablero*/
    mostrarCartas(barajaJugador, cartasJugador);
    mostrarCartasMaquina(barajaMaquina, cartasMaquina);
    mostrarCartas(barajaMesa, zonaJuego);
}

//////SECCIÓN DEL JUGADOR 1*//////
/*intentar mejorar*/
/*Seleccionar carta y descartarla*/

function addListenerCartas(){
    const selecCarta = document.querySelectorAll('#cartas-jugador img');
    selecCarta.forEach(img => {
        img.addEventListener('click', getIDcarta);
    });
}

function getIDcarta(e){
    e.preventDefault();
    const idCarta = this.getAttribute('data-item');
    let parent = e.target;
    console.log(parent);
    getCoords(parent);
    eliminarCarta(idCarta);
}

function eliminarCartaHTML(barajaHTML,id){
    barajaHTML.forEach(carta => {
        if(carta.getAttribute('data-item' == id )){
            console.log(carta);
            carta.remove();
        }
    });
}

function eliminarCartaMaquinaHTML(id){
    const listaCarta = document.querySelectorAll('#cartas-maquina img');
    listaCarta.forEach(carta => {
        if(carta.getAttribute('data-item') == id){
            carta.remove();
        }
    });
}

/*Eliminar carta*/
function eliminarCarta(id) {
    const listaCarta = document.querySelectorAll('#cartas-jugador img');
    /*carta del jugador*/
    let cartaJugador = getCarta(barajaJugador, id);
    /*carta que hay en la mesa*/
    let cartaMesa = getUltimaCarta(barajaMesa);
    /*Comparar si son del mismo color o numero y añadirla a la mesa*/
    let comparacion = compararCartas(cartaMesa, cartaJugador);
    if (comparacion){
        setCarta(barajaMesa, cartaJugador);
        mostrarCarta(zonaJuego, cartaJugador);
        //liminarCartaMesa();
        deleteCarta(barajaJugador, id)
        eliminarCartaHTML(listaCarta,id);
        setColorMesa();
        setTurno('0');
        sonidoCarta.play();
        ganar();
        gestionTurnos();
    }
}

/*SUMAR CARTA AL JUGADOR 1*/
let secondClick = false;
function sumarCarta() {
    if (secondClick == false) {
        añadirCarta(barajaJugador);
        carta = getUltimaCarta(barajaJugador);
        mostrarCarta(cartasJugador, carta);
        addListenerCartas();
        sonidoRobar.play();
        secondClick = true;
    }
}

/*FINALIZAR TURNO JUGADOR 1 */
let finalizarClick = false;
function finalizarTurno() {
    if (!finalizarClick) {
        sonidoClick.play();
        setTurno('0');
        gestionTurnos();
        finalizarClick=true;
    }
}

/*EVENTOS QUE SE ACTIVAN CUANDO ES EL TURNO DEL JUGADOR 1*/
function addEventListeners() {
    mazoCentral.addEventListener('click', sumarCarta);
    btnFinalizar.addEventListener('click', finalizarTurno);
}

////////////*SECCIÓN DEL JUGADOR 2*////////////
/*DESCARTAR CARTAS MAQUINA*/
function descartarCartaMaquina() {
    /*Lista de cartas del HTML*/
    const listaCarta = document.querySelectorAll('#cartas-maquina img');
    /*última carta de la mesa*/
    cartaMesa = getUltimaCarta(barajaMesa);
    /*comprobar cartas maquina*/
    for (let i = 0; i < listaCarta.length; i++) {
        let cartaMaquina = getCarta(barajaMaquina, listaCarta[i].getAttribute('data-item'));
        comparacion = compararCartas(cartaMesa, cartaMaquina);
        if (comparacion) {
            let cartaID = cartaMaquina.id;
            setCarta(barajaMesa, cartaMaquina);
            deleteCarta(barajaMaquina, cartaID);
            eliminarCartaMaquinaHTML(cartaID);
            eliminarCartaMesa();
            mostrarCarta(zonaJuego, cartaMaquina);
            setColorMesa();
            setTurno('1');
            sonidoCarta.play();
            console.log("Jugador 2 ha tirado una carta")
            ganar();
            gestionTurnos();
            break;
        } else if ((i + 1) == listaCarta.length) {
            añadirCarta(barajaMaquina);
            cartaMaquina = getUltimaCarta(barajaMaquina);
            comparacion = compararCartas(cartaMesa, cartaMaquina);
            cartaID = cartaMaquina.id;
            if (comparacion) {
                setCarta(barajaMesa, cartaMaquina);
                deleteLastCarta(barajaMaquina);
                eliminarCartaMesa();
                mostrarCarta(zonaJuego, cartaMaquina);
                setTurno('1');
                setColorMesa();
                sonidoCarta.play();
                console.log("Jugador 2 ha robado y tirado una carta")
                ganar();
                gestionTurnos();
                break;
            } else {             
                mostrarCartaMaquina(cartasMaquina, cartaMaquina);
                sonidoRobar.play();
                console.log("Jugador 2 ha robado una carta")
                setTurno('1');
                gestionTurnos();
                break;
            }
        }
    }
}
//////////////////////////////////////////////////////////////////////
/*ZONA DE FUNCIONES PARA EL JUEGO*/

/*FUNCION PARA REPARTIR LAS CARTAS*/
function repartirCartas(baraja, cantidad) {
    ultimaCarta = barajaMazo.length - 1;
    for (let i = ultimaCarta; i > (ultimaCarta - cantidad); i--) {
        carta = barajaMazo[i];
        baraja.push(carta);
        barajaMazo.splice(i, 1);
    }
}
/*AÑADIR CARTA DEL MAZO A LOS JUGADORES*/
function añadirCarta(baraja) {
    carta = getUltimaCarta(barajaMazo);
    setCarta(baraja, carta);
    deleteLastCarta(barajaMazo);
}
/*Muestra carta en el HTML*/
function mostrarCarta(zona, carta) {
    img = carta.img;
    let idCarta = carta.id;
    img.classList.add('carta'+idCarta);
    img.setAttribute('data-item',idCarta);
    zona.appendChild(img);
}
/*MOSTRAR BARAJA EN EL HTML*/
function mostrarCartas(baraja, zona) {
        baraja.forEach(carta => {
            mostrarCarta(zona, carta);
        })
}
/*Muestra carta maquina en el HTML*/
function mostrarCartaMaquina(zona, carta){
    img = carta.img2;
    let idCarta = carta.id;
    img.classList.add('carta'+idCarta);
    img.setAttribute('data-item',idCarta);
    zona.appendChild(img);
}
/*MOSTRAR BARAJA MAQUINA EN EL HTML*/
function mostrarCartasMaquina(baraja, zona) {
    baraja.forEach(carta => {
        mostrarCartaMaquina(zona, carta)
    })
}
/*ELIMINA LA CARTA DE LA MESA*/
function eliminarCartaMesa() {
    const cartasMesa = document.querySelector('#cartas-mesa img');
    cartasMesa.remove();
}

/*MUESTRA LAS INSTRUCCIONES DEL JUEGO*/
function mostrarInstrucciones() {
    const zonaInstrucciones = document.querySelector('#zona-intrucciones');
    if (zonaInstrucciones.classList.contains('ndisplay')) {
        zonaInstrucciones.classList.remove('ndisplay');
        btnIniciar.classList.add('ndisplay');
        sonidoClick.play();
    } else {
        zonaInstrucciones.classList.add('ndisplay');
        btnIniciar.classList.remove('ndisplay');
        sonidoClick.play();
    }
}

/*ELIMINAR ELEMENTOS DE HTML*/
function eliminarElementos() {
    btnIniciar.remove();
    btnInstrucciones.remove();
    btnFinalizar.classList.remove('ndisplay');
    tituloJuego.remove();
    pJugador.classList.remove('ndisplay');
    pMaquina.classList.remove('ndisplay');
    cartaMazo.classList.remove('ndisplay');
}

//////////////////////////////////////////////////////////////////////
///*FUNCIONES V2*/// 
/*Devuelve una carta*/
function getCarta(baraja, id) {
    let cartaE;
    baraja.forEach(carta => {
        if(carta.id == id){
            cartaE = carta; 
        }
    });
    return cartaE;
}
/*Devuelve el color de una carta*/
function getColorCarta(carta){
    color = carta.color;
    return color;
}
/*Devuelve la última carta de la baraja*/
function getUltimaCarta(baraja) {
    ultimaCarta = baraja.length - 1;
    carta = baraja[ultimaCarta];
    return carta;
}
/*Elimina una carta por IDs*/
function deleteCarta(baraja, id) {
    let contador = 0;
    baraja.forEach(carta => {
        if( carta.id == id){
            baraja.splice(contador, 1);
        }
        contador++;
    });
}
/*Elimina la última carta*/
function deleteLastCarta(baraja) {
    ultimaCarta = baraja.length - 1;
    baraja.splice(ultimaCarta, 1);
}
/*Añade una carta a la baraja*/
function setCarta(baraja, carta) {
    baraja.push(carta);
}
/*Compara 2 cartas por color y numero*/
function compararCartas(carta1, carta2) {
    if (carta1.color == carta2.color || carta1.numero == carta2.numero) {
        return true;
    } else {
        return false;
    }
}
/*TURNO DE LOS JUGADORES*/
function setTurno(turno){
    turnoJugadores=turno;
}
/* Obtener turno de los jugadores */
function getTurno(){
    return turnoJugadores;
}

function turnoJugador1(e){
    console.log("Es el turno del jugador 1");
    finalizarClick = false;
    addEventListeners();
}
/*COMPROBACION DE TURNOS*/
function gestionTurnos() {
    if (getTurno() == '1') {
        turnoJugador1();
    } else if(getTurno() == '0') {
        console.log("Es el turno del jugador 2");
        setTimeout(descartarCartaMaquina, 1500);
        secondClick = false;
    }
}
/*Seleccionar color Mesa*/
function setColorMesa(){
    carta = getUltimaCarta(barajaMesa);
    colorMesa = carta.color;
}
/*Obtener color Mesa*/
function getColorMesa(){
    return colorMesa;
}

function ganar(){
    if(barajaJugador.length == 0){
        tablero.remove();
        let div = document.createElement('div');
        div.classList.add('ganar');
        div.classList.add('text-center');
        div.innerHTML = `
        <h1 class="texto-blanco">¡Has ganado!</h1>`;
        contenedor.appendChild(div);
        console.log("Gana el jugador 1");
    } else if(barajaMaquina.length == 0){
        tablero.remove();
        let div = document.createElement('div');
        div.classList.add('ganar');
        div.classList.add('text-center');
        div.innerHTML = `
        <h1 class="texto-blanco">Has perdido ;(...</h1>`;
        contenedor.appendChild(div);
        console.log("Gana el jugador 2");
    }
}

/*falta añadir funcion para seleccionar color de mesa (setColorMesa)*/
/*Funcion para comparar color carta con color mesa*/
/*añadir funcion de cartas comodin +2*/
/*añadir funcion de cartas comodin +4 y seleccionar color mesa*/
/*añadir funcion de cartas comodin cambiar de color*/
/*Mostrar por pantalla el turno actual + acciones jugador 2*/
/* Mostrar FIN DEL JUEGO |GANADOR| PERDEDOR | */
////////////////////////////////////////////////////////////////////////*

///////////////////// FUNCIONES V3 ANIMACIONES //////////////////////////

window.addEventListener('scroll',obtenerCoordenadas);

function obtenerCoordenadas(elemento){
    const bodyRect = document.body.getBoundingClientRect();
    const cartaEnMesa = document.querySelector('#cartas-mesa');
    let posicion = cartaEnMesa.getBoundingClientRect();
    let x = posicion.left - bodyRect.clientX;
    let y = bodyRect.top - posicion.top;
 
    
}

function getCoords(elemento){
    const cartaEnMesa = document.querySelector('#cartas-mesa');
    let posicion = cartaEnMesa.getBoundingClientRect();

    let pos = elemento.getBoundingClientRect();
    let x = posicion.left - pos.left;
    let y = posicion.top - pos.top;
    console.log(x + " " +y);
    animarCarta(elemento,x,y);
}

function animarCarta(elemento, x,y){
    gsap.to(elemento,{
        duration: 1,
        x: x,
        y: y,
        ease: 'bouce.out'
    });
}