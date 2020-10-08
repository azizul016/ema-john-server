const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser')
require('dotenv').config()

console.log(process.env.DB_PASS);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xeryg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(cors());
app.use(bodyParser.json());
const port = 5000



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("emeJohnStores").collection("products");
    const ordersCollection = client.db("emeJohnStores").collection("order");
    console.log("db connection success")
    // console.log(err);
    //post method;
    app.post("/addProduct", (req, res) => {
        const products = req.body;
        console.log(products)
        productsCollection.insertOne(products)
            .then(result => {
                console.log(result)
                res.send(result.insertedCount)
            })

    })

    //get method;
    app.get("/products", (req, res) => {
        const search = req.query.search
        productsCollection.find({ name: { $regex: search } })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.get("/product/:key", (req, res) => {
        productsCollection.find({ key: req.params.key })
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })


    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body;
        productsCollection.find({ key: { $in: productKeys } })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    // for order collection;

    app.post("/addOrders", (req, res) => {
        const order = req.body;
        // console.log(order)
        ordersCollection.insertOne(order)
            .then(result => {
                console.log(result)
                res.send(result.insertedCount > 0)
            })

    })

});


app.get('/', (req, res) => {
    res.send('Hello World!')
})



app.listen(process.env.PORT || port, () => { console.log("Listening port 5000") })