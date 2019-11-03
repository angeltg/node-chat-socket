const crearMensaje = (nombre, mensaje) => {
    console.log('Se ha creado el mensaje', nombre, mensaje);
    return {
        nombre,
        mensaje,
        fecha: new Date().getTime()
    }
}

module.exports = {
    crearMensaje
}