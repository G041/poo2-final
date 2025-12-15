"use strict";

const PrestamoMinutos = function(cantidad){ //accion sera recibido/otorgado idealmente
    this.cantidad = cantidad;
}

PrestamoMinutos.prototype.tieneSuficiente = function(paquete){
    if(paquete.obtenerMinutos() < this.cantidad){
            throw new Error ("Estas intentando prestar una cantidad de minutos mayor a la que tenes");
        }
}
PrestamoMinutos.prototype.ejecutarEntrega = function(paquete){ 
    paquete.consumirMinutos(this.cantidad); 
    this.establecerFechaVencimiento = paquete.conocerFechaVencimiento();
    this.objeto = "ENTREGA"; //objeto del prestamo, dar/recibir
}

PrestamoMinutos.prototype.ejecutarRecibida = function(paquete){ 
    paquete.consumirMinutos(-this.cantidad); //-this.cantidad ya que consumir es una resta del atributo datos 
    this.establecerFechaVencimiento = paquete.conocerFechaVencimiento();
    this.objeto = "RECIBIDA"; //objeto del prestamo, dar/recibir
}
PrestamoMinutos.prototype.establecerFechaVencimiento = function(fechaVencimiento){ //no corresponde en la creacion ya que es un atributo que se otorga una vez se realiza el prestamo
    this.fechaVencimiento = fechaVencimiento;
}
module.exports = PrestamoMinutos;