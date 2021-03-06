const mercadoPago = require('mercadopago')

mercadoPago.configure({
    access_token:'APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398',
    integrator_id:'dev_24c65fb163bf11ea96500242ac130004'
})

//collection_id es el id de pago


module.exports = {
    home: (req, res) => {
        return res.render("index");
    },


    detail: (req, res) => {
        return res.render("detail", { ...req.query });
    },


    callback: (req, res) => {
        console.log("--------------------------------------------"+req.query)
        //guardar en la base de datos lo que llega a traves de req.query, tiene toda la info del pago/compra


        if(req.query.status.includes('success')){
            res.render('success', {
                payment_type : req.query.payment_type,
                external_reference : req.query.external_reference,
                collection_id : req.query.collection_id
            })
        }

        if(req.query.status.includes('pending')){
            res.render('pending')
        }

        if(req.query.status.includes('failure')){
            res.render('failure')
        }

        return res.status(404).end()
    },


    notifications: (req, res) => {

        console.log('webhook', req.body);
        
        res.status(200).send(req.body);

    },


    comprar: (req, res) => {

        const host = 'https://mp-curso.herokuapp.com/'

        const url = host + 'callback?status='

        let preference = {

            back_urls:{
                success: url + 'success',
                pending: url + 'pending',
                failure: url + 'failure'
            },

            notification_url: host + 'notifications',

            auto_return: 'approved',
            //--> va adentro de la preferencia y genera una redireccion automatica solamente si el pago fue aceptado

            payment_methods:{
                payer:{
                    name:'ryan',
                    surname:'dahl',
                    email:'test_user_63274575@testuser.com',
                    phone:{
                        area_code:'11',
                        number:'55556666'
                    },
                    address:{
                        zip_code:'1234',
                        street_name:'monroe',
                        street_number:860
                    }
                },

                excluded_payment_types:[
                    {id:'atm'}
                ],

                excluded_payment_methods:[
                    {id:'visa'}
                ],

                installments:12
            },

            items: [
                {
                    id: 1234,
                    title:'Nombre del Producto',
                    description:'Dispositivo móvil de Tienda e-commerce',
                    unit_price:999,
                    quantity:1
                }
            ],
            external_reference:'crdr.jc@gmail.com'
        }

        mercadoPago.preferences.create(preference)
        .then(function(response){
            global.init_point = response.body.init_point
            console.log(response)
            res.render('confirm')
        })
        .catch(function(e){
            console.log(e)
            res.send('error')
        })

        
    }
}