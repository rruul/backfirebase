const express = require('express')
const bcrypt = require('bcrypt')
const cors = require('cors')
const { getFirestore, collection, getDoc, setDoc, doc, getDocs } = require('firebase/firestore')
const { initializeApp } = require ('firebase/app')

require('dotenv/config')

// configuracion del firebase
const firebaseConfig = {
  apiKey: "AIzaSyBc2WydaE817m32IKOHCQyndyhvtKbCHh0",
  authDomain: "dicis-back-4f276.firebaseapp.com",
  projectId: "dicis-back-4f276",
  storageBucket: "dicis-back-4f276.appspot.com",
  messagingSenderId: "171526308327",
  appId: "1:171526308327:web:9f99a41f6c98b2694a7d42"
};

// Inicializacion de la db en firebase
const firebase = initializeApp(firebaseConfig)
const db = getFirestore()

// Inicializamos servidor

const app = express()

// Opciones de cors
const corsOptions = {
    "origin": "a",
    "optionSuccessStatus": 200
}

// Configuracion del servidor
app.use(express.json())
app.use(cors(corsOptions))

// Ruta para insertar registro
app.post('/insertar', (req, res) => {
    const { name, lastname, email, password, number } = req.body

    if (!name || !lastname || !email || !password || !number) {
        res.json({
            'alert': 'faltan datos'
        })
        return
    }

    // validaciones
    if(name.length < 3) {
        res.json({
            'alert': 'El nombre debe tener una longitud minima de 3 caracteres'
        })
    } else if (lastname.length < 3) {
        res.json({
            'alert': 'El apellido debe tener una longitud minima de 3 caracteres'
        })
    } else if (!email.length) {
        res.json({
            'alert': 'Ingresa un correo electronico'
        })
    } else if (password.length < 8) {
        res.json({
            'alert': 'La contrase;a debe contener minimo 8 caracteres'
        })
    } else if (!Number(number) || !number.length === 10) {
        res.json({
            'alert': 'Introduce un numero valido'
        })
    } else {
        const alumnos = collection(db, "alumnos")

        getDoc(doc(alumnos, email)).then(alumno => {
            if(alumno.exists()) {
                req.json({
                    'alert': 'El correo ya existe en la DB'
                })
            } else {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        sendData = {
                            name,
                            lastname,
                            email,
                            password: hash,
                            number
                        }

                        // Guardar en DB
                        setDoc(doc(alumnos, email), sendData).then(() => {
                            res.json({
                                'alert': 'success'
                            })
                        }).catch((error) => {
                            res.json({
                                'alert': error
                            })
                        })
                    })
                })
            }
        })
    }
})

// ruta para logear
app.post('/login', (req, res) => {

})

// Ruta para obtener documentos de db
app.get('/traertodo', async (req, res) => {
    const alumnos = collection(db, "alumnos")
    const arreglo = await getDocs(alumnos)
    let returnData = []
    arreglo.forEach(alumno => {
        returnData.push(alumno.data())
    })
    res.json({
        'alert': 'success',
        'data': returnData
    })
})

// Ruta de eliminar
app.post('/eliminar', (req, res) => {

})

// Ruta para actualizar
app.post('/actualizar', (req, res) => {

})

const PORT = process.env.PORT || 12000

app.listen(PORT, () => {
    console.log(`Escuchando Puerto: ${PORT}`)
})