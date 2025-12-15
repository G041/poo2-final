"use strict";
const {crearCliente, crearPaquete, crearCuenta, crearSistema, crearConsumo, crearPaqueteCliente, crearFiltroFecha} = require("./factories");
const ConsumoInternet = require("../src/consumoInternet");
const ConsumoMinutos = require("../src/consumoMinutos");
const PaqueteCliente = require("../src/paqueteCliente");
const PaqueteVacio = require("../src/paqueteVacio");

describe("Verificamos la creacion del paquete", () =>{
    test("Creamos un paquete con datos genericos",()=>{
        const paquete = crearPaquete(5,600,30,15000);
        
        let claves = [];

        Object.keys(paquete).map(item => claves.push(paquete[item]));

        expect(claves.slice(0,4)).toEqual([5, 600, 30, 15000]);
    });

    test("Creamos un paquete cliente con datos genericos",()=>{
        const paquete = crearPaquete(5,600,30,15000);
        
        const paqueteCliente = crearPaqueteCliente(paquete, 1111111111)
        
        let claves = [];

        Object.keys(paqueteCliente).map(item => claves.push(paqueteCliente[item]));

        expect(claves.slice(0,4)).toEqual([5, 600, 30, 15000]);
        expect(paqueteCliente.conocerDuenioPaquete()).toBe(1111111111);
    });

    test("Al intentar la creacion de un paquete con costo negativo, esta falla", () =>{
        expect(() => crearPaquete(5,600,30,-5)).toThrow(new Error("No se puede crear un paquete con costo negativo"));
    })
});

describe("Verificamos la creacion del Cliente", ()=> {
    test("Creamos un cliente con informacion generica", ()=>{
        const paqueteVacio = new PaqueteVacio(); //creamos un paquete vacio real para evaluar mas adelante la referencia por memoria en los test, si hubieramos dejado que se instancie por def
        //como new PaqueteVacio en la factory perdiamos la referencia para evaluarlo mas adelante en el expect
        const pepe = crearCliente("Juan Alberto", "Pepe", 1111111111, [paqueteVacio]); //paq por def = [new PaqueteVacio()]

        let claves = [];

        Object.keys(pepe).map(item => claves.push(pepe[item]));

        expect(claves.slice(0,4)).toEqual(["Juan Alberto", "Pepe", 1111111111, [paqueteVacio]]); //no agregamos ningun paq, [new PaqueteVacio()] por def

        //ESTE ARRANCO A TIRAR ERROR CUANDO AGREGUE LA FECHA DE VENCIMIENTO EN PAQUETE
        expect(pepe.conocerPaquetes()).toEqual([paqueteVacio]);
    });

    test("Creamos un cliente con un paquete ya asignado", ()=>{
        const paqueteCliente = crearPaqueteCliente(crearPaquete(5,600,30,15000), 1111111111);
        const pepe = crearCliente("Juan Alberto", "Pepe", 1111111111,[paqueteCliente]);

        let claves = [];
        Object.keys(pepe).map(item => claves.push(pepe[item])); //["Juan Alberto", "Pepe", 1111111111, [paquete]]
        expect(paqueteCliente).toBeInstanceOf(PaqueteCliente); //funciona correctamente la factory
        
        expect(claves.slice(0,4)).toEqual(["Juan Alberto", "Pepe", 1111111111,[paqueteCliente]]);
        expect(claves[3][0]).toEqual(paqueteCliente); //por ahora no pude hacer andar el toEqualObject

    })
});

