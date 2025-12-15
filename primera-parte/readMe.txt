
analizar si es que tengo que cambiar toStrictEqual (compara igualdad de valor) por toBe (compara igualdad de referencia)

cambiar descripcion de los tests y describe para que parezca mas descriptivo

revisar este

test("Al realizar dos consumos de Internet por parte de un cliente y revisar la lista de consumos, estos estan ordenados correctamente", ()=>{

        const fechaInicio = new Date(2001, 8, 11, 9, 40); //new Date(año, mes, día, hora, minuto, segundo, milisegundo)
        const fechaFin = new Date(2001, 8, 11, 9, 50);

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

    