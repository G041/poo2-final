"use strict";

const Cuenta = function(numCliente, saldo) {
    this.numCliente = numCliente;
    this.saldo = saldo;
};

Cuenta.prototype.es = function(cliente) {
    return cliente.sos(this.numCliente);
};

Cuenta.prototype.depositar = function(valor) {
    this.saldo += valor;
};

Cuenta.prototype.obtenerSaldo = function() {
    return this.saldo;
};

module.exports = Cuenta;