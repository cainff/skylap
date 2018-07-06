const express = require('express'),
    fs = require('fs'),
    Papa = require('papaparse'),
    router = express.Router();

const user = {
    mail: 'toto@gmail.com',
    password: 'totolola42'
}

/* GET users listing. */
router.get('/login', function (req, res, next) {
    res.render('connexion')
});

router.post('/login', (req, res, next) => {
    if (user.mail === req.body.mail && user.password === req.body.password)
        res.redirect('/admin/dashboard')
    else
        res.redirect('/admin/login')
})

router.get('/dashboard', (req, res, next) => {
    const file = fs.createReadStream('public/csv/data.csv')
    Papa.parse(file, {
        header: true,
        download: true,
        dynamicTyping: true,
        complete: (results) => {
            res.render('admin', {
                data: results.data
            })
        }
    })
})

router.get('/dashboard/compagny/:iata', (req, res, next) => {
    let iata = req.params.iata
    const file = fs.createReadStream('public/csv/data.csv')
    Papa.parse(file, {
        header: true,
        download: true,
        dynamicTyping: true,
        complete: (results) => {
            for (let comp of results.data) {
                if (comp.IATA == iata) {
                    res.render('add', {
                        data: comp
                    })
                }
            }
        }
    })
})

router.post('/dashboard/compagny/:iata', (req, res, next) => {
    let iata = req.params.iata
    const file = fs.createReadStream('public/csv/data.csv')
    Papa.parse(file, {
        header: true,
        download: true,
        dynamicTyping: true,
        complete: (results) => {
            for (let comp of results.data) {
                //todo: remplacer tout les champs par ceux reçu
            }
        }
    })
})

router.get('/dashboard/compagny/add', (req, res, next) => {
    res.render('add')
})

router.post('/dashboard/column', (req, res, next) => {
    const file = fs.createReadStream('public/csv/data.csv')
    Papa.parse(file, {
        header: true,
        download: true,
        dynamicTyping: true,
        complete: (results) => {
            for (let comp of results.data) {
                //todo: remplacer tout les champs par ceux reçu
                comp[req.body.value] = ''
            }
            res.redirect('/admin/dashboard')
        }
    })
})

module.exports = router;
