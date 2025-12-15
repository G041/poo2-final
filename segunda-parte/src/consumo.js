"use strict";

const Consumo = function(fechaInicio, fechaFin){
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;

};

Consumo.prototype.obtenerDuracionConsumo = function(){
    return (this.fechaFin - this.fechaInicio) / (60 * 1000);//la diferencia sera en milisegundos por lo tanto si dividimos por 60 * 1000 estamos dividiendo por minutos
}

Consumo.prototype.obtenerFechaInicio = function(){
    return this.fechaInicio;
}

Consumo.prototype.obtenerFechaFin = function(){
    return this.fechaFin;
}

module.exports = Consumo;