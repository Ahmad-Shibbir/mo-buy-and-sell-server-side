const express = require('express');
const cors = require('cors');
const {MongoClient, ServerApiVersion}= require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_PASS}@cluster0.btevgbq.mongodb.net/?retryWrites=true&w=majority`;

// const uri =localhost/27017;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).send('unauthorized access');

    }
    const token= authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, decoded){
        if(err){
            return res.status(403).send({message: 'forbidden access'})
        }
        req.decoded = decoded;
        next();
    })
}

async function run(){
    try{
        const categoryCollection = client.db('mo-buy&sell').collection('cetegory');
        const orderCollection = client.db('mo-buy&sell').collection('orders');
        const userCollection = client.db('mo-buy&sell').collection('users');

        app.get('/order',verifyJWT,async(req, res)=>{
            const email = req.query.email;
            // console.log('token', req.headers.authorization);
            const decodedEmail = req.decoded.email;

            if(email != decodedEmail){
                return res.status(403).send({message: "forbidden access"})
            }

            console.log(email);
            const query = {email: email};        
            const orderForOneCus = await orderCollection.find(query).toArray();
            res.send(orderForOneCus);
        })
        app.get('/category',async(req,res)=>{
            const query = {};
           const categories = await categoryCollection.find(query).toArray(); 
           res.send(categories);

        })

        app.get('/users/admin/:email', async(req, res)=>{
            const email = req.params.email;
            const query={email};
            const user = await userCollection.findOne(query);
            res.send({isAdmin: user?.user_type === 'admin'});
        })
        app.get('/users/seller/:email', async(req, res)=>{
            const email = req.params.email;
            const query={email};
            const user = await userCollection.findOne(query);
            res.send({isSeller: user?.user_type === 'seller'});
        })
        app.get('/user/buyer/:email', async(req, res)=>{
            const email = req.params.email;
            const query={email};
            const user = await userCollection.findOne(query);
            res.send({isBuyer: user?.user_type === 'buyer'});
        })

        app.get('/users', async(req,res)=>{
            const query = {};
            const result = await userCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/jwt', async(req, res)=>{
            const email = req.query.email;
            const query= {email: email};
            const user = await userCollection.findOne(query);
            if(user){
                const token = jwt.sign({email}, process.env.ACCESS_TOKEN, {expiresIn:'1h'});
                return res.send({accessToken: token});
            }
            res.status(403).send({accessToken: ''})
        })

        app.post('/users', async(req,res)=>{
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
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
