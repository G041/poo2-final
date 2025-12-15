"use strict";
const Consumo = require("./consumo");

const ConsumoInternet = function (fechaInicio, fechaFin, cantidadMb, appConsumo) {
    Consumo.call(this, fechaInicio, fechaFin);

    this.cantidadMb = cantidadMb;
    this.appConsumo = appConsumo;
};

ConsumoInternet.prototype = Object.create(Consumo.prototype);

ConsumoInternet.prototype.realizarConsumo = function(paquete){
    if(!paquete.sosMiApp(this.appConsumo)){
        this.puedoConsumir(paquete);
        paquete.consumirDatos(this.cantidadMb)
    }
    //me hubiera gustado hacer un tryCatch aca pero no habia mucho que hacer
    
};

ConsumoInternet.prototype.puedoConsumir = function(paquete){
    if(paquete.obtenerDatos() < this.cantidadMb)
        throw new Error("No tenes suficientes MB para realizar ese consumo");
};

ConsumoInternet.prototype.hechoPor = function(){
    return this.appConsumo;
};

ConsumoInternet.prototype.constructor = ConsumoInternet;

module.exports = ConsumoInternet;