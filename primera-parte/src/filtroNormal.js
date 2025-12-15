"use strict";

const FiltroNormal = function(){}

FiltroNormal.aplicar = function(consumos){
    
    consumos.sort((a, b) => {
        return (a.obtenerFechaInicio()).getTime() - (b.obtenerFechaInicio()).getTime();
    });
}

module.exports = FiltroNormal;