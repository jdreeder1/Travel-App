const results = document.getElementById('results');
const city = document.getElementById('city');
const placeImg = document.getElementById('placeImg');
const form = document.querySelector('.formSubmit');
const response = document.querySelector('.resSection');
const country =  document.getElementById('country');
const head = document.getElementById('head');
const col1 = document.getElementById('col1');
const col2 = document.getElementById('col2');
const foot1 = document.getElementById('foot1');
const foot2 = document.getElementById('foot2');

//NEED TO
//capitalize first letter of each word in city name

const formatDate = (dt) => {
    let newDate = new Date(`${dt.getFullYear()}-${dt.getMonth()+1}-${dt.getDate()+1}`);
    let dateStr = newDate.toDateString();

    return dateStr;
};

const currentForecast = (resp) =>{
    let correctDate = new Date(resp.valid_date);
    //let adjusted = correctDate.getDate()+1;
    //console.log(adjusted);
    let dateStr = formatDate(correctDate);

    let forecast = {};
    
    forecast.title = `${city.value}'s forecast for ${dateStr}:<br><br>`;
    forecast.description = `${resp.description}<br>
    High: ${resp.high_temp} &#8457;<br>
    Low: ${resp.low_temp} &#8457;<br>
    Precipitation: ${resp.precip} inches<br>
    Wind speed: ${resp.wind_spd} mph`;

    return forecast;

};

const historicalForecast = (resp) => {
    let correctDate = new Date(resp.datetime);
    console.log(correctDate);

    let dateStr = formatDate(correctDate);    
    
    let newArr = dateStr.toString().split(' ');
    let newDate = newArr.slice(1, 3).join(' ');

    let forecast = {};
    forecast.title = `Historical weather for ${city.value} on ${newDate}:<br>`;
    forecast.description = `High: ${resp.high_temp} &#8457;<br>
    Low: ${resp.low_temp} &#8457;<br>
    Precipitation: ${resp.precip} inches<br>
    Wind speed: ${resp.wind_spd} mph`;

    return forecast;
};

const displayImage = (resp) => {
    let imgHTML;    
    console.log(resp.flag);

        if(typeof resp.pic == 'undefined'){
            imgHTML = `<img id='cityPic' height='500' width='500' src='https://cdn.pixabay.com/photo/2016/01/09/18/27/journey-1130732_1280.jpg'/>`;
        }
        else {
            imgHTML = `<img id='cityPic' height='500' width='500' src='${resp.pic}'/>`;
        }
        placeImg.innerHTML = imgHTML; 
         
};

const displayFlag = (resp) => {
    let flagHTML = `<img id='countryFlag' height='175' width='275' src='${resp.flag}'>`;
    return flagHTML;
};

const displayLocationInfo = (resp) => {
    let fcast;
    displayImage(resp);
    let flagImg = displayFlag(resp);

    if(resp.forecast == 'current'){
        fcast = currentForecast(resp);
    }
    else if(resp.forecast == 'historical'){    
        fcast = historicalForecast(resp);
    }
        head.innerHTML = fcast.title;
        col1.innerHTML = fcast.description;
        col2.innerHTML = flagImg;
        foot1.innerHTML = `<button id="newTrip" onclick="location.reload();">New Trip</button>`;
        foot2.innerHTML = `<button id="saveTrip" onclick="return Client.saveFunc();
        ">Save Trip</button>`;     
};

const hideForm = () => {
    form.classList.add('hide');
    response.classList.add('show');
};

const isEmpty = (obj) => {
    for(let key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
};

const infoNotFound = () => {
    placeImg.innerHTML = `<p id="errorAlert">Invalid input. City data not found. Try again?</p><br><br>
                <button id="newTrip" onclick="location.reload();">New Trip</button>`;
};

const saveFunc = () => {
    localStorage.setItem('pic', placeImg.innerHTML);
    localStorage.setItem('flag', col2.innerHTML);
    localStorage.setItem('title', head.innerHTML);
    localStorage.setItem('descrip', col1.innerHTML);
    localStorage.setItem('newTrip', foot1.innerHTML);
    localStorage.setItem('saveTrip', foot2.innerHTML);

    setTimeout(()=> alert('Trip saved!'), 100);
};

const getSavedTrip = () => {
    if(localStorage.getItem('descrip') === null){
        infoNotFound();
    }
    else {
        placeImg.innerHTML = localStorage.getItem('pic');
        col2.innerHTML = localStorage.getItem('flag');
        head.innerHTML = localStorage.getItem('title');
        col1.innerHTML = localStorage.getItem('descrip');
        foot1.innerHTML = localStorage.getItem('newTrip');
        foot2.innerHTML = localStorage.getItem('saveTrip');
    }
    hideForm();
};

//fetches api response from local server
const updateUI = async () => { 

    const res = await fetch(`/update`);
    try {
        //form.classList.add('hide');
        const resp = await res.json()
        try {
            if(isEmpty(resp)){
                infoNotFound();
            }
            else {
                displayLocationInfo(resp);
            }
            hideForm();
        }
        catch(error){
            console.log(error);
        }
    }
    catch(error){
        console.log(error);
    }
    
};

export { updateUI, saveFunc, getSavedTrip }
