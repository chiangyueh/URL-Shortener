const express = require('express');
const port = 3000;
const app = express();
const { engine } = require('express-handlebars');
const mongoose = require('mongoose')
require('./config/mongoose');


app.engine('hbs', engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(express.urlencoded({extended : true}))

const Schema = mongoose.Schema;
const urlSchema = new Schema({
    url: String
})

const urlModel = mongoose.model("Url", urlSchema)

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/add', async (req, res) => {
    try {
        const shortenUrl = await urlModel.findOne({url : req.body.url})
            .then(e=>{
                if(!e){
                    return urlModel.create({ url: req.body.url })
                }
                return e
            })
            .then(e=>e._id.toString().slice(-5))
        res.render('index', {shortenUrl})
    } catch (e) {
        console.log(e)
    }
})


app.get('/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        const url = await urlModel.find({})
            .then((data) => {
                for(let key in data){
                    if(data[key]._id.toString().includes(_id)){
                        return data[key].url;
                    }
                }
                return null;
            })
        if(url){
            res.status(302).redirect(url)
        }else{
            res.send('404頁面不存在')
        }
    } catch (e) {
        console.log(e)
    }
})

app.listen(port, () => {
    console.log('項目開始運行')
})
