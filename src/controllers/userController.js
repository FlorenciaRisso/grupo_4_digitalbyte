const path = require('path');
const fs = require('fs');
const userService = require('../data/userService');

let userController = {

    lista: (req, res) => {
        let usuarios = userService.users;
        res.render('usuarios/lista', { usuarios: usuarios })
    },

    profile: (req, res) => {
        console.log('Usuario en sesión:', req.session.usuarioLogueado);
        res.render('usuarios/profile', { usuario: req.session.usuarioLogueado })
    },

    edit: (req, res) => {
        let userId = req.params.id;
        let usuario = userService.getOne(userId);
        res.render('usuarios/editar', { usuario: usuario });
    },

    registro: (req, res) => {
        res.render('usuarios/registro');
    },

    processRegister: (req, res) => {
        let resultado = userService.save(req);
        if (resultado.success == true) {
            res.redirect('/usuarios/login')
        } else if (resultado.errors) {
            res.render('usuarios/registro', {
                errors: resultado.errors.mapped()
            })
        } else {
            res.render('usuarios/registro', {
                errors: resultado.errors.email
            })
        }
    },


    login: (req, res) => {
        console.log(req.session)
        res.render('usuarios/login');
    },

    processLogin: (req, res) => {
        let usuarioValido = userService.validarUsuario(req);
        let errors = [];

        if (usuarioValido) {
            res.redirect('/usuarios');
        } else {
            errors.errors.push({
                type: 'field', value: req.body,
                msg: 'Usuario incorrecto',
                path: 'email', location: 'body'
            })
        }
        res.render('usuarios/login', {errors:errors.errors.mapped()});



        return res.render('login', { //MUESTRA ERROR EMAIL INEXISTENTE
            errors: {
                email: {
                    msg: "Email inexistente"
                }
            }
        });
    },

    logout: (req, res) => {
        req.session.logout();
    }



}

module.exports = userController;