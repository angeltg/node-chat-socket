class Usuarios {

    constructor() {
        this.personas = [];
    }


    agregarPersona(id, nombre, sala) {
        let persona = {
            id,
            nombre,
            sala
        }
        this.personas.push(persona);

        return this.personas;
    }

    getPersona(id) {
        //como filter devuelve un arrray y solo queremos un elemento ponemos [0]
        let persona = this.personas.filter(persona => persona.id === id)[0];

        return persona;
    }

    getPersonas() {
        return this.personas;
    }

    getPersonasPorSala(sala) {
        let personaEnSala = this.personas.filter(persona => persona.sala === sala)[0];
        return personaEnSala;
    }
    borrarPersona(id) {
        let personaBorrada = this.getPersona(id);
        this.personas = this.personas.filter(persona => persona.id != id);

        return personaBorrada;
    }


}

module.exports = { Usuarios };