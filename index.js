const express = require('express');
const cors = require('cors');
const {MongoClient, ServerApiVersion}= require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_PASS}@cluster0.btevgbq.mongodb.net/?retryWrites=true&w=majority`;

// const uri =localhost/27017;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const categoryCollection = client.db('mo-buy&sell').collection('cetegory');

        app.get('/category',async(req,res)=>{
            const query = {};
           const categories = await categoryCollection.find(query).toArray(); 
           res.send(categories);

        })

    }
    finally{

    }

}
run().catch(console.log);



app.get('/', async(req, res)=>{
    res.send('Mo-buy&sell is running')
})

app.listen(port,()=> console.log(`Mo-buy&sell is running on ${port}`))
