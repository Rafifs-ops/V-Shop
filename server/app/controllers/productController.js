const Product = require('../models/Product')

exports.findAll = (req, res) => {
    Product.find()
        .then((result) => {
            res.send(result)
        }).catch((err) => {
            res.status(500).send({
                message: err.message || "Some error while retrieving products."
            })
        })
}

exports.findOne = (req, res) => {
    Product.findOne({
        _id: req.params.id
    }).then((result) => { res.send(result) }).catch((err) => { res.status(500).send({ message: err.message || "Some error while retrieving product."}) })
}