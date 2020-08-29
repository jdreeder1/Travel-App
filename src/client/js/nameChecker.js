const zip = document.getElementById('zip');
const city = document.getElementById('city');
const country = document.getElementById('country');
const submit = document.getElementById('submit');

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
const checkForName = (e) => {
    
    let zipCode = zip.value;
    let cityName = city.value;
    let countryCode = country.options[country.selectedIndex].value;   

    if(zipCode == "" || cityName == ""){
        alert('All required fields need to be filled out!');
        return;
    }
    else {
        const formData = new FormData(this);
        //let data = {zp: zipCode, cty: cityName, cntry: countryCode};
        postData('/test', formData);    
    }
 
};

export { 
    //getLocation,
    postData,
    checkForName
 }
