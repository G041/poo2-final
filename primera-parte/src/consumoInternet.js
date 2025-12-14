"use strict";
const Consumo = require("./consumo");

const ConsumoInternet = function (fechaInicio, fechaFin, cantidadMb) {
    Consumo.call(this, fechaInicio, fechaFin);

    this.cantidadMb = cantidadMb;
};

ConsumoInternet.prototype = Object.create(Consumo.prototype);

ConsumoInternet.prototype.realizarConsumo = function(paquete){
    this.puedoConsumir(paquete);
    paquete.consumirDatos(this.cantidadMb);
};

ConsumoInternet.prototype.puedoConsumir = function(paquete){
    if(paquete.obtenerDatos() < this.cantidadMb)
        throw new Error("No tenes suficientes MB para realizar ese consumo");
};

ConsumoInternet.prototype.constructor = ConsumoInternet;

module.exports = ConsumoInternet;