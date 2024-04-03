const express = require('express');
const router = express.Router();
const uploadFile=require('../data/multerMulti');
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/usuarios/authMiddleware');
const esAdmin = require('../middlewares/usuarios/esAdmin');
const esCliente = require('../middlewares/usuarios/esCliente');
const esVendedor = require('../middlewares/usuarios/esVendedor');
const esVendedorOAdmin = require('../middlewares/esVendedorOAdmin');
const createProductoValidation = require('../middlewares/productos/createProductoValidation');
const editProductoValidation = require('../middlewares/productos/editProductoValidation');


router.get('/', productController.index);
router.post('/search', productController.search);
router.get('/carrito',authMiddleware,esCliente, productController.carrito);//solo cliente
router.get('/lista',authMiddleware, esAdmin, productController.lista);//solo admin
router.get('/filtro',authMiddleware, esVendedorOAdmin, productController.filtro);
router.get('/listaMisProductos',authMiddleware, esVendedorOAdmin, productController.listaPorUsuario); //solo vendedor y admin
//listar
router.get('/listaproductos',authMiddleware,esVendedor, productController.listado);
router.get('/categoria',productController.listaPorCat);
//crear
router.get('/create',authMiddleware,esVendedorOAdmin, productController.create);
router.post('/create',authMiddleware,esVendedorOAdmin, uploadFile,createProductoValidation,productController.save);
//detalles
router.get('/detalle/:id', productController.detalle);
//editar
router.get('/editar/:id',authMiddleware,esVendedorOAdmin, productController.editProducto);
router.put('/editar/:id',authMiddleware,esVendedorOAdmin,uploadFile,editProductoValidation, productController.update);

//eliminar
router.put('/delete/:id',authMiddleware,esVendedorOAdmin,productController.delete);


module.exports = router;