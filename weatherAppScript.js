const wrapper = document.querySelector(".wrapper"),
inputPart = wrapper.querySelector(".input-part"),
infoText = inputPart.querySelector(".info-txt"),
inputfield = inputPart.querySelector("input");
const locationBtn = inputPart.querySelector("Button"),
wIcon = wrapper.querySelector(".weather-part img"),
backarrow =wrapper.querySelector("header i")

let api;
const apiKey = `571bc52adc9ecd9e73f3c6bc735c1f1c`



inputfield.addEventListener("keyup", e =>{
    //checking if the field is not empty and the user pressed enter not the btn in form
    if(e.key == "Enter" && inputfield.value != ""){
        requestAPI(inputfield.value);
    }
})
locationBtn.addEventListener("click", ()=>{
    if(navigator.geolocation){ //if the broweser support geolocation api
       
       //if the getcurrentpostion() is successful then onSuccess() will call
       //if any error ocurred while getting user location then onError() will call
        navigator.geolocation.getCurrentPosition(onSuccess, onError)
    }else{
        alert("Your browser not support geolocation api");
    }
})

backarrow.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
})

function onSuccess(position){
    const {latitude, longitude} = position.coords; //getting lat & lon of the user device from coords obj
    api =`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
    fetchJson()
}

function onError(error){
    infoText.innerHTML = error.message
    infoText.classList.add("erroe")
}



function requestAPI(city){
    console.log(city)
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetchJson()
}


function fetchJson(){
    infoText.innerHTML = "Getting weather details..."
    infoText.classList.add("pending")
    //getting api response and returing it eith parsing into js obj 
    //and in another then function calling weathersetails function with passing api result as an argument
    fetch(api).then(response => response.json()).then(result => weatherDetails(result))

}

function weatherDetails (info){
    infoText.classList.replace("pending", "error")
    if (info.cod == "404"){
        infoText.innerText = `${inputfield.value} isnot a valid city name`
        
    }else{
        const cityInfo = info.name
        const contery = info.sys.country
        const {description, id} = info.weather[0]
        const {feels_like, humidity, temp} = info.main


        if(id == 800){
            wIcon.src = "Weather Icons/cloud.svg"
        }else if(id >= 200 && id <= 232){
            wIcon.src = "Weather Icons/strom.svg"
        }else if(id >= 600 && id <= 622){
            wIcon.src = "Weather Icons/snow.svg"
        }else if(id >= 701 && id <= 781){
            wIcon.src = "Weather Icons/haze.svg"
        }else if(id >= 801 && id <= 804){
            wIcon.src = "Weather Icons/cloud.svg"
        }else if(id >= 300 && id <= 232 || (id >= 500 && id <=531)){
            wIcon.src = "Weather Icons/rain.svg"
        }

        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp)
        wrapper.querySelector(".weather").innerText = description
        wrapper.querySelector(".location span").innerText = `${cityInfo} , ${contery}`
        wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like)
        wrapper.querySelector(".humidity span").innerText = humidity

        infoText.classList.remove("pending", "error")
        wrapper.classList.add("active")
        
    }
}