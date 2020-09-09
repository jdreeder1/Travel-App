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

console.log(__dirname)

app.get('/', function (req, res) {
    //res.sendFile(path.join(__dirname+'/mockAPI.js')); 
    res.sendFile('dist/index.html')
    //res.sendFile(path.resolve('src/client/views/index.html'))
})

// designates what port the app will listen to for incoming requests
app.listen(3000, function () {
    console.log('Travel app listening on port 3000!')
})

const getLocation = async (zp, cty, cntry, key) => {
    //name=hartsburg&country=US
        const res = await fetch (`http://api.geonames.org/postalCodeSearchJSON?postalcode=${zp}&placename=${cty}&country=${cntry}&maxRows=10&username=${key}`) 
        try {
            //converts data to json
            const resp = await res.json();
            //console.log(resp);
            try {
                let response = resp;
                //location.postalCodes[0].lat;
                //location.postalCodes[0].lng;
                let coords = {
                    latitude: response.postalCodes[0].lat,
                    longitude: response.postalCodes[0].lng,
                    adminName1: response.postalCodes[0].adminName1 
                }; 
                //postData(coords);
                return coords;
            }
            catch(error){   
                   console.log('errorobj: ', error);
 
            }
            
        }
        catch (error) {
            //console.log('error: ', error);
                console.log('error: ', error);
        }
    };

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

const setHistoricalDates = (arrive) => {
    let dateObj = new Date(arrive);
    let dateObj2 = new Date(arrive);

    let historicalMonth = dateObj.getMonth()+1;
    let historicalDay = dateObj.getDate()+1;
    let historicalYear = dateObj.getFullYear()-1;

    let histEndDay = dateObj2.getDate()+2;

    let histDtObj = new Date(`${historicalYear}-${historicalMonth}-${historicalDay}`);
    let histEndDt = new Date(`${historicalYear}-${historicalMonth}-${histEndDay}`);

    //console.log(histDtObj, histEndDt);

    let historicalDate = formatDate(histDtObj);
    let historicalEndDate = formatDate(histEndDt);

    //console.log(historicalDate, historicalEndDate);

    let histDates = {
        histStDate: historicalDate,
        histEndDate: historicalEndDate
    };

    return histDates;
};

const getWeather = async (lat, lon, fcast, arrive) => {
    
    let histDates = setHistoricalDates(arrive);

    if(fcast == 'current'){
        //Example request:
        //https://api.weatherbit.io/v2.0/forecast/daily?lat=38.123&lon=-78.543&units=I&key=a9d713df8e3f4fcba6e614cd20de9cda
        const res = await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&days=7&units=I&key=${process.env.WEATHERBIT_API_KEY}`)
        try {
            //converts data to json
            const resp = await res.json();
            try {
                //let response = resp;
                
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
                //postData(coords);
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
                //postData(coords);
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
//Pixabay example request:
//https://pixabay.com/api/?key=18060529-1e910e7d3f19e8c33112b65b8&q=yellow+flowers&image_type=photo

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

app.post('/test', async (req, res) => {
    projectData = {};
    //zip=65202&city=Columbia&country=US
    let code = req.body.zip;
    let cty = req.body.city;
    let ctry = req.body.country;
    let arrive = req.body.arrive;
    //let countryName = req.body.countryName;

    console.log(ctry);

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
        //res.status(status).send(body) => correct way to 'send'
        let weather = await getWeather(latitude, longitude, forecast, arrive);
        let image = await getImage(cty, adminName1);
        let flag = await getFlag(ctry);
    }
    catch(error){
        console.log(error);
    }
    
});

const sendData = (req, res) => {    
    res.send(projectData);
};

app.get('/update', sendData);
