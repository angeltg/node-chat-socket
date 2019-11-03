const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utils/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarAlChat', (usuario, callback) => {

        if (!usuario.nombre || !usuario.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            });
        }

        client.join(usuario.sala);
        let usuariosConectados = usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala);
        let usuariosConectadosPorSala = usuarios.getPersonasPorSala(usuario.sala);
        client.broadcast.to(usuario.sala).emit('crearMensaje', crearMensaje('Administrador', usuario.nombre + ' se conectó '));

        client.broadcast.to(usuario.sala).emit('listaDePersonas', usuariosConectadosPorSala);

        callback(usuariosConectadosPorSala);


    });

    client.on('crearMensaje', (data, callback) => {

        let persona = usuarios.getPersona(client.id)[0];
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

        callback(mensaje);

    });

    client.on('disconnect', () => {
        let usuarioDesconectadoArray = usuarios.borrarPersona(client.id);
        let usuarioDesconectado = usuarioDesconectadoArray[0];
        if (usuarioDesconectado) {
            client.broadcast.to(usuarioDesconectado.sala).emit('crearMensaje', crearMensaje('Administrador', usuarioDesconectado.nombre + ' salió '));
            console.log('disconnect', usuarioDesconectado);
            client.broadcast.to(usuarioDesconectado.sala).emit('listaDePersonas', usuarios.getPersonasPorSala(usuarioDesconectado.sala));
        }

    });

    // Mensaje privados
    client.on('mensajePrivado', data => {
        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.paraId).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));

    });



});