const express = require('express')
const path = require('path')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000 //to listen on port used by heroku app

//define paths for express config
const publicDir = path.join(__dirname, '../public')
const newPath = path.join(__dirname, '../template/views')
const partialsPath = path.join(__dirname, '../template/partials')

//setup handlebar engine and views
app.set('view engine','hbs')
app.set('views',newPath)
hbs.registerPartials(partialsPath)

//setup static directory to serve
app.use(express.static(publicDir))

app.get('',(req,res) => {
    res.render('index',{
        title: 'Weather App',
        name: 'Prince Shukla'
    })
})
app.get('/about',(req,res) => {
    res.render('about', {
        title: 'About me',
        name: 'Prince Shukla'
    })
})
app.get('/help',(req,res) => {
    res.render('help', {
        title:'Help page',
        contact: 9829704646
    })
})

app.get('/weather',(req,res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide address!'
        })
    }
    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if(error){
            return res.send({
                error
            })
        }
        forecast(latitude, longitude, (error, forecastData) => {
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})


app.get('/help/*',(req,res)=>{
    res.render('404', {
        title: '404 Help',
        name: 'Prince Shukla',
        errorMessage: 'No help article found'
    })
})

app.get('*',(req,res)=>{
    res.render('404', {
        title:'404',
        errorMessage: 'My 404 page',
        name: 'Prince Shukla'
    })
})
app.listen(port, () => {
    console.log('Server is up on port' + port)
})

