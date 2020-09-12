const dotenv = require('dotenv');
dotenv.config();

const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fetch = require('node-fetch') //fetch api not native to node

const app = express()
app.use(cors());
//to use json
app.use(bodyParser.json());
//to use url encoded values
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static('dist'))

let projectData = {};

app.get('/', (req, res) => {
    res.sendFile('dist/index.html')
})

// designates what port the app will listen to for incoming requests
app.listen(3000); 

//retrieves latitude and longitude coordinates for chosen destination from geonames api
const getLocation = async (zp, cty, cntry, key) => {
    const res = await fetch (`http://api.geonames.org/postalCodeSearchJSON?postalcode=${zp}&placename=${cty}&country=${cntry}&maxRows=10&username=${key}`) 
    try {
        //converts data to json
        const resp = await res.json();
        try {
            let response = resp;
            let coords = {
                latitude: response.postalCodes[0].lat,
                longitude: response.postalCodes[0].lng,
                adminName1: response.postalCodes[0].adminName1 
            }; 
            return coords;
        }
        catch(error){   
                console.log('errorobj: ', error); 
        }
        
    }
    catch (error) {
            console.log('error: ', error);
    }
};

//converts date object into simple iso string
let formatDate = (dt) => {

    let isoFormat = dt.toISOString();
    let isoArr = isoFormat.split('');

    let findInd = isoArr.findIndex((x) => {
        return x == 'T';
    });
    let slcArr = isoArr.splice(findInd, isoArr.length);
    let joinArr = isoArr.join('');

    return joinArr;
};

//picks the date exactly one year before the chosen arrival date (used for Weatherbit's historical forecast api) 
const setHistoricalDates = (arrive) => {
    let dateObj = new Date(arrive);
    let dateObj2 = new Date(arrive);

    let historicalMonth = dateObj.getMonth()+1;
    let historicalDay = dateObj.getDate()+1;
    let historicalYear = dateObj.getFullYear()-1;

    let histEndDay = dateObj2.getDate()+2;

    let histDtObj = new Date(`${historicalYear}-${historicalMonth}-${historicalDay}`);
    let histEndDt = new Date(`${historicalYear}-${historicalMonth}-${histEndDay}`);

    let historicalDate = formatDate(histDtObj);
    let historicalEndDate = formatDate(histEndDt);

    let histDates = {
        histStDate: historicalDate,
        histEndDate: historicalEndDate
    };

    return histDates;
};

//retrieves current or historical forecast from weatherbit api depending on chosen arrival date
const getWeather = async (lat, lon, fcast, arrive) => {
    
    let histDates = setHistoricalDates(arrive);

    if(fcast == 'current'){
        const res = await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&days=7&units=I&key=${process.env.WEATHERBIT_API_KEY}`)
        try {
            //converts data to json
            const resp = await res.json();
            try {                
                let findDay = resp.data.findIndex((x) =>{
                    return x.valid_date.includes(arrive);
                });

                let weatherData = {
                    low_temp: resp.data[findDay].low_temp,
                    high_temp: resp.data[findDay].max_temp,
                    precip: resp.data[findDay].precip,
                    wind_spd: resp.data[findDay].wind_spd,
                    description: resp.data[findDay].weather.description,
                    valid_date: resp.data[findDay].valid_date,
                    forecast: fcast
                }; 
                projectData = weatherData;
            }
            catch(error){   
                console.log(error);
            }
            
        }
        catch (error) {
            console.log('error: ', error);
        }
    }
    else if(fcast == 'historical'){
        const res = await fetch(`https://api.weatherbit.io/v2.0/history/daily?lat=${lat}&lon=${lon}&start_date=${histDates.histStDate}&end_date=${histDates.histEndDate}&units=I&key=${process.env.WEATHERBIT_API_KEY}`)
        try {
            //converts data to json
            const resp = await res.json();
            try {
                let weatherData = {
                    low_temp: resp.data[0].min_temp,
                    high_temp: resp.data[0].max_temp,
                    precip: resp.data[0].precip, 
                    wind_spd: resp.data[0].wind_spd, 
                    datetime: resp.data[0].datetime,
                    forecast: fcast
                }; 
                projectData = weatherData;
            }
            catch(error){   
                console.log(error);
            }
            
        }
        catch (error) {
            console.log('error: ', error);
        }
    }
};

//retrieves image of city chosen as the user's destination from pixabay api
const getImage = async (city, adminName1) => {
    console.log(city, adminName1);
    const res = await fetch(`https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${city}+${adminName1}&image_type=photo&order=popular&per_page=3`);
    try {
        const resp = await res.json();
        try {
            let pic1 = resp.hits[0].webformatURL;
            projectData.pic = pic1;
        }
        catch(error){   
            console.log(error);
        }
    }
    catch (error) {
        console.log('error: ', error);       
    }    
};

//retrieves image of the country flag for the user's chosen destination 
const getFlag = async (ctry) => {
    const res = await fetch(`https://restcountries.eu/rest/v2/alpha/${ctry}`);
    try {
        const resp = await res.json();
        console.log(resp);

        try {
            let flg = resp.flag;
            projectData.flag = flg;
        }
        catch(error){   
            console.log(error);
        }
    }
    catch (error) {
        console.log('error: ', error);       
    }    
}

//end point for formdata post with a callback function used to control api request execution
app.post('/test', async (req, res) => {
    projectData = {};

    let code = req.body.zip;
    let cty = req.body.city;
    let ctry = req.body.country;
    let arrive = req.body.arrive;

    let newDate = new Date();
    newDate.setDate(newDate.getDate() + 7);

    let oneWeekAway = formatDate(newDate);
    let forecast;

    if(arrive <= oneWeekAway){
        forecast = 'current';
    }
    else if(arrive > oneWeekAway){
        forecast = 'historical';
    }

    const coords = await getLocation(code, cty, ctry, process.env.GEONAMES_USERNAME);
    try {
        let latitude = coords.latitude;
        let longitude = coords.longitude;
        let adminName1 = coords.adminName1;

        let weather = await getWeather(latitude, longitude, forecast, arrive);
        let image = await getImage(cty, adminName1);
        let flag = await getFlag(ctry);
    }
    catch(error){
        console.log(error);
    }
    
});

//sends selected api request data to client side
const sendData = (req, res) => {    
    res.send(projectData);
};

app.get('/update', sendData);

//exports functions used in testing
exports.formatDate = formatDate;
exports.setHistoricalDates = setHistoricalDates;

