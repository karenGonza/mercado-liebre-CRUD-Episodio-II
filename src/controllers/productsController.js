const { get } = require('express/lib/response');
const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
const writeJson = database => fs.writeFileSync(productsFilePath, JSON.stringify(database), "utf-8");


const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		// Do the magic
		res.render("products", {
			products,
			toThousand
		})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		let productId = +req.params.id;//Capturo la info de la ruta y la transformo en numero con el +
		let product = products.find(product => product.id === productId)//busco el id del producto que coincida con el que se ingresó en la ruta
		res.render("detail", {
			product,
			toThousand
		})
	},

	// Create - Form to create
	create: (req, res) => {
		// Do the magic
		res.render("product-create-form")
	},
	
	// Create -  Method to store
	store: (req, res) => {
		// Do the magic
		const {name, price, discount, category, description} = req.body;
		
		let lastId = 1;

		products.forEach(product => {
			if(product.id > lastId){
				lastId = product.id
			}
		});
		let newProduct = {
			id: lastId + 1,
			name,
			price: +price,
			discount: +discount,
			category,
			description,
			image: req.file ? req.file.filename : "default-image.png"
		}
		/* let newProduct = {
			...req.body,
			id: lastId + 1,
			price: +price,
			discount: +discount,
			image: "img-aire-acondicionado.jpg"
		} */

		products.push(newProduct)

		writeJson(products)

		res.redirect("/products")
	},

	// Update - Form to edit
	edit: (req, res) => {
		let productId = +req.params.id;
		let productToEdit = products.find(product => product.id === productId)

		res.render("product-edit-form",{
			product: productToEdit
		})

	},
	// Update - Method to update
	update: (req, res) => {
		let productId = +req.params.id;
		const {name, price, discount, category, description, image} = req.body;

		products.forEach(product => {
			if(product.id === productId){
				product.id === product.id,
				product.name = name,
				product.price = +price,
				product.discount = discount,
				product.description = description
				if(req.file){
					if(fs.existsSync("./public/images/products/", product.image)){
						fs.unlinkSync(`./public/images/products/${product.image}`)
					}else{
						console.log("no encontré la foto")
					}
					product.image = req.file.filename
				}else{
					product.image = product.image
				}
			}
		})
		writeJson(products)

		res.redirect(`/products/detail/${productId}`)
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		let productId = +req.params.id;

		products.forEach(product => {
			if(product.id === productId){
				if(fs.existsSync("./public/images/products/", product.image)){
					fs.unlinkSync(`./public/images/products/${product.image}`)
				}else{
					console.log("no encontré la foto")
				}



				let productToDestroyIndex = products.indexOf(product)//el indexOf devuelve la posición del objeto
				if (productToDestroyIndex !== -1){
					products.splice(productToDestroyIndex, 1)
				}else{
					console.log("no encontré el producto");}
				//El splice recibe 2 parametros el primero el indice desde donde queremos que comience a borrar y el segundo
				//parametro le indica cuantos elementos desde el indice queremos que borre.
			}
		})
		writeJson(products)

		res.redirect("/products")
	}
};

module.exports = controller;