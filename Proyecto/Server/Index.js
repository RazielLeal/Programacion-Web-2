const express = require("express");
const cors = require("cors");
const mysql2 = require("mysql2");
const multer = require("multer");

const app = express();

app.use(cors());
app.use(express.json());

app.get(
    '/', 
    (req, resp)=>{
        resp.json("Hola desde el servidos");
    }
)

app.listen(
    3001, 
    ()=>{console.log("Escuchando");}
)

const db = mysql2.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "1234",
        database: "DB_PW",
        port: 3306
    }
    
)

const filefilter =(req, file, cb) => {
    const formatos = ["image/png", "image/jpg", "image/jpeg"]

    if(formatos.includes(file.mimetype)) {
        cb(null, true);
    }else{
        return cb(new Error("Archivo no aceptado"));
    }
}

const espacio = multer.memoryStorage();

const Archivo = multer({
    storage: espacio,
    fileFilter: filefilter
})

app.post(
    "/register", 
    Archivo.single("file"),
    (req, resp) => {
        const {name, mail, pass} = req.body;
        const imagen = req.file.buffer.toString("base64");

        db.query(
            "INSERT INTO usuario(Nombre, Correo, Contra, Imagen) VALUES(?,?,?,?)", 
            [name, mail, pass, imagen], 
            (err, result) => {
                if (err) {
                    resp.json({
                        msg: "ErrorDB"
                    })
                    console.log(err);
                } else {
                    resp.json({
                        msg: "Registrado"
                    })
                    console.log(result);
                }
            }
        )

    }
)

app.post("/login", (req, resp) => {
    const { mail, pass } = req.body;

    db.query(
        "SELECT * FROM usuario WHERE Correo=? AND Contra=?",
        [mail, pass],
        (err, result) => {
            if (err) {
                console.error("Login query error:", err);
                return resp.json({ 
                    msg: "DB Error", 
                    error: err.message 
                });
            }

            if (result.length > 0) {
                const nombre = result[0].Nombre;
                return resp.json({
                    msg: "SI",
                    user: nombre
                });
            } else {
                return resp.json({
                    msg: "NO"
                });
            }
        }
    );
});