describe("Testeamos la funcionalidad del sistema y del cliente con una cuenta", ()=>{
    test("Creamos un cliente con una cuenta", ()=>{
        const pepe = crearCliente("Juan Alberto", "Pepe", 1111111111); //paquete por def = [new PaqueteVacio()]
        const cuenta = crearCuenta(1111111111); //saldo def = 0

        const sistema = crearSistema([], [pepe], [cuenta]);

        sistema.iniciarSesion(pepe);

        expect(sistema.consultarSaldo()).toEqual(0);
    })

    test("Creamos un cliente con una cuenta y realizamos un deposito", ()=>{
        const pepe = crearCliente("Juan Alberto", "Pepe", 1111111111); //paquete por def = [new PaqueteVacio()]
        const cuenta = crearCuenta(1111111111); //saldo def = 0

        const sistema = crearSistema([], [pepe], [cuenta]);

        sistema.iniciarSesion(pepe);
        sistema.depositar(10);

        expect(sistema.consultarSaldo()).toEqual(10);
    })

    test("Al crear un cliente, depositar y cerrar la sesion, no podemos conocer los datos", ()=>{
        const pepe = crearCliente("Juan Alberto", "Pepe", 1111111111); //paquete por def = [new PaqueteVacio()]
        const cuenta = crearCuenta(1111111111); //saldo def = 0

        const sistema = crearSistema([], [pepe], [cuenta]);

        sistema.iniciarSesion(pepe);
        sistema.depositar(10);
        sistema.cerrarSesion();

        expect(() => sistema.consultarSaldo()).toThrow(new Error("Primero debes de iniciar sesion"));
    })
    test("Despues de ingresar y cambiar los datos de un cliente como el saldo de la cuenta y cerrar sesion. Estos perduran", ()=>{
        const pepe = crearCliente("Juan Alberto", "Pepe", 1111111111); //paquete por def = [new PaqueteVacio()]
        const cuenta = crearCuenta(1111111111); //saldo def = 0
        const sistema = crearSistema([], [pepe], [cuenta]);

        sistema.iniciarSesion(pepe);
        sistema.depositar(10);
        sistema.cerrarSesion();

        sistema.iniciarSesion(pepe); 
        expect(sistema.consultarSaldo()).toEqual(10);
    })

    test("Intentamos iniciar sesion al sistema con un cliente que no existe y falla", ()=>{
        const martin = crearCliente("Juan Alberto", "Pepe", 1111111111); //paquete def = [new PaqueteVacio()]

        const sistema = crearSistema([], [], []);

        expect(() => sistema.iniciarSesion(martin)).toThrow(new Error("El cliente no existe en el sistema"));
    });

    test("Intentamos iniciar sesion al sistema con un cliente sin cuenta asociada y falla", ()=>{ //una cuenta contiene el numero del cliente como identificador
        const pepe = crearCliente("Juan Alberto", "Pepe", 1111111111); //paquete def = [new PaqueteVacio()]

        const sistema = crearSistema([], [pepe], []);

        expect(() => sistema.iniciarSesion(pepe)).toThrow(new Error("El cliente no tiene cuenta en el sistema"));

    });

    test("Intentamos comprar un paquete sin iniciar sesion y falla, teniendo todos los requerimientos necesarios para comprar el paquete", ()=>{
        const pepe = crearCliente("Juan Alberto", "Pepe", 1111111111);
        const cuenta = crearCuenta(1111111111, 400); //saldo 400
        const paquete = crearPaquete(2.5, 1000, 30, 400);

        const sistema = crearSistema([paquete], [pepe], [cuenta]);

        expect(() => sistema.comprarPaquete(paquete)).toThrow(new Error("Primero debes de iniciar sesion"));

    });  

});

