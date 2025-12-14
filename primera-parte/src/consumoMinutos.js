"use strict";
const Consumo = require("./consumo");

const ConsumoMinutos = function (fechaInicio, fechaFin, cantidadMinutos) {
    Consumo.call(this, fechaInicio, fechaFin);

    this.cantidadMinutos = cantidadMinutos;
};

ConsumoMinutos.prototype = Object.create(Consumo.prototype);

ConsumoMinutos.prototype.realizarConsumo = function(paquete){
    this.puedoConsumir(paquete);
    paquete.consumirMinutos(this.cantidadMinutos); 
};

ConsumoMinutos.prototype.puedoConsumir = function(paquete){
    if(paquete.obtenerMinutos() < this.cantidadMinutos) 
        throw new Error("No tenes suficientes minutos para realizar ese consumo");
};

ConsumoMinutos.prototype.constructor = ConsumoMinutos;

module.exports = ConsumoMinutos;