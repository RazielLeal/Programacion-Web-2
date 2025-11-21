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
        password: "",
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

//Endpoint para obtener la info del usuario por medio del id 
app.get("/user/:id", 
    (req, resp) => {
        const sql = `
        SELECT 
            u.Nombre, 
            u.Correo, 
            u.Imagen, 
            u.descripcion,
            /* Subconsulta para contar SEGUIDORES (Gente que me admira a mí) */
            (SELECT COUNT(*) 
            FROM admirador 
            WHERE id_admirado = u.id) AS totalSeguidores,

            (
             SELECT COUNT(*)
             FROM publicacion p
             INNER JOIN like_publicacion lp
                ON lp.id_publicacion = p.id_publicacion
             WHERE p.id_usuario = u.id
            ) AS totalLikes

        FROM usuario u 
        WHERE u.id = ?
        `;

        db.query(sql, 
        [req.params.id],
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
        });
    }
);

//Endpoint para modificar la informacion del usuario 
app.put(
    "/updateUser/:id", //se manda como parametro el id para saber cual es el usuario que se va a modificar 
    Archivo.single("image"), 
    (req, resp) => {
        const id = req.params.id
        const {name, email, password, description} = req.body;

        const updates = [];
        const params = [];

        if (typeof description !== "undefined") {
            updates.push("descripcion = ?");
            params.push(description);
        }
        
        //Falta verificar si los campos de nombres, correo, descripcion estan vacios que no se modifiquen
        if(name && name.trim() !== ""){
            updates.push("Nombre = ?");
            params.push(name.trim());
        }

        if(email && email.trim() !== ""){
            updates.push("Correo = ?");
            params.push(email.trim());
        }

        //validamos si la contraseña es nueva 
        if(password && password.trim() !== ""){
            updates.push("Contra = ?");
            params.push(password.trim()); 
        }

        if(req.file){
            const image = req.file.buffer.toString("base64");  
            updates.push("Imagen = ?");
            params.push(image); 
        }

        // Si no hay nada que actualizar:
        if (updates.length === 0) {
            return resp.json({
                msg: "Sin cambios",
            });
        }

        const sqlQuery = `UPDATE usuario SET ${updates.join(", ")} WHERE id = ?`;
        params.push(id);

        console.log("SQL UPDATE:", sqlQuery);
        console.log("Params:", params);

        db.query(sqlQuery, params,
            (err, result) =>{
                if(err){
                    console.log("ERROR BD UPDATE USER ===>");
                    console.log(err);
                    return resp.json({
                        msg: "Error BD",
                        error: err.sqlMessage
                    });
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
        if (!titlePost || titlePost.trim() === "") {
            return resp.json({ msg: "Error: Falta título" });
        }
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

//Endpoint para obtener unicamente la imagen de las publicaciones propias del usuario
app.get(
    "/getImagenPublicaciones/:id", //Para previsualizar la publicacion en el perfil del usuario por medio de su id
    (req, resp) => {
        db.query("SELECT id_publicacion, imagen FROM publicacion WHERE id_usuario = ?", 
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

//Endpoint para obtener los detalles de las publicaciones propias del usuario
app.get("/getPublicaciones/:id", (req, resp) => {
    const idPublicacion = req.params.id; 

    const sqlDetalle = `
        SELECT
            p.id_publicacion,
            p.titulo, 
            p.fechaPublicacion,
            p.imagen AS imagenPost, 
            u.Nombre AS nombreUsuario, 
            u.Imagen AS imagenUsuario
        FROM publicacion p 
        INNER JOIN usuario u ON p.id_usuario = u.id
        WHERE p.id_publicacion = ?
    `;

    db.query(sqlDetalle, [idPublicacion], (err, result) => {
        if (err) {
            console.log(err);
            return resp.json({ msg: "Err BD" });
        }

        if (result.length === 0) {
            return resp.json({ msg: "No se encontraron los datos" });
        }

        const detalle = result[0];

        const sqlLikes = "SELECT COUNT(*) AS total FROM like_publicacion WHERE id_publicacion = ?";
        const sqlComments = `
            SELECT 
                c.id_comentario,
                c.texto,
                c.fechaComentario,
                u.Nombre AS nombreUsuario
            FROM comentario_publicacion c
            INNER JOIN usuario u ON c.id_usuario = u.id
            WHERE c.id_publicacion = ?
            ORDER BY c.fechaComentario ASC
        `;

        db.query(sqlLikes, [idPublicacion], (errL, rowsLikes) => {
            if (errL) {
                console.log(errL);
                return resp.json({ msg: "Err BD likes" });
            }

            db.query(sqlComments, [idPublicacion], (errC, rowsComments) => {
                if (errC) {
                    console.log(errC);
                    return resp.json({ msg: "Err BD comments" });
                }

                resp.json({
                    ...detalle,
                    likesCount: rowsLikes[0].total,
                    comments: rowsComments
                });
            });
        });
    });
});

//Endpoint para obtener todas las publicaciones con todos los usuarios que las hicieron, el feed o la galeria basicamente 
app.get("/feed", (req, resp) =>{
    const sqlQuery = `
        SELECT 
            p.id_publicacion, 
            p.titulo, 
            p.fechaPublicacion,
            p.imagen AS imagenPost,
            u.id as idUsuario,  
            u.Nombre AS nombreUsuario,  
            u.Imagen AS imagenUsuario
        FROM publicacion p 
        INNER JOIN usuario u ON p.id_usuario = u.id
        ORDER BY p.fechaPublicacion DESC 
    `; 

    db.query(sqlQuery, (err, result)=>{
        if(err){
            resp.json({
                msg: "Err BD"
            })
        } else {
            resp.json(result); 
        }
    })

});

//Endpoint para admirar a artistas y dejar de admirarlos 
app.post("/admirar", (req, resp)=>{
    const {idSeguidor, idAdmirado} = req.body; 

    const checkQuery = "SELECT* FROM admirador WHERE id_seguidor = ? AND id_admirado = ?"; 
    db.query(checkQuery, [idSeguidor, idAdmirado], (err, result)=>{
        if(err) {
            return resp.json({
                msg: "Err BD"
            });
        }
        
        if(result.length > 0){ //Si arroja un resultado es porque ya lo admira y se debe borrar para dejarlo de admirar
            const deleteSql = "DELETE FROM admirador WHERE id_seguidor = ? AND id_admirado = ?";
            db.query(deleteSql, [idSeguidor, idAdmirado], (error) =>{
                if(error) {
                    return resp.json({
                        msg: "Error al dejar de seguir"
                    })
                }
                resp.json({
                    siguiendo: false,
                    msg: "Dejaste de admirar"
                });
            });
        } else { //de lo contrario se inserta en la tabla
            const insertSql = "INSERT INTO admirador (id_seguidor, id_admirado) VALUES (?, ?)";
            db.query(insertSql, [idSeguidor, idAdmirado], (err)=>{
                if(err){
                    resp.json({
                        msg: "Error al seguir"
                    });
                }
                resp.json({
                    siguiendo: true, 
                    msg: "Ahora eres admirador"
                }); 
            });
        }
    })

});

// Endpoint para saber el estado inicial, basicamente saber si ya lo sigo o no 
app.post("/checkAdmiracion", (req, res) => {
    const { idSeguidor, idAdmirado } = req.body;
    const sql = "SELECT * FROM admirador WHERE id_seguidor = ? AND id_admirado = ?";
    
    db.query(sql, [idSeguidor, idAdmirado], (err, result) => {
        if (err) return res.json({ isAdmirer: false });
        // Si el array tiene algo, es true. Si está vacío, es false.
        res.json({ isAdmirer: result.length > 0 }); 
    });
});

//Endpoint para los likes/deslikes de las obras
app.post("/likePublicacion", (req, resp) => {
    const { idUsuario, idPublicacion } = req.body;

    const checkSql = "SELECT * FROM like_publicacion WHERE id_usuario = ? AND id_publicacion = ?";
    db.query(checkSql, [idUsuario, idPublicacion], (err, result) => {
        if (err) {
            console.log(err);
            return resp.json({ msg: "Err BD" });
        }

        if (result.length > 0) {
            // ya tenía like → borrar
            const deleteSql = "DELETE FROM like_publicacion WHERE id_usuario = ? AND id_publicacion = ?";
            db.query(deleteSql, [idUsuario, idPublicacion], (err2) => {
                if (err2) {
                    console.log(err2);
                    return resp.json({ msg: "Error al quitar like" });
                }

                // regresar nuevo total
                const countSql = "SELECT COUNT(*) AS total FROM like_publicacion WHERE id_publicacion = ?";
                db.query(countSql, [idPublicacion], (err3, rows) => {
                    if (err3) return resp.json({ liked: false, likesCount: 0 });
                    resp.json({
                        liked: false,
                        likesCount: rows[0].total
                    });
                });
            });
        } else {
            // no tenía like → insertar
            const insertSql = "INSERT INTO like_publicacion (id_usuario, id_publicacion) VALUES (?, ?)";
            db.query(insertSql, [idUsuario, idPublicacion], (err2) => {
                if (err2) {
                    console.log(err2);
                    return resp.json({ msg: "Error al dar like" });
                }

                const countSql = "SELECT COUNT(*) AS total FROM like_publicacion WHERE id_publicacion = ?";
                db.query(countSql, [idPublicacion], (err3, rows) => {
                    if (err3) return resp.json({ liked: true, likesCount: 1 });
                    resp.json({
                        liked: true,
                        likesCount: rows[0].total
                    });
                });
            });
        }
    });
});

//Endpoint para comentar en las publicaciones
app.post("/comentarPublicacion", (req, resp) => {
    const { idUsuario, idPublicacion, texto } = req.body;

    if (!texto || texto.trim() === "") {
        return resp.json({ msg: "Comentario vacío" });
    }

    const insertSql = `
        INSERT INTO comentario_publicacion (id_usuario, id_publicacion, texto)
        VALUES (?, ?, ?)
    `;
    db.query(insertSql, [idUsuario, idPublicacion, texto], (err, result) => {
        if (err) {
            console.log(err);
            return resp.json({ msg: "Err BD" });
        }

        const selectSql = `
            SELECT c.id_comentario, c.texto, c.fechaComentario, u.Nombre AS nombreUsuario
            FROM comentario_publicacion c
            INNER JOIN usuario u ON c.id_usuario = u.id
            WHERE c.id_comentario = ?
        `;
        db.query(selectSql, [result.insertId], (err2, rows) => {
            if (err2 || rows.length === 0) {
                return resp.json({ msg: "Comentario guardado pero no se pudo recuperar" });
            }
            resp.json({
                msg: "Comentario guardado",
                comentario: rows[0]
            });
        });
    });
});

//Endpoint guardar/desguardar obra
app.post("/guardarPublicacion", (req, resp) => {
    const { idUsuario, idPublicacion } = req.body;

    const checkSql = "SELECT * FROM guardado_publicacion WHERE id_usuario = ? AND id_publicacion = ?";
    db.query(checkSql, [idUsuario, idPublicacion], (err, result) => {
        if (err) {
            console.log(err);
            return resp.json({ msg: "Err BD" });
        }

        if (result.length > 0) {
            const deleteSql = "DELETE FROM guardado_publicacion WHERE id_usuario = ? AND id_publicacion = ?";
            db.query(deleteSql, [idUsuario, idPublicacion], (err2) => {
                if (err2) {
                    console.log(err2);
                    return resp.json({ msg: "Error al quitar de guardados" });
                }
                resp.json({ saved: false, msg: "Obra quitada de guardados" });
            });
        } else {
            const insertSql = "INSERT INTO guardado_publicacion (id_usuario, id_publicacion) VALUES (?, ?)";
            db.query(insertSql, [idUsuario, idPublicacion], (err2) => {
                if (err2) {
                    console.log(err2);
                    return resp.json({ msg: "Error al guardar obra" });
                }
                resp.json({ saved: true, msg: "Obra guardada" });
            });
        }
    });
});

//Endpoint ver obras guardadas
app.get("/guardados/:idUsuario", (req, resp) => {
    const { idUsuario } = req.params;

    const sql = `
        SELECT 
            g.id_guardado,
            p.id_publicacion,
            p.titulo,
            p.imagen AS imagenPost,
            u.Nombre AS nombreAutor
        FROM guardado_publicacion g
        INNER JOIN publicacion p ON g.id_publicacion = p.id_publicacion
        INNER JOIN usuario u ON p.id_usuario = u.id
        WHERE g.id_usuario = ?
        ORDER BY g.fechaGuardado DESC
    `;

    db.query(sql, [idUsuario], (err, result) => {
        if (err) {
            console.log(err);
            return resp.json({ msg: "Err BD" });
        }
        resp.json(result);
    });
});

//Endpoint para busqueda
app.get("/search", (req, resp) => {
    const { q, filter } = req.query;

    const searchText = q ? q.trim() : "";

    if (!searchText) {
        return resp.json({
            artists: [],
            obras: []
        });
    }

    const likeParam = `%${searchText}%`;

    const sqlArtists = `
      SELECT 
        u.id,
        u.Nombre AS nombre,
        u.Imagen AS imagen,
        u.descripcion
      FROM usuario u
      WHERE u.Nombre LIKE ? OR u.Correo LIKE ?
      ORDER BY u.Nombre ASC
    `;
    const sqlObras = `
      SELECT 
        p.id_publicacion,
        p.titulo,
        p.imagen AS imagenPost,
        u.id AS idUsuario,
        u.Nombre AS nombreUsuario,
        u.Imagen AS imagenUsuario
      FROM publicacion p
      INNER JOIN usuario u ON p.id_usuario = u.id
      WHERE p.titulo LIKE ?
      ORDER BY p.fechaPublicacion DESC
    `;

    //flags de los filtros
    const searchArtists = !filter || filter === "all" || filter === "artistas";
    const searchObras   = !filter || filter === "all" || filter === "obras";

    const results = {
        artists: [],
        obras: []
    };

    //Promesas para las busquedas
    const promises = [];

    if (searchArtists) {
      promises.push(new Promise((resolve) => {
        db.query(sqlArtists, [likeParam, likeParam], (err, rows) => {
          if (err) {
            console.log("Error buscando artistas:", err);
            return resolve();
          }
          results.artists = rows;
          resolve();
        });
      }));
    }

    if (searchObras) {
      promises.push(new Promise((resolve) => {
        db.query(sqlObras, [likeParam], (err, rows) => {
          if (err) {
            console.log("Error buscando obras:", err);
            return resolve();
          }
          results.obras = rows;
          resolve();
        });
      }));
    }

    Promise.all(promises).then(() => {
      resp.json(results);
    });
});


