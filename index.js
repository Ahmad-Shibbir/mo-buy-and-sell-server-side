const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());


app.get('/', async(req, res)=>{
    res.send('Mo-buy&sell is running')
})

app.listen(port,()=> console.log(`Mo-buy&sell is running on ${port}`))
