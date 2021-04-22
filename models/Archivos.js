const mongoose = require('mongoose')

const archivoSchemma = mongoose.Schema(
    {
        correo: {
            type: String,
            required: true,
        },
        nombres: {
            type: String,
            required: true,
        },
        cuatrimestre: {
            type: String,
            required: true,
        },
        tipo: {
            type: String,
            required: true,
        },
        archivo: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
)

const Archivo = mongoose.model('archivos', archivoSchemma)

module.exports = {
    Archivo
}