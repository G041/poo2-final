"use strict";

const PrestamoMinutos = function(cantidad){ //no necesito mas que esto, cuando el prestamo se ejecuta adquiere identidad, inicialmente solo tengo que conocer el proposito
    this.cantidad = cantidad;
}

PrestamoMinutos.prototype.tieneSuficiente = function(paquete){
    if(paquete.obtenerMinutos() < this.cantidad){
            throw new Error ("Estas intentando prestar una cantidad de minutos mayor a la que tenes");
        }
}

PrestamoMinutos.prototype.ejecutarEntrega = function(paqueteClienteEntrega){ 
    this.objeto = "ENTREGA"; //objeto del prestamo, dar/recibir
    this.establecerFechaVencimiento(paqueteClienteEntrega.conocerFechaVencimiento());

    paqueteClienteEntrega.consumirMinutos(this.cantidad); //-this.cantidad ya que consumir es una resta del atributo datos
    paqueteClienteEntrega.almacenarPrestamoFinal(this);
}
PrestamoMinutos.prototype.conocerObjeto = function(){ 
    return this.objeto;
}
PrestamoMinutos.prototype.ejecutarRecibida = function(paquete){ 
    this.objeto = "RECIBIDA"; //objeto del prestamo, dar/recibir

    paquete.establecerFechaVencimiento(this.fechaVencimiento);
    paquete.consumirMinutos(-this.cantidad); //-this.cantidad ya que consumir es una resta del atributo datos
    
    paquete.almacenarPrestamoFinal(this);
}

PrestamoMinutos.prototype.establecerFechaVencimiento = function(fechaVencimiento){ //no corresponde en la creacion ya que es un atributo que se otorga una vez se realiza el prestamo
    this.fechaVencimiento = fechaVencimiento;
}
module.exports = PrestamoMinutos;