const express = require('express'),
    fs = require('fs'),
    Papa = require('papaparse'),
    router = express.Router();

const bagage = ['Emmenez avec vous tous vos bagages avec une capacité maximale de $ en soute et jusqu\'à % avec vous. Avec un espace disponible pour vos valises de µ en soute, il est cependant nécessaire de ne pas dépasser la taille maximum de * pour la cabine',
                'La soute vous permet d\'emporter jusqu\'à $ de bagages et de garder près de vous % de bagages à main. Avec un espace de µ maximum pour vos valises en soute, et que la cabine est limitée à une taille de *',
                'Vos valises en soute sont limitées à $ pour une taille de µ. La cabine est limitée en taille * et doivent peser au maximum %.',
                'Pour éviter tout souci lors de l\'embarquement, il est important de noter que vos bagages à main ne doivent pas excéder % et ne pas dépasser *. De plus, vos valises en soute sont limitées par la taille µ, le poids $.',
                'Afin d\'éviter tout désagrément avant votre départ, il est nécessaire de garder en tête que vos valises en soute sont limitées en taille et en poids. Vous devez donc limiter vos bagages en soute à $ pour une taille maximum de µ. La cabine étant limitée en taille pour vos bagage à main (*), veuillez prendre vos dispositions. Enfin, le poids maximum des bagages à main, au dessus de votre place passager est de %.'
    ],
    services1 = ['Le Wi-Fi n\'est pas disponible à bord de l\'avion.',
    'Le Wi-Fi n\'est pas compris dans les services disponibles.',
    'Le Wi-Fi n\'est pas compris durant le vol',
    'Le Wi-fi ne vous sera pas accessibles durant le trajet.',
    'Le Wi-Fi ne sera pas disponible lors de votre trajet.']
service2 = ['Le Wi-fi qui vous sera accessible gratuitement',
    'Le service du Wi-fi vous sera accessible gratuitement à bord, lors de votre trajet.',
    'Le Wi-fi fera parti des services gratuits disponibles lors de votre trajet.',
    'Le service Wi-fi sera disponible gratuitement à bord de votre vol.',
    'Le wifi est disponible pendant toute la durée de ce vol'],
    presentation = ['Situé à -, + est la compagnie aérienne qui vous emmènera à bon port. Pour toute information complémentaire sur l\'aéroport et ses services, nous vous invitons à contacter le / ou vous rendre sur leur site Internet à cette adresse : =',
        'Vous embarquerez dans une avion de la compagnie aérienne +, dont l\'aéroport principal est situé à -. Si vous désirez obtenir des informations complémentaires, vous pouvez contacter le / ou consulter le site Internet de la compagnie ici : =',
        'Nous vous souhaitons un trajet agréable à bord d\'un appareil de la compagnie aérienne +. Localisé à -, cette compagnie est accessible pour de plus amples informations au / ou sur le site Internet =',
        'Dans le cadre d\'un trajet agréable et sans encombres, nous vous informons que vous pouvez contacter la compagnie aérienne +, située à -. Leur numéro de téléphone est le /, tandis que leur site Internet est =',
        'Disponible au / et sur le site Internet =, la compagnie aérienne +, localisé à -, vous accompagnera tout au long de ce trajet.'
    ]

/* GET home page. */
router.get('/:compagny', function (req, res, next) {
    const file = fs.createReadStream('public/csv/data.csv')
    let compagny = req.params.compagny
    Papa.parse(file, {
        header: true,
        download: true,
        dynamicTyping: true,
        complete: (results) => {
            for (let i=0; i < results.data.length; i++) {
                let comp = results.data[i]
                let a, b, c

                if (comp['nom de la compagnie'] == compagny) {
                    console.log(comp)
                    if (i < 100 || i > 499) {
                        a = bagage[0]
                        if (comp.WIFI == 'NON')
                            b = services1[1]
                        else
                            b = services2[1]
                        c = presentation[2]
                    } else if (i < 200) {
                        a = bagage[1]
                        if (comp.WIFI == 'NON')
                            b = services1[2]
                        else
                            b = services2[2]
                        c = presentation[3]
                    } else if (i < 300) {
                        a = bagage[2]
                        if (comp.WIFI == 'NON')
                            b = services1[3]
                        else
                            b = services2[3]
                        c = presentation[4]
                    } else if (i < 400) {
                        a = bagage[3]
                        if (comp.WIFI == 'NON')
                            b = services1[4]
                        else
                            b = services2[4]
                        c = presentation[0]
                    } else if (i < 500) {
                        a = bagage[4]
                        if (comp.WIFI == 'NON')
                            b = services1[0]
                        else
                            b = services2[0]
                        c = presentation[1]
                    }
                    a = a.replace(/\$/i, comp['Poids max. autoris� des bagages en soute']);
                    a = a.replace(/%/i, comp['poid cabine']);
                    a = a.replace(/µ/i, comp['taille soute']);
                    a = a.replace(/\*/i, comp['Taille du bagage � main']);
                    c = c.replace(/-/i, comp['A�roport de base']);
                    c = c.replace(/\+/i, comp['nom de la compagnie']);
                    c = c.replace(/\//i, comp['num�ro de t�l�phone']);
                    c = c.replace(/=/i, `<a href="${comp['Site Web']}">${comp['Site Web']}</a>`);
                    //todo: get dynamique un text par section
                    res.render('index', {
                        name: comp['nom de la compagnie'],
                        a,
                        b,
                        c
                    })
                }
            }
        }
    })
});

router.get('/autocomplete/search', function(req, res, next){
    var file = fs.createReadStream('./public/assets/data_companies.csv')

    Papa.parse(file, {
        header: true,
        download: true,
        dynamicTyping: true,

        complete: (results) => {
            console.log('ok');
            var data = [];
            for (let comp of results.data) {
                data.push(comp['nom de la compagnie'].split(' ').join('-').toLowerCase());
            }
            res.end(JSON.stringify(data));
        }
    })
})
module.exports = router;
