"use strict";
const Paquete = require("./paquete");

const PaqueteVacio = function(){ //null obj pattern
    Paquete.call(this);

    this.renovarAutomaticamente = false;

};

PaqueteVacio.prototype = Object.create(Paquete.prototype);

//RENOVACION
PaqueteVacio.prototype.activarRenovarAutomaticamente = function(){
    throw new Error("Actualmente no tenes un paquete valido, no hay renovacion que puedas activar")
};

PaqueteVacio.prototype.sosRenovable = function(){
    return this.renovarAutomaticamente;
}
PaqueteVacio.prototype.estaVigente = function(){
    return false
}

PaqueteVacio.prototype.es = function(paquete){
    return false;
}

PaqueteVacio.prototype.constructor = PaqueteVacio;


module.exports = PaqueteVacio;