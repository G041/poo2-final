"use strict";

const PrestamoDatos = function(cantidad){ //no necesito mas que esto, cuando el prestamo se ejecuta adquiere identidad, inicialmente solo tengo que conocer el proposito
    this.cantidad = cantidad;
}

PrestamoDatos.prototype.tieneSuficiente = function(paquete){
    if(paquete.obtenerDatos() < this.cantidad){
            throw new Error ("Estas intentando prestar una cantidad de datos mayor a la que tenes");
        }
}

PrestamoDatos.prototype.ejecutarEntrega = function(paqueteClienteEntrega){ 
    this.objeto = "ENTREGA"; //objeto del prestamo, dar/recibir
    this.establecerFechaVencimiento(paqueteClienteEntrega.conocerFechaVencimiento());

    paqueteClienteEntrega.consumirDatos(this.cantidad); //-this.cantidad ya que consumir es una resta del atributo datos
    paqueteClienteEntrega.almacenarPrestamoFinal(this);
}
PrestamoDatos.prototype.conocerObjeto = function(){ 
    return this.objeto;
}
PrestamoDatos.prototype.ejecutarRecibida = function(paquete){ 
    this.objeto = "RECIBIDA"; //objeto del prestamo, dar/recibir

    paquete.establecerFechaVencimiento(this.fechaVencimiento);
    paquete.consumirDatos(-this.cantidad); //-this.cantidad ya que consumir es una resta del atributo datos
    
    paquete.almacenarPrestamoFinal(this);
}

PrestamoDatos.prototype.establecerFechaVencimiento = function(fechaVencimiento){ //no corresponde en la creacion ya que es un atributo que se otorga una vez se realiza el prestamo
    this.fechaVencimiento = fechaVencimiento;
}
module.exports = PrestamoDatos;