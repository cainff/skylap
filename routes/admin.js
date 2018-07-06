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
    res.render('login')
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
            res.render('dashboard', {
                data: results.data
            })
        }
    })
})

router.get('/dashboard/compagny/:iata', (req, res, next) => {
    let iata = req.params.iata
    
    console.log(iata)
})

module.exports = router;
