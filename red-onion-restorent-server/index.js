const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs-extra');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lvtch.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;





const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('creative'));
app.use(fileUpload())


const port = 4000;

app.get('/', (req, res) => {
    res.send("hello This is Red onion restorent")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const creativityCollection = client.db("redOnionRestorent").collection("orders");

    // ==================================================== Client order

    app.post('/order', (req, res) => {
        const file = req.files.file;
        const name = req.body.name;
        const email = req.body.email;
        const project = req.body.project;
        const service = req.body.service;

        console.log(file, name, email, project, service);
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        const image = {
            contentType: req.files.file.mimetype,
            size: req.files.file.size,
            img: Buffer.from(encImg, 'base64')
        };

        creativityCollection.insertOne({ name, email, project, service, image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })



    app.get('/orders', (req, res) => {
        creativityCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

})



app.listen(port)