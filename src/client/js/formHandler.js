const zip = document.getElementById('zip');
const city = document.getElementById('city');
const arrive = document.getElementById('arrive');

//opens new tab if the user needs help finding the zip code for their destination
const findZip = () => {
    window.open('https://www.geonames.org/postalcode-search.html', '_blank');
}

//posts formdata to local server
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

//stops the user from entering a date in the past as their arrival date
const setMinDate = (e) => {
    let today = new Date();
    let day = today.getDate();
    let month = today.getMonth()+1; //months are zero-indexed
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
};

//requires user to fill out all required form values, then passes formdata to post function, where it's sent to local server
const handleSubmit = (e) => {    
    let zipCode = zip.value;
    let cityName = city.value;

    if(zipCode == "" || cityName == ""){
        alert('All required fields need to be filled out!');
        return;
    }
    else {
        let formData = new FormData(this);
        postData('/test', formData);    
    }
 
};

export { 
    postData,
    handleSubmit,
    findZip,
    setMinDate
 }
