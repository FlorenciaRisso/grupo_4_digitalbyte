const userService = require('../data/userService');
const bcrypt = require('bcrypt');
const { Usuarios } = require('../model/database/models');
const { validationResult } = require('express-validator');


let userController = {

    lista: async function (req, res) {
        try {
            const usuarios = await userService.getAll();
            res.render('usuarios/lista', { usuarios: usuarios });
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            res.status(500).send('Error al obtener usuarios');
        }
    },

    profile: (req, res) => {
        let userId = req.params.id;
        userService.getOne(userId).
            then(data => res.render('usuarios/userProfile', {
                usuario: data
            })).
            catch(error => res.status(404).send('Usuario no encontrado'))
    },

    userProfile: (req, res) => {
        userService.getOne(req.session.usuarioLogeado.id).

            then(data => {
                res.render('usuarios/userProfile', {
                    usuario: data
                })
            })
            .catch(e => console.log(e))
    },

    edit: (req, res) => {
        let userId = parseInt(req.params.id, 10);
        userService.getOne(userId).
            then(data =>
                res.render('usuarios/edit', { usuario: data, oldData: data })
            )
    },

    update: async (req, res) => {
        let error = validationResult(req)
        let usuarioId=parseInt(req.body.id, 1);
        let usuarioActualizado = await userService.update(req);
        let data={};
        data.id=req.body.id;
        data.nombre=req.body.firstName;
        data.apellido=req.body.lastName;
        data.email=req.body.email;
        data.rol=req.body.rol;
        data.nacionalidad=req.body.country;
        data.avatar=req.body.avatar;
        if (req.session.usuarioLogeado.id == req.params.id && usuarioActualizado>0 && error.isEmpty()) {
            delete req.session['usuarioLogeado'];
            let usuarioActualizado= await userService.getOne(req.params.id)
            req.session.usuarioLogeado = usuarioActualizado;
            res.redirect('/usuarios/lista');

        } else if (usuarioActualizado>0 && error.isEmpty()) {
            res.redirect('/usuarios/lista');
        } else {
            res.render('usuarios/edit', { oldData: data, errors: error.mapped() })
        }

    },


    cambiarContraseña: (req, res) => {
        res.render('usuarios/cambiarContraseña', {
            usuarioId: req.params.id
        })
    },

    updateContraseña: (req, res) => {
        userService.validarContraseña(req).
            then(resultado => {
                console.log(resultado);
                if (resultado.success) {
                    res.redirect('/usuarios/userProfile')
                } else if (resultado.errors) {
                    res.render('usuarios/cambiarContraseña', {
                        errors: resultado.errors, usuarioId: req.params.id
                    })
                }
            }).
            catch(error => console.log(error))
    },

    registro: (req, res) => {
        res.render('usuarios/registro');
    },



    processRegister: (req, res) => {
        let old = req.body;
        userService.save(req).then(async resultado => {
            if (resultado.success) {
                // Iniciar sesión automáticamente después del registro
                try {
                    // Obtener el usuario recién registrado
                    const usuarioRegistrado = await userService.findByField('email', req.body.email);

                    // Almacenar el usuario en la sesión
                    req.session.usuarioLogeado = usuarioRegistrado;

                    // Redirigir al usuario a la página principal o a donde desees
                    res.redirect('/');
                } catch (error) {
                    console.error('Error al iniciar sesión automáticamente después del registro:', error);
                    res.status(500).send('Error al iniciar sesión automáticamente después del registro');
                }
            } else if (resultado.errors) {
                res.render('usuarios/registro', {
                    errors: resultado.errors, oldData: old
                })
            }
        }).catch(error => {
            console.log(error);
        });
    },

    delete: (req, res) => {
        const userId = req.params.id;
        userService.delete(userId).then(resultado => {
            if (req.session.usuarioLogeado.id == userId) {
                res.redirect('/usuarios/cerrarSesion')
            } else {
                res.redirect('/usuarios/lista')
            }
        }).catch(error => console.log(error));

    },
    deleteCuenta: (req, res) => {
        const userId = req.params.id;
        userService.delete(userId).then(resultado => {
            if (req.session.usuarioLogeado.id == userId) {
                res.redirect('/usuarios/cerrarSesion')
            } else {
                res.redirect('/usuarios/lista')
            }
        }).catch(error => console.log(error));

    },

    login: (req, res) => {
        res.render('usuarios/login', { cookie: req.cookies.recordarEmail || '' });
    },

    processLogin: async (req, res) => {
        try {
            let errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.render('usuarios/login', {
                    cookie: req.cookies.recordarEmail || '',
                    errors: errors.mapped()
                })
            }
            let usuarioValido = await userService.findByField('email', req.body.email);

            if (usuarioValido) {
                let correctContraseña = bcrypt.compareSync(req.body.contraseña, usuarioValido.contraseña);

                if (correctContraseña) {
                    req.session.usuarioLogeado = usuarioValido;
                    if (req.body.recordame == 'on') {
                        res.cookie('recordame', usuarioValido.email, { maxAge: 604800000 });
                        res.cookie('recordarEmail', usuarioValido.email, { maxAge: 604800000 });
                        console.log('Cookie "recordame" establecida');
                    }
                    return res.redirect('/');
                } else {
                    return res.render('usuarios/login', {
                        cookie: req.cookies.recordarEmail || '',
                        errors: {
                            email: {
                                msg: 'Credenciales inválidas'
                            }
                        }
                    }
                    )
                }
            }

        } catch (error) {
            console.error('Error al procesar el inicio de sesión:', error);
            return res.status(500).send('Error al procesar el inicio de sesión');
        }
    },

    logout: (req, res) => {
        res.clearCookie('recordame')
        req.session.destroy();
        return res.redirect('/usuarios/login')
    },
}


module.exports = userController;