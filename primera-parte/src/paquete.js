"use strict";

const Paquete = function(cantDatosMoviles, cantTiempoLlamadas, duracion, costo, idPaquete, fechaCompra){
    this.cantDatosMoviles = cantDatosMoviles;
    this.cantTiempoLlamadas = cantTiempoLlamadas;
    this.duracion = duracion;
    this.costo = costo;
    this.idPaquete = idPaquete;
    this.fechaVencimiento = this.calcularFechaVencimiento(fechaCompra, this.duracion);

    if (costo < 0){
        throw new Error("No se puede crear un paquete con costo negativo");
    }

    this.renovarAutomaticamente = false; //cambiar para diferir paquete de paqueteCliente

    this.consumos = []; //ESTAS DOS FUNCIONES HABRIA QUE INTENTAR SACARLAS DE ACA O ALGO PARA QUE EXISTA DIFERENCIA REAL ENTRE UN PAQUETE Y UN PAQ CLIENTE

};
    
Paquete.prototype.es = function(paquete){ 
    return this.idPaquete === paquete.obtenerIdPaquete();
};

Paquete.prototype.calcularFechaVencimiento = function(fechaCompra, duracionDias) {
    const nuevaFecha = new Date(fechaCompra); 
    nuevaFecha.setDate(nuevaFecha.getDate() + duracionDias); 
    
    return nuevaFecha;
};

Paquete.prototype.obtenerIdPaquete = function(){
    return this.idPaquete;
}

Paquete.prototype.obtenerCosto = function(){ 
    return this.costo;
};

/*
//ESTAS DOS FUNCIONES HABRIA QUE INTENTAR SACARLAS DE ACA O ALGO PARA QUE EXISTA DIFERENCIA REAL ENTRE UN PAQUETE Y UN PAQ CLIENTE
Paquete.prototype.realizarConsumo = function(consumo){
    consumo.realizarConsumo(this);

    this.consumos.push(consumo);
};
Paquete.prototype.consumirDatos = function(cantidadMb){
    this.cantDatosMoviles -= cantidadMb;
};

Paquete.prototype.activarRenovarAutomaticamente = function(){
    this.renovarAutomaticamente = true;
}
Paquete.prototype.sosRenovable = function(){
    return this.renovarAutomaticamente;
}
//ESTAS DOS FUNCIONES HABRIA QUE INTENTAR SACARLAS DE ACA O ALGO PARA QUE EXISTA DIFERENCIA REAL ENTRE UN PAQUETE Y UN PAQ CLIENTE
*/

Paquete.prototype.estaVigente = function(){ ///seria logico en breves cambiar esto ya que un paquete padre siempre esta vigente, el que puede variar en cuanto a vigencia es el paqueteCLiente
    const recursos = this.cantDatosMoviles + this.cantTiempoLlamadas;
    
    const fechaActual = new Date();

    const noExpirado = this.fechaVencimiento > fechaActual;

    return (recursos !== 0 && noExpirado);
};

Paquete.prototype.obtenerDatos = function(){ 
    return this.cantDatosMoviles; 
};
Paquete.prototype.obtenerMinutos = function(){ 
    return this.cantTiempoLlamadas;
};  

module.exports = Paquete;
