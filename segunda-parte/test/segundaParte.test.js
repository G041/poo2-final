"use strict";
const {crearCliente, crearPaquete, crearCuenta, crearSistema, crearConsumo, crearPaqueteCliente, crearPrestamo} = require("./factories");
const ConsumoInternet = require("../src/consumoInternet");
const ConsumoMinutos = require("../src/consumoMinutos");
const PaqueteCliente = require("../src/paqueteCliente");
const PrestamoDatos = require("../src/prestamoDatos");
const PrestamoMinutos = require("../src/prestamoMinutos");


describe("Verificamos que ande correctamente la creacion de consumos por parte de aplicaciones", ()=>{

    test("Creamos un consumo de Internet por parte de WhatsApp", ()=>{
        const consumoWhatsApp = crearConsumo("inTeRneT", new Date(2001, 8, 11, 9, 40), new Date(2001, 8, 11, 9, 50), 300, "WhatsApp"); //la aplicacion por default es ""
        
        expect(consumoWhatsApp).toBeInstanceOf(ConsumoInternet);
        expect(consumoWhatsApp.hechoPor()).toBe("WhatsApp");
    })

    test("Creamos un consumoI por parte de una app y al ser aplicado por un cliente a su paquete ilimitado para esa app, este no sufre modificaciones", ()=>{
        const paqueteCliente = crearPaqueteCliente(crearPaquete(2.5,1000,30,400,1, "WhatsApp")) //cantDatosMoviles, cantTiempoLlamadas, duracion, costo, idPaquete = 0, appIlimitada = ""
        const pepe = crearCliente("Juan Alberto", "Pepe", 1111111111, [paqueteCliente]); //def paquetes = [new PaqueteVacio()]
        const cuenta = crearCuenta(1111111111, 800); 

        const consumoWhatsApp = crearConsumo("inTeRneT", new Date(2001, 8, 11, 9, 40), new Date(2001, 8, 11, 9, 50), 0.300, "WhatsApp"); //la aplicacion por default es ""

        const sistema = crearSistema([], [pepe], [cuenta]);
        sistema.iniciarSesion(pepe);

        sistema.realizarConsumo(consumoWhatsApp);

        expect(sistema.consultarConsumos()).toEqual([consumoWhatsApp]); //el consumo fue registrado
        expect((pepe.conocerPaquetes()[0]).obtenerDatos()).toBe(2.5);   //el paquete sigue intacto
    })
    test("Creamos un consumoI por parte de una app y al ser aplicado por un cliente a su paquete sin datos, se realiza de igual manera", ()=>{
        const paqueteCliente = crearPaqueteCliente(crearPaquete(0,1000,30,400,1, "WhatsApp")) //cantDatosMoviles, cantTiempoLlamadas, duracion, costo, idPaquete = 0, appIlimitada = ""
        const pepe = crearCliente("Juan Alberto", "Pepe", 1111111111, [paqueteCliente]); //def paquetes = [new PaqueteVacio()]
        const cuenta = crearCuenta(1111111111, 800); 

        const consumoWhatsApp = crearConsumo("inTeRneT", new Date(2001, 8, 11, 9, 40), new Date(2001, 8, 11, 9, 50), 0.300, "WhatsApp"); //la aplicacion por default es ""

        const sistema = crearSistema([], [pepe], [cuenta]);
        sistema.iniciarSesion(pepe);
        sistema.realizarConsumo(consumoWhatsApp);

        expect(sistema.consultarConsumos()).toEqual([consumoWhatsApp]); //el consumo fue registrado
        expect((pepe.conocerPaquetes()[0]).obtenerDatos()).toBe(0);   //el paquete sigue intacto
    }) //no hay mucho mas que testear si anda todo lo anterior )?
});
describe("Testeamos los prestamos de datos y/o minutos por parte de los clientes", ()=>{

    test("Al crear un prestamo de datos y uno de minutos estos se instancian de manera correcta gracias a la factory", ()=>{

        const prestamoDatos = crearPrestamo("dAtOs", 1);
        const prestamoMinutos = crearPrestamo("mInUtOs", 1);


        expect(prestamoDatos).toBeInstanceOf(PrestamoDatos);
        expect(prestamoMinutos).toBeInstanceOf(PrestamoMinutos);

    })
    test("Tenemos dos clientes, el primero Fede le presta al segundo Fran y este obtiene datos y minutos", ()=>{
        const paqueteFede = crearPaqueteCliente(crearPaquete(2.5,1000,30,400,1)) //cantDatosMoviles, cantTiempoLlamadas, duracion, costo, idPaquete = 0, appIlimitada = ""
        const paqueteFran = crearPaqueteCliente(crearPaquete(0,0,30,400,1)) 
        
        const fede = crearCliente("Juan Alberto", "Pepe", 1111111111, [paqueteFede]); //def paquetes = [new PaqueteVacio()]
        const fran = crearCliente("Juan Alberto", "Pepe", 2222222222, [paqueteFran]); //def paquetes = [new PaqueteVacio()]

        const cuentaFede = crearCuenta(1111111111, 800); 
        const cuentaFran = crearCuenta(2222222222, 800); 

        const sistema = crearSistema([], [fede, fran], [cuentaFede, cuentaFran]);

        const prestamoDatos = crearPrestamo("dAtOs", 1);

        sistema.iniciarSesion(fede);
        sistema.realizarPrestamo(fran, prestamoDatos);
        sistema.cerrarSesion();

        sistema.iniciarSesion(fran);
        expect((fran.conocerPaquetes()[0]).obtenerDatos()).toBe(1);

    });

    test("Al hacer un prestamo de cualquier tipo, no se puede hacer un prestamo inmediatamente despues ya que pone al paquete del receptor en vigencia", ()=>{
        const paqueteFede = crearPaqueteCliente(crearPaquete(2.5,1000,30,400,1)) //cantDatosMoviles, cantTiempoLlamadas, duracion, costo, idPaquete = 0, appIlimitada = ""
        const paqueteFran = crearPaqueteCliente(crearPaquete(0,0,30,400,1)) 
        
        const fede = crearCliente("Juan Alberto", "Pepe", 1111111111, [paqueteFede]); //def paquetes = [new PaqueteVacio()]
        const fran = crearCliente("Juan Alberto", "Pepe", 2222222222, [paqueteFran]); //def paquetes = [new PaqueteVacio()]

        const cuentaFede = crearCuenta(1111111111, 800); 
        const cuentaFran = crearCuenta(2222222222, 800); 

        const sistema = crearSistema([], [fede, fran], [cuentaFede, cuentaFran]);

        const prestamoDatos = crearPrestamo("dAtOs", 1);

        sistema.iniciarSesion(fede);
        sistema.realizarPrestamo(fran, prestamoDatos);
        expect(() => sistema.realizarPrestamo(fran, prestamoDatos)).toThrow(new Error("El recepetor ya tiene un paquete en curso, no necesita ningun prestamo"));

    });

    test("Tenemos dos clientes, el primero le intenta prestar al segundo pero no tiene suficiente", ()=>{
        const paqueteFede = crearPaqueteCliente(crearPaquete(2.5,10,30,400,1)) //cantDatosMoviles, minutos, duracion, costo, idPaquete = 0, appIlimitada = ""
        const paqueteFran = crearPaqueteCliente(crearPaquete(0,0,30,400,1)) 
        
        const fede = crearCliente("Juan Alberto", "Pepe", 1111111111, [paqueteFede]); //def paquetes = [new PaqueteVacio()]
        const fran = crearCliente("Juan Alberto", "Pepe", 2222222222, [paqueteFran]); //def paquetes = [new PaqueteVacio()]

        const cuentaFede = crearCuenta(1111111111, 800); 
        const cuentaFran = crearCuenta(2222222222, 800); 

        const sistema = crearSistema([], [fede, fran], [cuentaFede, cuentaFran]);

        const prestamoDatos = crearPrestamo("dAtOs", 10)
        const prestamoMinutos = crearPrestamo("mInuToS", 20)

        sistema.iniciarSesion(fede);
        
        expect(() => sistema.realizarPrestamo(fran, prestamoDatos)).toThrow(new Error("Estas intentando prestar una cantidad de datos mayor a la que tenes"));
        expect(() => sistema.realizarPrestamo(fran, prestamoMinutos)).toThrow(new Error("Estas intentando prestar una cantidad de minutos mayor a la que tenes"));


    });
    test("Tenemos dos clientes, el primero le intenta prestar al segundo pero este ya tiene un paquete vigente en curso, no se realizan modificaciones en ninguno de los dos", ()=>{
        const paqueteFede = crearPaqueteCliente(crearPaquete(2.5,1000,30,400,1)) //cantDatosMoviles, cantTiempoLlamadas, duracion, costo, idPaquete = 0, appIlimitada = ""
        const paqueteFran = crearPaqueteCliente(crearPaquete(1,1,30,400,1)) 
        
        const fede = crearCliente("Juan Alberto", "Pepe", 1111111111, [paqueteFede]); //def paquetes = [new PaqueteVacio()]
        const fran = crearCliente("Juan Alberto", "Pepe", 2222222222, [paqueteFran]); //def paquetes = [new PaqueteVacio()]

        const cuentaFede = crearCuenta(1111111111, 800); 
        const cuentaFran = crearCuenta(2222222222, 800); 

        const sistema = crearSistema([], [fede, fran], [cuentaFede, cuentaFran]);

        sistema.iniciarSesion(fede);
        const prestamoDatos = crearPrestamo("dAtOs", 10)
        const prestamoMinutos = crearPrestamo("mInuToS", 20)

        
        expect(() => sistema.realizarPrestamo(fran, prestamoDatos)).toThrow(new Error("El recepetor ya tiene un paquete en curso, no necesita ningun prestamo"));
        expect(fede.conocerPaquetes()[0].obtenerDatos()).toBe(2.5); //los datos del paquete de fede no se modifican
        expect(fran.conocerPaquetes()[0].obtenerDatos()).toBe(1); //los datos del paquete de fede no se modifican

        expect(() => sistema.realizarPrestamo(fran, prestamoMinutos)).toThrow(new Error("El recepetor ya tiene un paquete en curso, no necesita ningun prestamo"));
        expect(fede.conocerPaquetes()[0].obtenerDatos()).toBe(2.5); //los datos del paquete de fede no se modifican
        expect(fran.conocerPaquetes()[0].obtenerDatos()).toBe(1); //los datos del paquete de fede no se modifican
    });
    test("Al realizar prestamos exitosos entre estos clientes, el prestamos de datos queda guardados de manera clasificada dentro de sus respectivos paquetes", ()=>{
        const fechaTest = new Date();

        const paqueteFede = crearPaqueteCliente(crearPaquete(2.5,1000,30,400,1), 1111111111, fechaTest) //cantDatosMoviles, cantTiempoLlamadas, duracion, costo, idPaquete = 0, appIlimitada = ""
        const paqueteFran = crearPaqueteCliente(crearPaquete(0,0,30,400,1), 2222222222) 
        
        const fede = crearCliente("Juan Alberto", "Pepe", 1111111111, [paqueteFede]); //def paquetes = [new PaqueteVacio()]
        const fran = crearCliente("Juan Alberto", "Pepe", 2222222222, [paqueteFran]); //def paquetes = [new PaqueteVacio()]

        const cuentaFede = crearCuenta(1111111111, 800); 
        const cuentaFran = crearCuenta(2222222222, 800); 

        const sistema = crearSistema([], [fede, fran], [cuentaFede, cuentaFran]);

        const prestamoDatos = crearPrestamo("dAtOs", 1)

        sistema.iniciarSesion(fede);

        sistema.realizarPrestamo(fran, prestamoDatos);

        expect((fede.conocerPaquetes()[0]).conocerPrestamos().length).toBe(1);
        expect((fran.conocerPaquetes()[0]).conocerPrestamos().length).toBe(1);

        expect(((fede.conocerPaquetes()[0]).conocerPrestamos()[0]).conocerObjeto()).toEqual("ENTREGA");
        expect(((fran.conocerPaquetes()[0]).conocerPrestamos()[0]).conocerObjeto()).toEqual("RECIBIDA");
    });

    test("Al realizar un prestamo exitoso entre clientes, el prestamo de Minutos queda guardados de manera clasificada dentro de sus respectivos paquetes", ()=>{

        const fechaTest = new Date();
        const paqueteFede = crearPaqueteCliente(crearPaquete(2.5,1000,30,400,1), 1111111111, fechaTest) //cantDatosMoviles, cantTiempoLlamadas, duracion, costo, idPaquete = 0, appIlimitada = ""
        const paqueteFran = crearPaqueteCliente(crearPaquete(0,0,30,400,1), 2222222222) 
        
        const fede = crearCliente("Juan Alberto", "Pepe", 1111111111, [paqueteFede]); //def paquetes = [new PaqueteVacio()]
        const fran = crearCliente("Juan Alberto", "Pepe", 2222222222, [paqueteFran]); //def paquetes = [new PaqueteVacio()]

        const cuentaFede = crearCuenta(1111111111, 800); 
        const cuentaFran = crearCuenta(2222222222, 800); 

        const sistema = crearSistema([], [fede, fran], [cuentaFede, cuentaFran]);

        const prestamoMinutos = crearPrestamo("minutos", 1)

        sistema.iniciarSesion(fede);

        sistema.realizarPrestamo(fran, prestamoMinutos);

        expect((fede.conocerPaquetes()[0]).conocerPrestamos().length).toBe(1);
        expect((fran.conocerPaquetes()[0]).conocerPrestamos().length).toBe(1);

        expect(((fede.conocerPaquetes()[0]).conocerPrestamos()[0]).conocerObjeto()).toBe("ENTREGA");
        expect(((fran.conocerPaquetes()[0]).conocerPrestamos()[0]).conocerObjeto()).toBe("RECIBIDA");

    });

    test("Al realizar prestamos exitosos entre clientes, el prestamos de Minutos queda guardados, clasificado y el cliente ahora puede realizar consumos", ()=>{
        const fechaTest = new Date();

        const paqueteFede = crearPaqueteCliente(crearPaquete(2.5,1000,30,400,1), 1111111111, fechaTest) //(gb, minutos, duracion, costo, id ...), numCliente, fecha)
        const paqueteFran = crearPaqueteCliente(crearPaquete(0,1,30,400,1), 2222222222, fechaTest) //NOTA: para que pase este test, es necesario que el paquete este vigente
        
        const fede = crearCliente("Juan Alberto", "Pepe", 1111111111, [paqueteFede]); 
        const fran = crearCliente("Juan Alberto", "Pepe", 2222222222, [paqueteFran]); 

        const cuentaFede = crearCuenta(1111111111, 800); 
        const cuentaFran = crearCuenta(2222222222, 800); 

        const sistema = crearSistema([], [fede, fran], [cuentaFede, cuentaFran]);

        const prestamoDatos = crearPrestamo("dAtOs", 1)

        sistema.iniciarSesion(fran);

        const consumoI = crearConsumo("internet", fechaTest, fechaTest, 1);  //intenta consumir 1 gb

        expect(() => sistema.realizarConsumo(consumoI)).toThrow(new Error ("No tenes suficientes MB para realizar ese consumo"));

        const consumoM = crearConsumo("minutos", fechaTest, fechaTest, 1);  //consumimos los minutos de Fran para que su paquete quede no vigente y pueda recibir prestamo
        sistema.realizarConsumo(consumoM);
        sistema.cerrarSesion();

        sistema.iniciarSesion(fede);
        sistema.realizarPrestamo(fran, prestamoDatos);
        sistema.cerrarSesion();

        sistema.iniciarSesion(fran);
        sistema.realizarConsumo(consumoI);
        expect(sistema.consultarConsumos().length).toBe(2); //el primer consumo fue realizado mas arriba, despues del expect().toThrow();

    });

    test("Al realizar prestamos exitosos entre clientes, el prestamo de Minutos queda guardado y clasificado, y al intentar consumir despues de que vencio no puede", ()=>{
        const fechaTest = new Date();
        const diasDelFuturoPasado = new Date(2000, 8, 11, 9, 40); //fecha vieja generica

        const paqueteFede = crearPaqueteCliente(crearPaquete(2.5,1000,30,400,1), 1111111111, diasDelFuturoPasado) //(gb, minutos, duracion, costo, id ...), numCliente, fecha), la fecha de fede es vieja
        const paqueteFran = crearPaqueteCliente(crearPaquete(0,0,30,400,1), 2222222222, fechaTest) //NOTA: el paquete de fran vence hoy pero...se esta por quedar sin MINUTOS!
        
        const fede = crearCliente("Juan Alberto", "Pepe", 1111111111, [paqueteFede]); 
        const fran = crearCliente("Juan Alberto", "Pepe", 2222222222, [paqueteFran]); 

        const cuentaFede = crearCuenta(1111111111, 800); 
        const cuentaFran = crearCuenta(2222222222, 800); 

        const sistema = crearSistema([], [fede, fran], [cuentaFede, cuentaFran]);

        const prestamoDatos = crearPrestamo("dAtOs", 1)
        const consumoI = crearConsumo("internet", fechaTest, fechaTest, 1);  //intenta consumir 1 gb

        sistema.iniciarSesion(fede);
        sistema.realizarPrestamo(fran, prestamoDatos);
        sistema.cerrarSesion();

        sistema.iniciarSesion(fran);
        expect(() => sistema.realizarConsumo(consumoI)).toThrow(new Error("El cliente no tiene ningun paquete valido en curso ni renovable, no puede realizar consumos"));
    });

    
})