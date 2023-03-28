const express = require("express")
const app = express()
const meja = require("../models/index").meja
const jwt = require("jsonwebtoken")
const SECRET_KEY = "ilovegdl"
const authAdmin = require("../authAdmin")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get("/", authAdmin, async (req, res) => {
    meja.findAll()
        .then(result => {
            res.json({
                data: result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

app.get("/:id", authAdmin, async (req, res) => {
    let param = {
        id_meja: req.params.id
    }
    meja.findOne({ where: param })
        .then(result => {
            res.json({
                data: result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

app.post("/", authAdmin, async (req, res) => {
    let data = {
        nomor_meja: req.body.nomor_meja,
        status: req.body.status
    }
    meja.create(data)
        .then(result => {
            res.json({
                message: "data has been added",
                data: result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})
app.put("/",authAdmin, async (req, res) => {
    let param = {
        id_meja: req.body.id_meja
    }
    let data = {
        nomor_meja: req.body.nomor_meja,
        status: req.body.status
    }
    meja.update(data, { where: param })
        .then(result => {
            res.json({
                message: "data has been updated"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

app.delete("/:id", authAdmin, async (req, res) => {
    let param = {
        id_meja: req.params.id
    }
    meja.destroy({ where: param })
        .then(result => {
            res.json({
                message: "data has been deleted"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})
module.exports = app