//Sonidos e imagenes
const sonidoGameOver = new Audio("gameover8bit.mp3")
const sonidoComida = new Audio("comida8bit.mp3")
const imagenManzana = new Image()
imagenManzana.src = "manzana.png"
//Explica que aquí se preparan los sonidos y la manzana como imagen.

// Canvas y elementos del DOM
const lienzo = document.querySelector("#gameBoard")
const pincel = lienzo.getContext("2d")
const textoPuntaje = document.querySelector("#scoreText")
const botonReiniciar = document.querySelector("#resetBtn")

const anchoLienzo = lienzo.width
const altoLienzo = lienzo.height
const colorFondo = "#f4f4f4"

//Configuración del juego
const tamañoBloque = 25
const colorSerpiente = "#00cc99"
const bordeSerpiente = "#333"

let estaJugando = false
let velocidadX = tamañoBloque
let velocidadY = 0
let puntaje = 0
let temporizador

let comidaX
let comidaY

//Aquí se obtienen elementos del DOM, se define el tamaño del canvas, colores, y se inicializa el estado del juego.

let serpiente = [
    { x: tamañoBloque * 4, y: 0 },
    { x: tamañoBloque * 3, y: 0 },
    { x: tamañoBloque * 2, y: 0 },
    { x: tamañoBloque, y: 0 },
    { x: 0, y: 0 }
];
//representa la posición de cada segmento, se inicializa con 5 segmentos en fila.


//Eventos
window.addEventListener("keydown", (evento) => cambiarDireccion(evento))
botonReiniciar.addEventListener("click", () => reiniciarJuego())
//Registra un evento al presionar una tecla para cambiar la dirección de la serpiente.
//Registra un clic en el botón para reiniciar el juego.


//Iniciar juego
const iniciarJuego = () => {
    clearTimeout(temporizador)
    estaJugando = true
    puntaje = 0
    textoPuntaje.textContent = puntaje
    velocidadX = tamañoBloque
    velocidadY = 0
    serpiente = [
        { x: tamañoBloque * 4, y: 0 },
        { x: tamañoBloque * 3, y: 0 },
        { x: tamañoBloque * 2, y: 0 },
        { x: tamañoBloque, y: 0 },
        { x: 0, y: 0 }
    ];
    generarComida()
    dibujarComida()
    cicloJuego()
};
//reinicia estado, puntaje, serpiente, genera comida y llama al ciclo principal


const cicloJuego = () => {
    if (estaJugando) {
        temporizador = setTimeout(() => {
            limpiarLienzo()
            dibujarComida()
            moverSerpiente()
            dibujarSerpiente()
            verificarColision()
            cicloJuego()
        }, 75)
    } else {
        mostrarGameOver()
    }
}
//el bucle con setTimeout se actualiza cada 75ms, limpiar, dibujar comida, mover serpiente, dibujar, verificar colisiones


const limpiarLienzo = () => {
    pincel.fillStyle = colorFondo
    pincel.fillRect(0, 0, anchoLienzo, altoLienzo)
}
//Borra el tablero para volver a dibujar


const generarComida = () => {
    const coordenadaAleatoria = (min, max) =>
        Math.floor((Math.random() * (max - min + 1)) / tamañoBloque) * tamañoBloque

    comidaX = coordenadaAleatoria(0, anchoLienzo - tamañoBloque)
    comidaY = coordenadaAleatoria(0, altoLienzo - tamañoBloque)
}
//Genera coordenadas aleatorias para la comida


function dibujarComida() {
    pincel.drawImage(imagenManzana, comidaX, comidaY, tamañoBloque, tamañoBloque)
}
//Dibuja la manzana en su posición usando la imagen cargada


const moverSerpiente = () => {
    const cabeza = {
        x: serpiente[0].x + velocidadX,
        y: serpiente[0].y + velocidadY
    }
    serpiente.unshift(cabeza)

    if (cabeza.x === comidaX && cabeza.y === comidaY) {
        puntaje++;
        textoPuntaje.textContent = puntaje
        sonidoComida.currentTime = 0
        sonidoComida.play()
        generarComida()
    } else {
        serpiente.pop()
    }
}
//Explica cómo se añade un nuevo bloque al frente, se elimina el último, y se dibujan todos los bloques.


const dibujarSerpiente = () => {
    pincel.fillStyle = colorSerpiente
    pincel.strokeStyle = bordeSerpiente

    serpiente.forEach(parte => {
        pincel.fillRect(parte.x, parte.y, tamañoBloque, tamañoBloque)
        pincel.strokeRect(parte.x, parte.y, tamañoBloque, tamañoBloque)
    })
}
//Dibuja cada bloque de la serpiente en el canvas.


const cambiarDireccion = (evento) => {
    const tecla = evento.keyCode

    const vaArriba = velocidadY === -tamañoBloque
    const vaAbajo = velocidadY === tamañoBloque
    const vaIzquierda = velocidadX === -tamañoBloque
    const vaDerecha = velocidadX === tamañoBloque

    if (tecla === 37 && !vaDerecha) {
        velocidadX = -tamañoBloque
        velocidadY = 0
    } else if (tecla === 38 && !vaAbajo) {
        velocidadX = 0
        velocidadY = -tamañoBloque
    } else if (tecla === 39 && !vaIzquierda) {
        velocidadX = tamañoBloque
        velocidadY = 0
    } else if (tecla === 40 && !vaArriba) {
        velocidadX = 0
        velocidadY = tamañoBloque
    }
}
//Cambia dirección dependiendo de la flecha presionada
//código de tecla #

const verificarColision = () => {
    const cabeza = serpiente[0]

    //Colisión con bordes
    if (cabeza.x < 0 || cabeza.x >= anchoLienzo || cabeza.y < 0 || cabeza.y >= altoLienzo) {
        estaJugando = false
        return
    }

    //Colisión consigo misma
    for (let i = 1; i < serpiente.length; i++) {
        if (serpiente[i].x === cabeza.x && serpiente[i].y === cabeza.y) {
            estaJugando = false
            return
        }
    }
}
//Verifica si la serpiente choca contra bordes o a sí misma.


const mostrarGameOver = () => {
    sonidoGameOver.currentTime = 0
    sonidoGameOver.play()
    pincel.font = "20px 'Press Start 2P'"
    pincel.fillStyle = "#222"
    pincel.textAlign = "center"
    pincel.shadowColor = "#00cc99"
    pincel.shadowBlur = 10
    pincel.fillText("¡FIN DEL JUEGO!", anchoLienzo / 2, altoLienzo / 2)
    pincel.shadowBlur = 0;
    pincel.shadowColor = "transparent";
}
//Muestra el texto de "FIN DEL JUEGO" y reproduce el sonido de gameover


const reiniciarJuego = () => {
    clearTimeout(temporizador)
    iniciarJuego()
}
//Llama de nuevo a iniciarJuego() y resetea todo.

//Iniciar todo
iniciarJuego()
