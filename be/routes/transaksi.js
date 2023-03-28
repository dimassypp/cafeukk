const express = require("express")
const app = express()
const moment = require("moment")
const transaksi = require("../models/index").transaksi
const detail_transaksi = require("../models/index").detail_transaksi
const { Op } = require('sequelize')
const jwt = require("jsonwebtoken")
const SECRET_KEY = "ilovegdl"
const authManager = require("../authManager")
const authKasir = require("../authKasir")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get("/detail", authManager, async (req, res) => {
    detail_transaksi.findAll({
        include: ["transaksi", "menu"]
    })
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

app.get("/detail/:id", authManager, async (req, res) => {
    detail_transaksi.findAll({
        include: ["transaksi", "menu"]

    })
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

// app.get('/detail/:id_transaksi', (req,res) => {
//     let indicator = {id_transaksi: req.params.id_transaksi}
//     transaksi.findAll({
//         where: indicator,
//         order: [
//             ["tgl_transaksi", "DESC"]
//         ],
//     })
//         .then(result => {
//             res.json(result) 
//         })
//         .catch(error => {
//             res.json({
//                 message: error.message
//             })
//         })
// })

app.get("/", authManager, async (req, res) => {
    transaksi.findAll({
        include: ["user", "meja"]
    })
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

app.get("/:id", authManager, async (req, res) => {
    transaksi.findAll({
        include: ["user", "meja"]
    })
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

// filtering data transaksi berdasarkan nama user
app.get('/user/:id_user', authManager, async (req,res) => {
    let indicator = {id_user: req.params.id_user}
    transaksi.findAll({
        where: indicator,
        order: [
            ["tgl_transaksi", "DESC"]
        ],
    })
        .then(result => {
            res.json(result) 
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

app.post("/filter", authManager, async (req, res) => {
    let tgl_transaksi_awal = req.body.tgl_transaksi_awal
    let tgl_transaksi_akhir = req.body.tgl_transaksi_akhir
    let result = await transaksi.findAll({
        where: {
            tgl_transaksi: {
                [Op.between]: [tgl_transaksi_awal, tgl_transaksi_akhir]
            }
        },
        order: [
            ["tgl_transaksi", "DESC"]
        ],
    });
    return res.status(200).json({
        data: result
    })
        // .then(data => {
        //     res.json({})
        // })
        // .catch(error => {
        //     res.json({
        //         message: error.message
        //     })
        // })
})

app.post("/", authKasir, async (req, res) => {
    let data_transaksi = {
        tgl_transaksi: moment().format("YYYY-MM-DD"),
        id_user: req.body.id_user,
        id_meja: req.body.id_meja,
        nama_pelanggan: req.body.nama_pelanggan,
        status: req.body.status,
        jenis: req.body.jenis,
        total: req.body.total
    }
    transaksi.create(data_transaksi)
        .then(result => {
            let lastID = result.id_transaksi
            let detail = req.body.detail_transaksi
            detail.forEach(element => {
                element.id_transaksi = lastID
            });
            detail_transaksi.bulkCreate(detail)
            res.json({
                message: "Data has been added",
                data: result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

app.put("/", authKasir, async (req, res) => {
    let param = {
        id_transaksi: req.body.id_transaksi
    }
    let data = {
        status: req.body.status
    }
    transaksi.update(data, { where: param })
        .then(result => {
            res.json({
                message: "Data has been updated"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

app.delete("/:id", authKasir, async (req, res) => {
    let param = {
        id_transaksi: req.params.id
    }
    try {
        await detail_transaksi.destroy({where: param})
        await transaksi.destroy({where: param})
        res.json({
            message : "data has been deleted"
        })
    } catch (error) {
        res.json({
            message: error
        })
    }

})
module.exports = app