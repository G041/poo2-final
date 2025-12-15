const Cliente = require("../src/cliente");
const Cuenta = require("../src/cuenta");

const Paquete = require("../src/paquete");
const PaqueteCliente = require("../src/paqueteCliente");
const PaqueteVacio = require("../src/paqueteVacio");

const Sistema = require("../src/sistema");

const ConsumoInternet = require("../src/consumoInternet");
const ConsumoMinutos = require("../src/consumoMinutos");

const FiltroFecha = require("../src/filtroFecha");

const crearCliente = function (nombre, apellido, numeroLinea, paquetes = [new PaqueteVacio()]) {
    return new Cliente(nombre, apellido, numeroLinea, paquetes);
}

const crearPaquete = function (cantDatosMoviles, cantTiempoLlamadas, duracion, costo, idPaquete = 0, fechaCompra = new Date()){
    return new Paquete(cantDatosMoviles, cantTiempoLlamadas, duracion, costo, idPaquete, fechaCompra);
}

const crearPaqueteCliente = function(paquete, numCliente){
    return new PaqueteCliente(paquete, numCliente);
}
const crearCuenta = function (numCliente, saldo = 0){
    return new Cuenta(numCliente, saldo);
}

const crearSistema = function(paquetesDisponibles, clientes, cuentas){
    return new Sistema(paquetesDisponibles, clientes, cuentas);
}

const crearConsumo = function(tipo, fechaInicio, fechaFin, cantidadConsumida){
    
    switch(tipo.toLowerCase()){
        case "internet":
            return new ConsumoInternet(fechaInicio, fechaFin, cantidadConsumida);
        case "minutos":
            return new ConsumoMinutos(fechaInicio, fechaFin, cantidadConsumida);
        default:
            throw new Error("Tipo de consumo desconocido");
    }
}

const crearFiltroFecha = function(fechaInicio, fechaFin){
    return new FiltroFecha(fechaInicio, fechaFin);
}


module.exports = {
    crearCliente: crearCliente,
    crearPaquete: crearPaquete,
    crearPaqueteCliente: crearPaqueteCliente,
    crearCuenta: crearCuenta,
    crearSistema: crearSistema,
    crearConsumo: crearConsumo,
    crearFiltroFecha
}