// JavaScript

// Obtener referencia a la pantalla de la calculadora
const pantalla = document.getElementById('pantalla');

// Variable para almacenar el estado de la calculadora
let estadoCalculadora = {
    expresion: '',
    resultadoMostrado: false
};

// Función para insertar valores en la pantalla
function insertar(valor) {
    // Si se está mostrando un resultado, limpiar la pantalla antes de insertar nuevo valor
    if (estadoCalculadora.resultadoMostrado) {
        pantalla.value = '';
        estadoCalculadora.resultadoMostrado = false;
    }
    
    // Limitar la longitud de la entrada para evitar desbordamiento
    if (pantalla.value.length < 20) {
        pantalla.value += valor;
        estadoCalculadora.expresion = pantalla.value;
    }
}

// Función para borrar todo el contenido de la pantalla
function borrarTodo() {
    pantalla.value = '';
    estadoCalculadora.expresion = '';
    estadoCalculadora.resultadoMostrado = false;
}

// Función para borrar el último carácter
function borrarUno() {
    if (pantalla.value.length > 0) {
        pantalla.value = pantalla.value.slice(0, -1);
        estadoCalculadora.expresion = pantalla.value;
    }
}

// Función para calcular el resultado de la expresión
function calcular() {
    try {
        // Verificar que haya una expresión para calcular
        if (pantalla.value === '') {
            return;
        }
        
        // Evaluar la expresión matemática
        const resultado = eval(pantalla.value);
        
        // Verificar si el resultado es válido
        if (!isFinite(resultado)) {
            throw new Error('Resultado no válido');
        }
        
        // Mostrar el resultado con un máximo de 10 decimales para evitar números muy largos
        pantalla.value = parseFloat(resultado.toFixed(10)).toString();
        estadoCalculadora.resultadoMostrado = true;
        
    } catch (error) {
        // Manejar errores de sintaxis o cálculo
        pantalla.value = 'Error';
        estadoCalculadora.resultadoMostrado = true;
        
        // Limpiar el error después de 2 segundos
        setTimeout(() => {
            if (pantalla.value === 'Error') {
                pantalla.value = '';
            }
        }, 2000);
    }
}

// Función para manejar el evento de teclado
document.addEventListener('keydown', function(evento) {
    const tecla = evento.key;
    
    // Permitir números del 0 al 9
    if (tecla >= '0' && tecla <= '9') {
        insertar(tecla);
    }
    // Permitir operadores básicos
    else if (tecla === '+' || tecla === '-' || tecla === '*' || tecla === '/') {
        insertar(tecla);
    }
    // Permitir punto decimal
    else if (tecla === '.') {
        insertar('.');
    }
    // Manejar Enter para calcular
    else if (tecla === 'Enter') {
        evento.preventDefault();
        calcular();
    }
    // Manejar Backspace para borrar un carácter
    else if (tecla === 'Backspace') {
        evento.preventDefault();
        borrarUno();
    }
    // Manejar Escape para borrar todo
    else if (tecla === 'Escape') {
        evento.preventDefault();
        borrarTodo();
    }
});

// Función para agregar efectos visuales cuando se presionan botones
document.addEventListener('DOMContentLoaded', function() {
    const botones = document.querySelectorAll('button');
    
    botones.forEach(boton => {
        boton.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(1px)';
        });
        
        boton.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(0)';
        });
        
        boton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Función para validar la entrada y prevenir errores comunes
function validarEntrada() {
    const valor = pantalla.value;
    
    // Prevenir múltiples operadores seguidos
    const operadores = /[+\-*/]{2,}/;
    if (operadores.test(valor)) {
        pantalla.value = valor.replace(/[+\-*/]{2,}/, valor.slice(-1));
    }
    
    // Prevenir múltiples puntos decimales en un mismo número
    const partes = valor.split(/[+\-*/]/);
    const ultimoNumero = partes[partes.length - 1];
    if ((ultimoNumero.match(/\./g) || []).length > 1) {
        pantalla.value = valor.slice(0, -1);
    }
}

// Agregar validación en tiempo real
pantalla.addEventListener('input', validarEntrada);