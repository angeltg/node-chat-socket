const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utils/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarAlChat', (usuario, callback) => {

        //console.log(usuario);

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

    client.on('crearMensaje', (data) => {

        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
    });

    client.on('disconnect', () => {

        let usuarioDesconectado = usuarios.borrarPersona(client.id);
        client.broadcast.to(usuarioDesconectado.sala).emit('crearMensaje', crearMensaje('Administrador', usuarioDesconectado.nombre + ' salió '));
        client.broadcast.to(usuarioDesconectado.sala).emit('listaDePersonas', usuarios.getPersonasPorSala(usuarioDesconectado.sala));

    });

    // Mensaje privados
    client.on('mensajePrivado', data => {

        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.paraId).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));

    });



});