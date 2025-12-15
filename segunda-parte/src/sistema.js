"use strict";
const PaqueteCliente = require("./paqueteCliente");
const FiltroNormal = require("./filtroNormal");
const PaqueteVacio = require("./paqueteVacio");


const Sistema = function(paquetesDisponibles, clientes, cuentas){
    this.paquetes = paquetesDisponibles;
    this.clientes = clientes;
    this.cuentas = cuentas;

//METODOS DE LA SEGUNDA ITERACION
    this.realizarPrestamo = function(receptor, prestamo){
        this.validarSesionIniciada();

        this.existeElCliente(receptor);
        this.existeCuentaCliente(receptor);

        const paqueteReceptor = this.puedeRecibir(receptor);

        this.tengoParaPrestar(prestamo);
        this.otorgarPrestamo(paqueteReceptor, prestamo);
    }


    this.otorgarPrestamo = function(paqueteReceptor, prestamo){
        const paqueteClienteActual = this.paqueteClienteActual;

        paqueteClienteActual.entregarPrestamo(prestamo);


        const clonPrestamo = Object.create(Object.getPrototypeOf(prestamo));
        Object.assign(clonPrestamo, prestamo); //al clonarlo la fecha de vencimiento ya fue establecida
        //intente clonar el objeto pero no resulto ya que object.assign() solo copia los metodos de instancia y no toda el prototipo
        //por lo cual busque y encontre esta manera, a un paquete le pasamos el prestamo clonado por completo y al otro el original de manera que no apuntan al mismo lugar en memoria
    
        paqueteReceptor.recibirPrestamo(clonPrestamo);
    }

    this.tengoParaPrestar = function(prestamo){
        const paqueteCliente = this.paqueteClienteActual;
        prestamo.tieneSuficiente(paqueteCliente);
    }

    this.puedeRecibir = function(receptor){
        const ultimoPaqueteReceptor = (receptor.conocerPaquetes()).at(-1); //los paquetes del receptor en -1 son el ultimo paq
        
        if(ultimoPaqueteReceptor.estaVigente()){
            throw new Error("El recepetor ya tiene un paquete en curso, no necesita ningun prestamo");
        }
        return ultimoPaqueteReceptor;
    }
//METODOS DE LA SEGUNDA ITERACION

    this.depositar = function(valor){
        this.cuentaClienteActual.depositar(valor);
    }

    this.consultarConsumos = function(filtroAplicable = FiltroNormal){ //si no obtiene un filtro por parametro, accede al metodo estatico de la clase FiltroNormal.aplicar()
        this.validarSesionIniciada();
        const listaConsumos = this.paquetesClienteActual.map(paquete => paquete.obtenerConsumos()); //esta es una lista de listas = [[consumo1, consumo2], [consumo1, consumo2]]
        const consumos = listaConsumos.flat() //aplanamos la lista de listas un nivel de profundidad 

        filtroAplicable.aplicar(consumos);

        return consumos;
    }
    
    this.activarRenovarAutomaticamente = function(){
        this.validarSesionIniciada();
        this.paqueteClienteActual.activarRenovarAutomaticamente();
    }

    this.realizarConsumo = function(consumo){
        this.validarSesionIniciada();

        try{
            this.validarQueNoHayaPaqueteEnCurso(); //si pasa esta linea o tiene un paquete terminado o vacio
            this.validarQueNoHayaRenovacion();
        }catch(error){
            if(error.message === "El cliente ya tiene un paquete valido en curso"){
                this.paqueteVigente.realizarConsumo(consumo);
                return;
            }else if(error.message === "El cliente tiene un paquete renovable"){
                this.comprarPaquete(this.paqueteClienteActual);
                this.realizarConsumo(consumo);
                return;
            }
            throw error;
        }
        throw new Error("El cliente no tiene ningun paquete valido en curso ni renovable, no puede realizar consumos");

    }

    this.validarQueNoHayaRenovacion = function(){
        if(this.paqueteVigente.sosRenovable())
            throw new Error("El cliente tiene un paquete renovable");
    }

    this.consultarSaldo = function(){
        this.validarSesionIniciada();
        return this.cuentaClienteActual.obtenerSaldo();
    }

    this.iniciarSesion = function(cliente, fechaActual = new Date()){
        this.existeElCliente(cliente);
        this.existeCuentaCliente(cliente);

        this.paqueteVigente = new PaqueteVacio();

        //cargamos todas las variabels que nos van a servir
        this.fechaActual = fechaActual;
        this.clienteActual = cliente;
        this.paquetesClienteActual = cliente.conocerPaquetes();
        this.cuentaClienteActual = this.cuentas.find(cuenta => cuenta.es(this.clienteActual));
        this.paqueteClienteActual = this.paquetesClienteActual.at(-1);
    }

    this.existeElCliente = function(clientePorVerificar){
        const clienteActual = this.clientes.find(cliente => cliente.sosIgual(clientePorVerificar));
        if(!clienteActual){
            throw new Error("El cliente no existe en el sistema");
        }
        return clienteActual;
    }

    this.existeCuentaCliente = function(clientePorVerificar){
        const cuentaCliente = this.cuentas.find(cuenta => cuenta.es(clientePorVerificar));
        if(!cuentaCliente){
            throw new Error("El cliente no tiene cuenta en el sistema");
        }
        return cuentaCliente;
    }

    this.cerrarSesion = function(){
        this.fechaActual = null;
        this.clienteActual = null;          //Cliente
        this.cuentaClienteActual = null;    //Cuenta
        this.paquetesClienteActual = null;  //[Paquete]
        this.paqueteClienteActual = null;   //Paquete

        this.paqueteVigente = new PaqueteVacio();
    }

    this.comprarPaquete = function(paquetePedido){
        this.validarSesionIniciada();

        const paqueteEncontrado = this.paquetes.find(paquete => paquete.es(paquetePedido));
        
        this.existeElPaquete(paqueteEncontrado);
        this.validarQueNoHayaPaqueteEnCurso();

        this.saldoSuficiente(paqueteEncontrado.obtenerCosto());
        this.otorgarPaquete(paqueteEncontrado);
    }

    this.validarSesionIniciada = function(){
        if(!this.clienteActual)
            throw new Error("Primero debes de iniciar sesion")
    }

    this.existeElPaquete = function(paqueteEncontrado){
        if(!paqueteEncontrado)
            throw new Error("El paquete no existe")
    }

    this.validarQueNoHayaPaqueteEnCurso = function(){
        const ultimoPaquete = this.paquetesClienteActual.at(-1); //por definicion el ultimo paquete del arreglo siempre sera el mas propenso a estar vigente
        
        if(ultimoPaquete.es(ultimoPaquete) && ultimoPaquete.estaVigente()){//evaluamos que sea distinto de undefined para clientes que todavia no tienen paquetes (arreglo de paquetes vacio)
            this.paqueteVigente = ultimoPaquete;
            throw new Error("El cliente ya tiene un paquete valido en curso");
        }//o no tiene un paquete vigente o tiene un paq vacio
    }

    this.saldoSuficiente = function(valor){
        if(this.cuentaClienteActual.obtenerSaldo() < valor)
            throw new Error("El cliente no tiene saldo suficiente para ese paquete")
        this.cuentaClienteActual.depositar(-valor);
    }

    this.otorgarPaquete = function(paqueteEncontrado){
        const numeroCliente = this.clienteActual.obtenerNumero();
        this.paqueteClienteActual = new PaqueteCliente(paqueteEncontrado, numeroCliente, this.fechaActual);
        this.clienteActual.recibirPaquete(this.paqueteClienteActual); //cuando el cliente pudo comprar un paquete se realiza la asignacion paqueteCliente
    }
};

module.exports = Sistema;