const zip = document.getElementById('zip');
const city = document.getElementById('city');
const country = document.getElementById('country');
const submit = document.getElementById('submit');
const arrive = document.getElementById('arrive');

const findZip = () => {
    window.open('https://www.geonames.org/postalcode-search.html', '_blank');
}

const postData = async (url, data = {}) => {
    console.log(url, data);
    const formData = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) 
    });    
    try {
        const placeInfo = await formData.json();
        return placeInfo;
    } catch {
        error => console.log(error);
    }
};

const setMinDate = (e) => {

    let today = new Date();
    let day = today.getDate();
    let month = today.getMonth()+1; //January is 0
    let year = today.getFullYear();
    
         if(day<10){
                day=`0${day}`;
            } 
        if(month<10){
            month=`0${month}`;
        }
        
        today = `${year}-${month}-${day}`;

        if(arrive.value < today){
            alert("Can\'t set arrival date before today!");
            arrive.value = '';
        }

    }

const handleSubmit = (e) => {
    //setMinDate();
    
    let zipCode = zip.value;
    let cityName = city.value;
    //let countryCode = country.options[country.selectedIndex].value;  

    if(zipCode == "" || cityName == ""){
        alert('All required fields need to be filled out!');
        return;
    }
    else {
        let formData = new FormData(this);
        //let data = {zp: zipCode, cty: cityName, cntry: countryCode};
        postData('/test', formData);    
    }
 
};

export { 
    //getLocation,
    postData,
    handleSubmit,
    findZip,
    setMinDate
 }
