"use strict";

const Paquete = function(cantDatosMoviles, cantTiempoLlamadas, duracion, costo, idPaquete){
    this.cantDatosMoviles = cantDatosMoviles;
    this.cantTiempoLlamadas = cantTiempoLlamadas;
    this.duracion = duracion;
    this.costo = costo;
    this.idPaquete = idPaquete;

    if (costo < 0){
        throw new Error("No se puede crear un paquete con costo negativo");
    }
};
    
Paquete.prototype.es = function(paquete){ 
    return this.idPaquete === paquete.obtenerIdPaquete();
};

Paquete.prototype.obtenerIdPaquete = function(){
    return this.idPaquete;
}

Paquete.prototype.obtenerCosto = function(){ 
    return this.costo;
};


Paquete.prototype.obtenerDatos = function(){ 
    return this.cantDatosMoviles; 
};
Paquete.prototype.obtenerMinutos = function(){ 
    return this.cantTiempoLlamadas;
};  

module.exports = Paquete;
