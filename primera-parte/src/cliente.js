"use strict";

const Cliente = function(nombre, apellido, numeroLinea, paquetes){
    this.nombre = nombre;
    this.apellido = apellido;
    this.numeroLinea = numeroLinea;
    this.paquetes = paquetes; //el paquete actual del cliente siempre estara en la ultima posicion
};

Cliente.prototype.sos = function(numCliente) {
    return ( numCliente === this.numeroLinea ); 
};

Cliente.prototype.obtenerNumero = function() {
    return this.numeroLinea;
};

// Método mejorado para usar el getter del objeto recibido
Cliente.prototype.sosIgual = function(cliente) {
    return this == cliente;
};

Cliente.prototype.recibirPaquete = function(paquete) {
    this.paquetes.push(paquete);
};

Cliente.prototype.conocerPaquetes = function() { //como devuelve ref puedo modificarlo
    return this.paquetes;
};

module.exports = Cliente;