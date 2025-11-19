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

//sera para manejar las rutas de archivo en donde se guardaran las imagenes
const path = require('path'); 

//para guardar en disco y no en memoria
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); //aqui se van a guardar las imagenes de las publicaciones
    }, 
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random()* 1E9); 
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);  
    }
});

const upload = multer({ 
    storage: storage, 
    limits: {
        fileSize: 5 * 1024 * 1024
    }
}); 

const Archivo = multer({
    storage: espacio,
    fileFilter: filefilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

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
                const userID = result[0].id; 
                return resp.json({
                    msg: "SI",
                    user: nombre, 
                    id: userID
                });
            } else {
                return resp.json({
                    msg: "NO"
                });
            }
        }
    );
});

//Endpoint para obtener la info del usuario que inicio sesion por medio del id 
app.get("/user/:id", 
    (req, resp) => {
        db.query("SELECT Nombre, Correo, Imagen, descripcion FROM usuario WHERE id = ?", 
        req.params.id,
        (er, result) => { 
        if (er) {
            resp.json({
            msg: "Err BD"
            })
            console.log(er); 
        } else if (result.length > 0) {
            resp.json(result[0]);
        } else {
            resp.json({
            msg: "No result"
            })
        }
        })
    }
)

//Endpoint para modificar la informacion del usuario 
app.put(
    "/updateUser/:id", //se manda como parametro el id para saber cual es el usuario que se va a modificar 
    Archivo.single("image"), 
    (req, resp) => {
        const id = req.params.id
        const {name, email, password, description} = req.body;
        
        //declaramos un query para mantener un mejor control de los campos y solo actualizar en los que haya cambios
        let sqlQuery = "UPDATE usuario SET Nombre = ?, Correo = ?, descripcion = ?"; 
        let params = [name, email, description];
        
        //Falta verificar si los campos de nombres, correo, descripcion estan vacios que no se modifiquen

        //validamos si la contraseña es nueva 
        if(password && password.trim() !== ""){
            sqlQuery+= ", Contra = ?"; 
            params.push(password); 
        }

        if(req.file){
            const image = req.file.buffer.toString("base64");  
            sqlQuery += ", Imagen = ?"; 
            params.push(image); 
        }

        sqlQuery += " WHERE id = ?"; 
        params.push(id); 

        db.query(sqlQuery, params,
            (err, result) =>{
                if(err){
                    resp.json({
                        msg: "Error BD"
                    })
                } else {
                    resp.json({
                        msg: "Usuario modificado"
                    });
                    console.log(result); 
                }
            }           
        )
    }
)

//Endpoint para verificar la contraseña y autorizar su edicion 
app.post("/verifyPassword", 
    (req, resp)=>{
    const { userId, passwordToCheck } = req.body; 
    db.query("SELECT Contra FROM usuario WHERE id = ?", 
    [userId], 
    (er, result) =>{
        if(er){
            resp.json({
                msg: "Err BD" 
            })
            console.log(er); 
        } else if (result.length > 0){
            const contraReal = result[0].Contra;
            
            if(passwordToCheck === contraReal) {
                resp.json({
                    valid: true, 
                    msg: "Contraseña correcta"
                })
            } else{
                resp.json({
                    valid: false,
                    msg: "Contraseña incorrecta"
                })
            }
        } else {
            resp.json({
            msg: "No result"
            })
        }
    }
    )

}); 

//Endpoint para registrar obras 
app.post(
    "/registerPublicacion/:id", //se envia como parametro el id del usuario que inicio sesion
    upload.single("imagePost"),
    (req, resp) => {
        const {titlePost} = req.body;

        if(!req.file) return resp.json({msg: "Error: No hay imagen"});
        const id = req.params.id; 
        const imageURL = `http://localhost:3001/uploads/${req.file.filename}`;

        db.query(
            "INSERT INTO publicacion(id_usuario, titulo, fechaPublicacion, imagen) VALUES(?,?,NOW(),?)", 
            [id, titlePost, imageURL], 
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
);

//Endpoint para obtener unicamente la imagen de las publicaciones del usuario 
app.get(
    "/getImagenPublicaciones/:id", //Para previsualizar la publicacion en el perfil del usuario por medio de su id
    (req, resp) => {
        db.query("SELECT id_usuario, imagen FROM publicacion WHERE id_usuario = ?", 
            req.params.id, 
            (er, result) => {
                if(er){
                    resp.json({
                        msg: "Err BD"
                    })
                } else if (result.length > 0){
                    resp.json(result);
                } else {
                    resp.json({
                        msg: "No result"
                    })
                }
            }
        )
    }
);


