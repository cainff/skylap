const express = require('express'),
    fs = require('fs'),
    Papa = require('papaparse'),
    router = express.Router();

const bagage = [],
    services = [],
    présentation = []

/* GET home page. */
router.get('/:compagny', function (req, res, next) {
    const file = fs.createReadStream('public/csv/data.csv')
    let compagny = req.params.compagny
    Papa.parse(file, {
        header: true,
        download: true,
        dynamicTyping: true,
        complete: (results) => {
            for (let comp of results.data) {

                if (comp['nom de la compagnie'] == compagny) {
                    console.log(comp)
                    //todo: get dynamique un text par section
                    res.render('index', {
                        iata: comp.IATA
                    })
                }
            }
        }
    })
});
module.exports = router;
