const dotenv = require('dotenv');
dotenv.config();

const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
//const mockAPIResponse = require('./mockAPI.js')
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
     res.sendFile('dist/index.html')
    //res.sendFile(path.resolve('src/client/views/index.html'))
})

// designates what port the app will listen to for incoming requests
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
    console.log(process.env.GEONAMES_USERNAME)
})

const getLocation = async (zp, cty, cntry, key) => {
    //name=hartsburg&country=US
        const res = await fetch (`http://api.geonames.org/postalCodeSearchJSON?postalcode=${zp}&placename=${cty}&country=${cntry}&maxRows=10&username=${key}`) 
        try {
            //converts data to json
            const resp = await res.json()
            try {
                let response = resp;
                //location.postalCodes[0].lat;
                //location.postalCodes[0].lng;
                let coords = {
                    latitude: response.postalCodes[0].lat,
                    longitude: response.postalCodes[0].lng
                }; 
                //postData(coords);
                console.log(coords);
            }
            catch(error){   
                console.log(error);
            }
            
        }
        catch (error) {
            console.log('error: ', error);
        }
    };

app.post('/test', async (req, res) => {
    //zip=65202&city=Columbia&country=US
    //res.send(req.body);
    let code = req.body.zip;
    let cty = req.body.city;
    let ctry = req.body.country;

    getLocation(code, cty, ctry, process.env.GEONAMES_USERNAME);
});
