"use strict";

const Cuenta = function(numCliente, saldo){
    this.numCliente = numCliente;
    this.saldo = saldo;

    this.es = (cliente) => {
        return cliente.sos(this.numCliente);
    };

    this.depositar = function(valor){
        this.saldo += valor;
    }

    this.obtenerSaldo = () => this.saldo;
};


module.exports = Cuenta;