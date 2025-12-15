"use strict";
const Paquete = require("./paquete");

const PaqueteCliente = function(paquetePadre, numCliente, fechaCompra){
    Object.assign(this, paquetePadre);    //clonamos todas las propiedades del paquete recibido y agregamos la funcionalidad necesaria que seria la del numero del cliente, asi ahora tenemos una manera de relacion estrictamente un paquete otorgado con el cliente al que fue otorgado y como este modifica la existencia del mismo

    //caracteristicas que hace que difiera el paquete del paquete cliente, no es necesario para el paquete modelo que pueden adquirir los clientes conocer todo lo de abajo
    //sino que es un acaracteristica que modifica el cliente una vez que lo adquire
    this.numCliente = numCliente;
    this.renovarAutomaticamente = false; //cambiar para diferir paquete de paquete cliente
    this.consumos = []; 
    this.fechaVencimiento = this.calcularFechaVencimiento(fechaCompra, this.duracion);
};

PaqueteCliente.prototype = Object.create(Paquete.prototype);

PaqueteCliente.prototype.calcularFechaVencimiento = function(fechaCompra, duracionDias) {
    fechaCompra.setDate(fechaCompra.getDate() + duracionDias); 
    
    return fechaCompra;
};

PaqueteCliente.prototype.estaVigente = function(){
    const recursos = this.cantDatosMoviles + this.cantTiempoLlamadas;
    
    const fechaActual = new Date();

    const noExpirado = this.fechaVencimiento > fechaActual;

    return (recursos !== 0 && noExpirado);
};

PaqueteCliente.prototype.activarRenovarAutomaticamente = function(){
    this.renovarAutomaticamente = true;
};

PaqueteCliente.prototype.conocerDuenioPaquete = function(){
    return this.numCliente;
}

PaqueteCliente.prototype.es = function(paquete){ 
    return this.idPaquete === paquete.obtenerIdPaquete();
};

PaqueteCliente.prototype.obtenerIdPaquete = function(idPaquete){
    return this.idPaquete;
}


PaqueteCliente.prototype.realizarConsumo = function(consumo){
    consumo.realizarConsumo(this);

    this.consumos.push(consumo);
};

PaqueteCliente.prototype.sosMiApp = function(appConsumo){
    return this.appIlimitada === appConsumo
}


PaqueteCliente.prototype.constructor = PaqueteCliente;

//NOTA: SOLO SE PUEDEN REALIZAR CONSUMOS SOBRE UN PAQUETE CLIENTE YA QUE ES UNA CARACTERISTICA DEL PAQUETE QUE TIENE UN DUENIO

PaqueteCliente.prototype.consumirDatos = function(cantidadMb){
    this.cantDatosMoviles -= cantidadMb;
};


PaqueteCliente.prototype.sosRenovable = function(){
    return this.renovarAutomaticamente;
}

PaqueteCliente.prototype.consumirMinutos = function(cantidadMinutos){
    this.cantTiempoLlamadas -= cantidadMinutos;
};

PaqueteCliente.prototype.obtenerConsumos = function(){
    return this.consumos;
}

module.exports = PaqueteCliente;