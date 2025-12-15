"use strict";

const FiltroPorFecha = function(fechaInicioFiltro, fechaFinFiltro) {
    this.fechaInicioFiltro = fechaInicioFiltro;
    this.fechaFinFiltro = fechaFinFiltro;
};

FiltroPorFecha.prototype.aplicar = function(arregloConsumos) {
    
    const inicioFiltro = this.fechaInicioFiltro;
    const finFiltro = this.fechaFinFiltro;
    
    let consumosFiltrado = arregloConsumos.filter(consumo => {
        let pasaFiltro = true;
        let consumoFechaInicio = consumo.obtenerFechaInicio();
        let consumoFechaFin = consumo.obtenerFechaFin();

        let pasaFiltroInicio = consumoFechaInicio >= inicioFiltro;
        let pasaFiltroFin = consumoFechaFin <= finFiltro;

        pasaFiltro = pasaFiltroInicio && pasaFiltroFin;

        return pasaFiltro;
    });
    arregloConsumos.length = 0; //vacio el array sin perder la referencia
    arregloConsumos.push(...consumosFiltrado); //spread de los elementos del arreglo filtrado

};

module.exports = FiltroPorFecha;