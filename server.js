const express = require('express')
const { connectDB } = require('./config/db.js')
const { Archivo } = require('./models/Archivos')
const multer = require("multer");
const bodyParser = require("body-parser")

const app = express()

require('dotenv').config()
require('colors')

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.set('view engine', 'ejs')
app.use(express.static(`${__dirname}/public`))

//Configuration for Multer
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/")
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `files/admin-${file.fieldname}-${Date.now()}.${ext}`)
    }
})

//Calling the "multer" Function
const upload = multer({ storage: multerStorage })

connectDB()

const port = 5000 || 5050

app.get('/', async (req, res) => {
    const archivos = await Archivo.find()

    res.render(__dirname + '/public/index.ejs', { archivos })
})

app.post('/delete', async (req, res) => {
    const archivo = await Archivo.findById(req.body.txtPass)

    if (archivo) {
        await archivo.remove()
        res.json({ message: 'Archivo removido' })
    } else {
        res.status(404)
        throw new Error('Archivo no encontrado')
    }
})

app.post('/edit', async (req, res) => {
    const archivo = await Archivo.findById(req.body.txtPass)

    if (archivo) {
        archivo.correo = req.body.txtCorreo
        archivo.nombres = req.body.txtNombres

        const updatedArchivo = await archivo.save()
        res.json(updatedArchivo)
    } else {
        res.status(404)
        throw new Error('Archivo no encontrado')
    }
})

app.get('/create', (req, res) => {
    res.render(__dirname + '/public/create.ejs')
})

app.post('/create', upload.single("txtFile"), async (req, res) => {
    try {
        const archivo = await Archivo.create({
            correo: req.body.txtCorreo,
            nombres: req.body.txtName,
            cuatrimestre: req.body.txtCuatri,
            tipo: req.body.txtTipo,
            archivo: req.file.filename
        })

        res.status(200).json({
            status: "success",
            message: "Archivo enviado con exito"
        })
    } catch (error) {
        res.json({ error })
    }
})

app.listen(port, () => {
    console.log(`Corriendo en el puerto ${port}`.green.bold)
})