describe("Verificamos la compra de paquetes", ()=>{
    test("Al crear un cliente sin saldo, si este intenta comprar un paquete falla, su saldo pardura", ()=>{
        const pepe = crearCliente("Juan Alberto", "Pepe", 1111111111); //paquete def = []
        const cuenta = crearCuenta(1111111111); //saldo def = 0
        const paquete = crearPaquete(2.5, 1000, 30, 400); //nota, cuando trabajamos con 2 o mas paquetes le otorgamos a cada uno un identificador, mas adelante lo haremos que se instancie de manera automatica


        const sistema = crearSistema([paquete], [pepe], [cuenta]);

        sistema.iniciarSesion(pepe);

        expect(() => sistema.comprarPaquete(paquete)).toThrow(new Error("El cliente no tiene saldo suficiente para ese paquete"));
        expect(sistema.consultarSaldo()).toBe(0);
    });

    test("Al crear un cliente con saldo suficiente y este intenta comprar un paquete, tiene exito y su saldo se modifica", ()=>{ //aca esta fallando por PRIMERA VEZ
        const paqueteVacio = new PaqueteVacio(); //creamos un paquete vacio real para evaluar mas adelante la referencia por memoria en los test, si hubieramos dejado que se instancie por def
        //como new PaqueteVacio en la factory perdiamos la referencia para evaluarlo mas adelante en el expect
        const fechaCompraPaquete = new Date();
    
        const pepe = crearCliente("Juan Alberto", "Pepe", 1111111111, [paqueteVacio]); //paquetes def = []
        const cuenta = crearCuenta(1111111111, 400); //saldo def = 0
        const paquete = crearPaquete(2.5, 1000, 30, 400);
        
        const paquetePepe = crearPaqueteCliente(paquete, 1111111111) //un paquete que esta relacionado estrictamente con el cliente pepe, solo con proposito de testeo

        const sistema = crearSistema([paquete], [pepe], [cuenta]);

        sistema.iniciarSesion(pepe);

        sistema.comprarPaquete(paquete);
        expect(sistema.consultarSaldo()).toBe(0);
        expect(pepe.conocerPaquetes()).toEqual([paqueteVacio, paquetePepe]); //durante la compra se realizo correctamente la relacion entre el paquete y cliente 
        //vemos como el paquete fluctua y pasa a ser un tipo paqueteCliente (paquetePepe en este test) al ser adquirido por el cliente
    });

    test("Creamos un cliente con saldo 0, cargamos y compra un paquete exitosamente ", ()=>{
        const paqueteVacio = new PaqueteVacio(); //creamos un paquete vacio real para evaluar mas adelante la referencia por memoria en los test, si hubieramos dejado que se instancie por def
        //como new PaqueteVacio en la factory perdiamos la referencia para evaluarlo mas adelante en el expect

        const pepe = crearCliente("Juan Alberto", "Pepe", 1111111111, [paqueteVacio]); //
        const cuenta = crearCuenta(1111111111, 0) //saldo = 0
        const paquete = crearPaquete(2.5, 1000, 30, 400); //gb-minutos-dias-costo

        const paquetePepe = crearPaqueteCliente(paquete, 1111111111) //un paquete que esta relacionado estrictamente con el cliente pepe, solo con proposito de testeo

        const sistema = crearSistema([paquete], [pepe], [cuenta]);

        sistema.iniciarSesion(pepe);

        expect(() => sistema.comprarPaquete(paquete)).toThrow(new Error("El cliente no tiene saldo suficiente para ese paquete"));

        sistema.depositar(400);
        sistema.comprarPaquete(paquete);

        expect(pepe.conocerPaquetes()).toEqual([paqueteVacio, paquetePepe]); //durante la compra se realizo correctamente la relacion entre el paquete y cliente 

    });
    test("Creamos un cliente con saldo suficiente y un paquete vigente, al intentar comprar un segundo paquete, este falla ", ()=>{
        const paqueteCliente = crearPaqueteCliente(crearPaquete(2.5, 1000, 30, 400, 1), 1111111111);

        const paqueteA = crearPaquete(2.5, 1000, 30, 400, 1); //gb-minutos-dias-costo-identificador (no es necesario para este test)

        const pepe = crearCliente("Juan Alberto", "Pepe", 1111111111, [paqueteCliente]); 
        const cuenta = crearCuenta(1111111111, 400); 

        const sistema = crearSistema([paqueteA], [pepe], [cuenta]);

        sistema.iniciarSesion(pepe);

        expect(() => sistema.comprarPaquete(paqueteA)).toThrow(new Error("El cliente ya tiene un paquete valido en curso"));
        expect(pepe.conocerPaquetes()).toEqual([paqueteCliente]); //vemos aca como el paquete que le otorgamos de manera inicial sigue siendo el mismo y no sufrio ningun cambio

    });

    test("Creamos un cliente con saldo suficiente y un paquete terminado, al intentar comprar un segundo paquete tiene exito y ambos quedan registrados en su historial ", ()=>{
        const paqueteClienteA = crearPaqueteCliente(crearPaquete(0, 0, 30, 400, 1), 1111111111); //paquete terminado

        const pepe = crearCliente("Juan Alberto", "Pepe", 1111111111, [paqueteClienteA]); 
        const cuenta = crearCuenta(1111111111, 400); //numCliente, saldo

        const paqueteB = crearPaquete(1,100,7,150, 2); //gb-minutos-dias-costo-identificador
        const paqueteClienteB = crearPaqueteCliente(paqueteB, 1111111111) //un paquete que esta relacionado estrictamente con el cliente pepe

        const sistema = crearSistema([paqueteB], [pepe], [cuenta]); //solo esta disp para la compra paqueteB, paqueteClienteA ya esta cargado en el perfil de pepe

        sistema.iniciarSesion(pepe);
        sistema.comprarPaquete(paqueteB);

        expect(pepe.conocerPaquetes()).toEqual([paqueteClienteA, paqueteClienteB]); //durante la compra se realizo correctamente la relacion entre el paquete y cliente
        //al comprar paqueteB pasa a ser paqueteClienteB
    });

    test("Creamos un cliente con saldo suficiente y un paquete terminado, intenta comprar un segundo paquete pero no tiene saldo ", ()=>{
        const paqueteClienteA = crearPaqueteCliente(crearPaquete(0, 0, 30, 400, 1), 1111111111); //paquete terminado
        const paqueteB = crearPaquete(1,100,7,150, 2);

        const pepe = crearCliente("Juan Alberto", "Pepe", 1111111111, [paqueteClienteA]); 
        const cuenta = crearCuenta(1111111111, 0); 

        const sistema = crearSistema([paqueteB], [pepe], [cuenta]);

        sistema.iniciarSesion(pepe);
        expect(() => sistema.comprarPaquete(paqueteB)).toThrow(new Error("El cliente no tiene saldo suficiente para ese paquete"));
        expect(pepe.conocerPaquetes()).toEqual([paqueteClienteA]);
        expect(sistema.consultarSaldo()).toBe(0);
    });

});
describe("Testeamos los consumos de internet", ()=>{ //NOTA ya estan ordenandos por fecha

    test("Verificamos que la factory de consumos funcione correctamente", ()=>{
        const fechaInicio = new Date(2001, 8, 11, 9, 40); //new Date(año, mes, día, hora, minuto, segundo, milisegundo)
        const fechaFin = new Date(2001, 8, 11, 9, 50);

        const consumoI = crearConsumo("inTeRneT", fechaInicio, fechaFin, 300);
        const consumoM = crearConsumo("mInUtOs", fechaInicio, fechaFin, 300);

        expect(consumoI).toBeInstanceOf(ConsumoInternet);
        expect(consumoM).toBeInstanceOf(ConsumoMinutos);

        expect(consumoI.obtenerDuracionConsumo()).toBe(10); //duracion en minutos del consumo
        expect(consumoM.obtenerDuracionConsumo()).toBe(10); //duracion en minutos del consumo

    })

    test("Al realizar un consumo, el paquete se modifica correctamente", ()=>{
        const paqueteCliente = crearPaqueteCliente(crearPaquete(2.5, 1000, 30, 400), 1111111111); //gb-minutos-dias-costo

        paqueteCliente.consumirDatos(0.300);
        expect(paqueteCliente.obtenerDatos()).toEqual(2.200);

    });

    test("Al realizar un consumo de Internet por parte de un cliente con un paquete vigente, este se modifica y queda registrado como consumo", ()=>{
        const fechaInicio = new Date(2001, 8, 11, 9, 40); //new Date(año, mes, día, hora, minuto, segundo, milisegundo)
        const fechaFin = new Date(2001, 8, 11, 9, 50);

        const paquete = crearPaquete(2.5, 1000, 30, 400); //gb-minutos-dias-costo
        const paqueteCliente = crearPaqueteCliente(crearPaquete(2.5, 1000, 30, 400), 1111111111)

        const pepe = crearCliente("Juan Alberto", "Pepe", 1111111111, [paqueteCliente]); 
        const cuenta = crearCuenta(1111111111, 0); 

        const sistema = crearSistema([paquete], [pepe], [cuenta]);

        const consumoI = crearConsumo("inTeRneT", fechaInicio, fechaFin, 0.300);


        sistema.iniciarSesion(pepe);
        sistema.realizarConsumo(consumoI);
        
        expect((pepe.conocerPaquetes()[0]).obtenerDatos()).toEqual(2.200);
        expect(sistema.consultarConsumos()).toEqual([consumoI]);
    });

    test("Al realizar un consumo de Minutos por parte de un cliente con un paquete vigente, este se modifica y queda registrado como consumo", ()=>{
        const fechaInicio = new Date(2001, 8, 11, 9, 40); //new Date(año, mes, día, hora, minuto, segundo, milisegundo)
        const fechaFin = new Date(2001, 8, 11, 9, 50);

        const paquete = crearPaquete(2.5, 1000, 30, 400); //gb-minutos-dias-costo
        const paqueteCliente = crearPaqueteCliente(paquete, 1111111111);

        const pepe = crearCliente("Juan Alberto", "Pepe", 1111111111, [paqueteCliente]); 
        const cuenta = crearCuenta(1111111111, 0); 

        const sistema = crearSistema([paquete], [pepe], [cuenta]);

        const consumoM = crearConsumo("minutos", fechaInicio, fechaFin, 10);

        sistema.iniciarSesion(pepe);
        sistema.realizarConsumo(consumoM);

        expect((pepe.conocerPaquetes()[0]).obtenerMinutos()).toEqual(990);
        expect(sistema.consultarConsumos()).toEqual([consumoM]);

    });

    test("Al realizar dos consumos de Minutos identicos por parte de un cliente con un paquete vigente, este se modifica de manera acorde y quedan registrados como consumos", ()=>{
        const fechaInicio = new Date(2001, 8, 11, 9, 40); //new Date(año, mes, día, hora, minuto, segundo, milisegundo)
        const fechaFin = new Date(2001, 8, 11, 9, 50);
        const consumoM = crearConsumo("minutos", fechaInicio, fechaFin, 10); //tipoConsumo, inicio, fin, cantidad

        const paquete = crearPaquete(2.5, 1000, 30, 400); //gb-minutos-dias-costo
        const paqueteCliente = crearPaqueteCliente(paquete, 1111111111);

        const pepe = crearCliente("Juan Alberto", "Pepe", 1111111111, [paqueteCliente]); 
        const cuenta = crearCuenta(1111111111, 0); 

        const sistema = crearSistema([paquete], [pepe], [cuenta]);

        sistema.iniciarSesion(pepe);
        sistema.realizarConsumo(consumoM);
        sistema.realizarConsumo(consumoM);

        expect((pepe.conocerPaquetes()[0]).obtenerMinutos()).toEqual(980);
        expect(sistema.consultarConsumos()).toEqual([consumoM, consumoM]);

    });

    test("Al intentar realizar consumos mas grande de lo que permite el paquete, estos fallan y no se realizan", ()=>{
        const fechaInicio = new Date(2001, 8, 11, 9, 40); //new Date(año, mes, día, hora, minuto, segundo, milisegundo)
        const fechaFin = new Date(2001, 8, 11, 9, 50);
        const consumoI = crearConsumo("internet", fechaInicio, fechaFin, 10);   //intenta consumir 10gb
        const consumoM = crearConsumo("minutos", fechaInicio, fechaFin, 1001);  //intenta consumir 1001 minutos

        const paquete = crearPaquete(2.5, 1000, 30, 400); //gb-minutos-dias-costo
        const paqueteCliente = crearPaqueteCliente(paquete, 1111111111);

        const pepe = crearCliente("Juan Alberto", "Pepe", 1111111111, [paqueteCliente]); 
        const cuenta = crearCuenta(1111111111, 0); 

        const sistema = crearSistema([paquete], [pepe], [cuenta]);

        sistema.iniciarSesion(pepe);
        expect(() => sistema.realizarConsumo(consumoI)).toThrow(new Error ("No tenes suficientes MB para realizar ese consumo"));
        expect(sistema.consultarConsumos()).toEqual([]); //el arreglo de consumos esta vacio

        expect(() => sistema.realizarConsumo(consumoM)).toThrow(new Error ("No tenes suficientes minutos para realizar ese consumo"));
        expect(sistema.consultarConsumos()).toEqual([]); //el arreglo de consumos sigue vacio

    });

    test("Al intentar realizar consumos que no agotan la totalidad del paquete estos se efectuan, al aplicarlos devuelta estos no se realizan", ()=>{
        const fechaInicio = new Date(2001, 8, 11, 9, 40); //new Date(año, mes, día, hora, minuto, segundo, milisegundo)
        const fechaFin = new Date(2001, 8, 11, 9, 50);
        const consumoI = crearConsumo("internet", fechaInicio, fechaFin, 2);   //consumo de 2gb
        const consumoM = crearConsumo("minutos", fechaInicio, fechaFin, 700);  //consumo de 700 minutos

        const paquete = crearPaquete(2.5, 1000, 30, 400); //gb-minutos-dias-costo
        const paqueteCliente = crearPaqueteCliente(paquete, 1111111111);

        const pepe = crearCliente("Juan Alberto", "Pepe", 1111111111, [paqueteCliente]); 
        const cuenta = crearCuenta(1111111111, 0); 

        const sistema = crearSistema([paquete], [pepe], [cuenta]);

        sistema.iniciarSesion(pepe);

        sistema.realizarConsumo(consumoI);
        sistema.realizarConsumo(consumoM);
        expect(sistema.consultarConsumos()).toEqual([consumoI, consumoM]);

        expect(() => sistema.realizarConsumo(consumoI)).toThrow(new Error ("No tenes suficientes MB para realizar ese consumo"));
        expect(() => sistema.realizarConsumo(consumoM)).toThrow(new Error ("No tenes suficientes minutos para realizar ese consumo"));

    });

    test("Al crear un cliente que compra un paquete y realizar un consumo a un paquete terminado que fue etiquetado como renovable automaticamente, puede realizar el consumo y se descuenta del saldo, el cliente recibe otro paquete de iguales caracteristicas y las propiedades de ambos se modifican segun el consumo", ()=>{
        const fechaInicio = new Date(2001, 8, 11, 9, 40); //new Date(año, mes, día, hora, minuto, segundo, milisegundo)
        const fechaFin = new Date(2001, 8, 11, 9, 50);
        const consumoI = crearConsumo("internet", fechaInicio, fechaFin, 2.5); //consumo de 2.5GB
        const consumoM = crearConsumo("minutos", fechaInicio, fechaFin, 1000); //consumo de 1000 Minutos

        const paquete = crearPaquete(2.5, 1000, 30, 400); 
        const paqueteCliente = crearPaqueteCliente(crearPaquete(2.5, 1000, 30, 400), 1111111111);//gb-minutos-dias-costo

        const pepe = crearCliente("Juan Alberto", "Pepe", 1111111111, [paqueteCliente]); //def paquetes = [new PaqueteVacio()]
        const cuenta = crearCuenta(1111111111, 800); 

        const sistema = crearSistema([paquete], [pepe], [cuenta]);

        sistema.iniciarSesion(pepe);
        //sistema.comprarPaquete(paquete); //compra con exito el paquete
        expect(pepe.conocerPaquetes()).toEqual([paqueteCliente]) //el paquete se trasnforma a paqueteCliente

        sistema.activarRenovarAutomaticamente(); //activamos la renovacion automatica del paquete 

        sistema.realizarConsumo(consumoI);  //agotamos gb del paquete
        sistema.realizarConsumo(consumoM);  //agotamos minutos del paquete

        expect(sistema.consultarConsumos()).toEqual([consumoI, consumoM]); //confirmamos que se hayan efectuado los consumos

        sistema.realizarConsumo(consumoI);  //consumimos nuevamente
        sistema.realizarConsumo(consumoM);  //consumimos nuevamente

        expect(sistema.consultarConsumos()).toEqual([consumoI,consumoM, consumoI, consumoM]); //como la fecha en ambos consumos es la misma, estan ordenados por entrada, en definitiva no fueron ordenados
        expect((pepe.conocerPaquetes()[0]).obtenerDatos()).toEqual(0); 
        expect((pepe.conocerPaquetes()[0]).obtenerMinutos()).toEqual(0);

        expect((pepe.conocerPaquetes()[1]).obtenerDatos()).toEqual(0);
        expect((pepe.conocerPaquetes()[1]).obtenerMinutos()).toEqual(0);
    });

    test("Al intentar realizar un consumo a un paquete terminado que fue etiquetado como renovable automaticamente pero sin saldo, no se compra y los consumos no se realizan", ()=>{
        const fechaInicio = new Date(2001, 8, 11, 9, 40); //new Date(año, mes, día, hora, minuto, segundo, milisegundo)
        const fechaFin = new Date(2001, 8, 11, 9, 50);

        const consumoI = crearConsumo("internet", fechaInicio, fechaFin, 2.5); //consumo de GB
        const consumoM = crearConsumo("minutos", fechaInicio, fechaFin, 1000); //consumo de Minutos

        const paquete = crearPaquete(2.5, 1000, 30, 400); //gb-minutos-dias-costo

        const pepe = crearCliente("Juan Alberto", "Pepe", 1111111111); //def paquetes = [new PaqueteVacio()]
        const cuenta = crearCuenta(1111111111, 400); //suficiente para comprar un paquete solo

        const sistema = crearSistema([paquete], [pepe], [cuenta]);

        sistema.iniciarSesion(pepe);
        sistema.comprarPaquete(paquete);

        sistema.activarRenovarAutomaticamente();

        sistema.realizarConsumo(consumoI);  //agotamos gb del paquete
        sistema.realizarConsumo(consumoM);  //agotamos minutos del paquete

        expect(() => sistema.realizarConsumo(consumoI)).toThrow(new Error("El cliente no tiene saldo suficiente para ese paquete"));  
        expect(() => sistema.realizarConsumo(consumoM)).toThrow(new Error("El cliente no tiene saldo suficiente para ese paquete")); 
        
        expect(pepe.conocerPaquetes().length).toEqual(2); //recordar que como este cliente arranco sin paquetes contiene un new PaqueteVacio()

    });

});
describe("Testeamos la fecha sobre los paquetes", ()=>{
    test("Al crear un paquete Cliente con una fecha vieja, se encuentra expirado o no vigente", ()=>{
        const fechaVieja = new Date(2001, 8, 11, 9, 40); //new Date(año, mes, día, hora, minuto, segundo, milisegundo)
        const paquete = crearPaqueteCliente(crearPaquete(1,1,30,1,1), 1111111111, fechaVieja) //(cantDatosMoviles, cantTiempoLlamadas, duracion, costo, idPaquete = 0, fechaCompra = new Date()){

        expect(paquete.estaVigente()).toBe(false)
        //la propiedad o caracteristica de un paquete de "encontrarse expirado" solo es obtenible por un paquete que le pertenece a un cliente
    });

    test("Al tener un cliente con un paquete expirado que todavia tiene datos, este puede comprar otro nuevo", ()=>{
        const fechaInicioSesion = new Date(2001, 8, 11, 9, 40); //new Date(año, mes, día, hora, minuto, segundo, milisegundo)
        const paqueteViejo = crearPaqueteCliente(crearPaquete(2.5, 1000, 30, 400, 1),1111111111, fechaInicioSesion);
        const paquetePepe = crearPaqueteCliente(paqueteViejo, 1111111111, fechaInicioSesion);

        const paqueteDisponible = crearPaquete(2.5, 1000, 30, 400, 1);

        const pepe = crearCliente("Juan Alberto", "Pepe", 1111111111, [paqueteViejo]); //paquetes def = []
        const cuenta = crearCuenta(1111111111, 400); //saldo def = 0
        
        const sistema = crearSistema([paqueteDisponible], [pepe], [cuenta]);

        sistema.iniciarSesion(pepe, fechaInicioSesion);
        //aclaramos la fecha de inicio de sesion para asegurarnos de que no se vayan creando nuevos objetos new Date dentro del sistema y 
        // podamos comparar por una referencia estricta

        sistema.comprarPaquete(paqueteDisponible);

        expect(sistema.consultarSaldo()).toBe(0);  
        expect(pepe.conocerPaquetes()).toEqual([paqueteViejo, paquetePepe]); 
        
    });
})
describe("Testeamos el filtro de fecha sobre los consumos", ()=>{ //nota, los consumos de los test anteriores ya estaban ordenados por fecha
    test("Al realizar dos consumos de Internet por parte de un cliente y revisar la lista de consumos, estos estan ordenados correctamente", ()=>{
        const fechaInicio1 = new Date(2001, 8, 11, 9, 40); //new Date(año, mes, día, hora, minuto, segundo, milisegundo)
        const fechaFin1 = new Date(2001, 8, 11, 9, 50);

        const fechaInicio2 = new Date(2000, 8, 11, 9, 40);  //cambia el anio, el consumo es mas viejo
        const fechaFin2 = new Date(2000, 8, 11, 9, 50);     //cambia el anio, el consumo es mas viejo


        const paquete = crearPaquete(2.5, 1000, 30, 400); //gb-minutos-dias-costo
        const paqueteCliente = crearPaqueteCliente(crearPaquete(2.5, 1000, 30, 400), 1111111111)

        const pepe = crearCliente("Juan Alberto", "Pepe", 1111111111, [paqueteCliente]); 
        const cuenta = crearCuenta(1111111111, 0); 

        const sistema = crearSistema([paquete], [pepe], [cuenta]);

        const consumo1 = crearConsumo("inTeRneT", fechaInicio1, fechaFin1, 0.300);
        const consumo2 = crearConsumo("inTeRneT", fechaInicio2, fechaFin2, 0.300);

        sistema.iniciarSesion(pepe);
        sistema.realizarConsumo(consumo1);
        sistema.realizarConsumo(consumo2);

        expect(sistema.consultarConsumos()).toEqual([consumo2, consumo1]);    //realizamos primero el 1 y despues el 2 y aun asi estan ordenados de manera que el 2 es mas antiguo
    });

    test("Al realizar muchos consumos y pedir que se aplique nuestro filtro por fecha, nos devuelve solo aquellos realizados durante el intervalo pedido", ()=>{

        const consumo1 = crearConsumo("internet", new Date(2001,8,11,9,40), new Date(2001,8,11,9,41), 0.1);
        const consumo2 = crearConsumo("internet", new Date(2001,8,11,9,42), new Date(2001,8,11,9,43), 0.1);
        const consumo3 = crearConsumo("internet", new Date(2001,8,11,9,44), new Date(2001,8,11,9,45), 0.1);
        const consumo4 = crearConsumo("internet", new Date(2001,8,11,9,46), new Date(2001,8,11,9,47), 0.1);
        const consumo5 = crearConsumo("internet", new Date(2001,8,11,9,48), new Date(2001,8,11,9,49), 0.1);
        const consumo6 = crearConsumo("internet", new Date(2001,8,11,9,50), new Date(2001,8,11,9,51), 0.1);
        const consumo7 = crearConsumo("internet", new Date(2001,8,11,9,52), new Date(2001,8,11,9,53), 0.1);
        const consumo8 = crearConsumo("internet", new Date(2001,8,11,9,54), new Date(2001,8,11,9,55), 0.1);
        const consumo9 = crearConsumo("internet", new Date(2001,8,11,9,56), new Date(2001,8,11,9,57), 0.1);
        const consumo10 = crearConsumo("internet", new Date(2001,8,11,9,58), new Date(2001,8,11,9,59), 0.1);
        //todo esto se puede escribir bastante rapido si usas la ruedita del mouse, no es ia

        const paquete = crearPaquete(2.5, 1000, 30, 400); //gb-minutos-dias-costo
        const paqueteCliente = crearPaqueteCliente(crearPaquete(2.5, 1000, 30, 400), 1111111111)

        const pepe = crearCliente("Juan Alberto", "Pepe", 1111111111, [paqueteCliente]); 
        const cuenta = crearCuenta(1111111111, 0); 

        const sistema = crearSistema([paquete], [pepe], [cuenta]);

        sistema.iniciarSesion(pepe);
        sistema.realizarConsumo(consumo1);
        sistema.realizarConsumo(consumo2);
        sistema.realizarConsumo(consumo3)
        sistema.realizarConsumo(consumo4)
        sistema.realizarConsumo(consumo5)
        sistema.realizarConsumo(consumo6)
        sistema.realizarConsumo(consumo7)
        sistema.realizarConsumo(consumo8)
        sistema.realizarConsumo(consumo9)
        sistema.realizarConsumo(consumo10)

        const filtro = crearFiltroFecha(new Date(2001,8,11,9,46), new Date(2001,8,11,9,55));

        sistema.consultarConsumos(filtro);

        expect(sistema.consultarConsumos(filtro)).toEqual([consumo4, consumo5, consumo6, consumo7, consumo8]);
    });

})