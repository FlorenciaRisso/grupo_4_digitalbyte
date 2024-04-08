const productService = require('../data/productService');
const cartService = require('../data/cartService');
const funcion = require('../data/funcion');
const { validationResult } = require('express-validator');

let productController = {
    index: async function (req, res) {
        try {
            let data = await productService.getAll();
            let maxMasBuscados = 10;
            let masBuscados = data.slice(0, maxMasBuscados);
            res.render('productos/index', { masBuscados: masBuscados, productos: data, funcion: funcion });
        } catch (error) {
            console.log(error);
        }
    },
    lista: async function (req, res) {
        try {
            let data = await productService.getAll();
            res.render('productos/lista', { productos: data, funcion: funcion });
        } catch {
            console.log(error);
        }
    },
    filtro: async function (req, res) {
        try {
            let data = await productService.getProductos(req);
            res.render('productos/lista', { productos: data, funcion: funcion });
        } catch {
            console.log(error);
        }
    },
    listado:
        async function (req, res) {
            try {
                let respuesta = await productService.getAll();
                res.json(respuesta);
            } catch (error) {
                console.log(error);
            }
        },
    listaPorUsuario: async function (req, res) {
        try {
            let productos;
            if (req.session.usuarioLog.rol == 'Administrador') {
                productos = await productService.getAll();
            } else {
                productos = await productService.getAllByID(req.session.usuarioLog.id);
            }
            res.render('productos/lista', { productos: productos, funcion: funcion });
        } catch (error) {
            console.log(error);
        }
    },
    listaPorCat: async function (req, res) {
        try {
            let data = await productService.getProdPorCat(req.query.cat);
            res.render('productos/categoria', { productos: data, funcion: funcion });
        } catch (error) {
            console.log(error);
        }


    },
    detalle: async (req, res) => {
        let productId = req.params.id;
        let producto = await productService.getOne(productId);
        let relacionados = await productService.getProdPorCat(producto.ID_Categoria);
        let maxRelacionados = 6;
        relacionados = relacionados.slice(0, maxRelacionados);
        if (!producto) {
            res.status(404).render('error404');
        }
        let productos = await productService.getAll();
        res.render('productos/detalle', { relacionados: relacionados, producto: producto, productos: productos, funcion: funcion });
    },
    create: async (req, res) => {
        let marcas = await productService.getMarcas();
        let categorias = await productService.getCategorias();
        res.render('productos/create', { funcion: funcion, marcas: marcas, categorias: categorias })
    },
    save: async (req, res) => {
        try {
            let error = validationResult(req);
            let marcas = await productService.getMarcas();
            let categorias = await productService.getCategorias();
            if (error.isEmpty() && req.fileValidationError === undefined) {
                await productService.save(req);
                res.redirect('/productos/listaMisProductos');
            } else {
                res.render('productos/create', { marcas: marcas, categorias: categorias, fileValidationError: req.fileValidationError, errors: error.mapped(), funcion: funcion, oldData: req.body })
            }
        } catch (error) {
            console.log(error);
        }

    },
    editProducto: async (req, res) => {
        try {
            let marcas = await productService.getMarcas();
            let categorias = await productService.getCategorias();
            let producto = await productService.getOne(req.params.id);
            let pertenece = await productService.perteneceAMisProductos(req);
            if (!producto) {
                res.status(404).render('error404');
            }
            if (pertenece || req.session.usuarioLog.rol == 'Administrador') {
                res.render('productos/edit', { categorias: categorias, marcas: marcas, oldData: producto, producto: producto, funcion: funcion })
            } else if (producto) {
                res.status(403).render('error403');
            }
        } catch (error) {
            console.log(error);
        }

    },
    update: async (req, res) => {
        try {
            let error = validationResult(req);
            let producto = req.body;
            let marcas = await productService.getMarcas();
            let categorias = await productService.getCategorias();
            producto.ID_Categoria = req.body.category;
            producto.Marca = req.body.marca;
            let productoAnterior = await productService.getOne(req.params.id);
            if (error.isEmpty() && req.fileValidationError === undefined) {
                await productService.update(req);
                res.redirect('/productos/listaMisProductos');
            } else {
                res.render('productos/edit', { marcas: marcas, categorias: categorias, fileValidationError: req.fileValidationError, errors: error.mapped(), funcion: funcion, oldData: producto, producto: productoAnterior })
            }
        }
        catch (error) {
            console.log(error)
        };
    },
    delete: async function (req, res) {
        try {
            let resultado = await productService.delete(req);
            if (resultado.status == 'success') {
                res.redirect('/productos/listaMisProductos');
            } else {
                res.redirect('/productos/listaMisProductos');
            }
        } catch (error) {
            console.log(error);
        }
    },

    search: async (req, res) => {
        try {
            const search = req.body.busqueda;
            const results = await productService.getBySearch(search)
            res.render('productos/resultados', { productos: results, funcion: funcion }); // Renderiza una vista con los resultados
        } catch (error) {
            console.error('Error searching products:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

}

module.exports = productController;