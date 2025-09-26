// Theme Toggle Feature
const themeToggleBtn = document.getElementById('theme-toggle');
function setTheme(theme) {
    document.body.classList.toggle('light-theme', theme === 'light');
    document.querySelectorAll('.card, .saved-cities, header, footer, .save-btn, .saved-list li, .saved-list .remove-btn').forEach(el => {
        if (el) el.classList.toggle('light-theme', theme === 'light');
    });
    themeToggleBtn.textContent = theme === 'light' ? '🌚 Dark' : '🌙 Light';
    themeToggleBtn.style.color = theme === 'light' ? '#e85d04' : '#fff';
    localStorage.setItem('theme', theme);
}
themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
});
// On load, set theme from localStorage
setTheme(localStorage.getItem('theme') === 'light' ? 'light' : 'dark');
const apiKey="ec91b70b6adbf619c5286e28c8584b3d";
const apiUrl="https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";


const searchBox=document.querySelector(".search input");
const searchBtn=document.querySelector(".search button");
const weatherIcon=document.querySelector(".weather-icon");

async function checkWeather(city) {
    const loading = document.querySelector('.loading');
    loading.style.display = 'block';
    document.querySelector('.weather').style.display = 'none';
    document.querySelector('.error').style.display = 'none';
    try {
        const responce = await fetch(apiUrl + city + `&appid=${apiKey}`);
        if (responce.status == 404) {
            loading.style.display = 'none';
            document.querySelector('.error').style.display = 'block';
            document.querySelector('.weather').style.display = 'none';
        } else {
            var data = await responce.json();
            document.querySelector('.city').innerHTML = data.name;
            document.querySelector('.temp').innerHTML = Math.round(data.main.temp) + '°c';
            document.querySelector('.humidity').innerHTML = data.main.humidity + '%';
            document.querySelector('.wind').innerHTML = data.wind.speed + ' km/h';
            if (data.weather[0].main == 'Clouds') {
                weatherIcon.src = 'IMage/Clouds.jpg';
            }
            else if (data.weather[0].main == 'clear') {
                weatherIcon.src = 'IMage/clear.jpg';
            }
            else if (data.weather[0].main == 'rain') {
                weatherIcon.src = 'IMage/rain.jpg';
            }
            else if (data.weather[0].main == 'drizzle') {
                weatherIcon.src = 'IMage/drizzle.jpg';
            }
            else if (data.weather[0].main == 'mist') {
                weatherIcon.src = 'IMage/mist.jpg';
            }
            document.querySelector('.weather').style.display = 'block';
            document.querySelector('.error').style.display = 'none';
            loading.style.display = 'none';
        }
    } catch (error) {
        loading.style.display = 'none';
        document.querySelector('.error').style.display = 'block';
        document.querySelector('.weather').style.display = 'none';
    }
}


searchBtn.addEventListener("click",()=>{
    checkWeather(searchBox.value);
})
// Allow Enter key to trigger weather search
searchBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        checkWeather(searchBox.value);
    }
});

// Saved Cities Feature
const saveBtn = document.querySelector('.save-btn');
const savedList = document.querySelector('.saved-list');
const savedLimitMsg = document.querySelector('.saved-limit-msg');
let savedCities = JSON.parse(localStorage.getItem('savedCities') || '[]');

function updateSavedCities() {
    savedList.innerHTML = '';
    savedCities.forEach((city, idx) => {
        const li = document.createElement('li');
        li.textContent = `${city.name}: ${city.temp}, Humidity: ${city.humidity}, Wind: ${city.wind}`;
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.className = 'remove-btn';
        removeBtn.onclick = () => {
            savedCities.splice(idx, 1);
            localStorage.setItem('savedCities', JSON.stringify(savedCities));
            updateSavedCities();
            updateSaveBtn();
        };
        li.appendChild(removeBtn);
        savedList.appendChild(li);
    });
    savedLimitMsg.style.display = savedCities.length >= 3 ? 'block' : 'none';
    updateSaveBtn();
}

function updateSaveBtn() {
    if (!document.querySelector('.weather').style.display || document.querySelector('.weather').style.display === 'none') {
        saveBtn.disabled = true;
        return;
    }
    const currentCity = document.querySelector('.city').textContent;
    const alreadySaved = savedCities.some(c => c.name === currentCity);
    saveBtn.disabled = alreadySaved || savedCities.length >= 3;
}

saveBtn.addEventListener('click', () => {
    if (savedCities.length >= 3) return;
    const city = document.querySelector('.city').textContent;
    const temp = document.querySelector('.temp').textContent;
    const humidity = document.querySelector('.humidity').textContent;
    const wind = document.querySelector('.wind').textContent;
    if (!savedCities.some(c => c.name === city)) {
        savedCities.push({ name: city, temp, humidity, wind });
        localStorage.setItem('savedCities', JSON.stringify(savedCities));
        updateSavedCities();
    }
});

// Update save button state when weather is shown
const observer = new MutationObserver(updateSaveBtn);
observer.observe(document.querySelector('.weather'), { attributes: true, attributeFilter: ['style'] });

updateSavedCities();

// Toast Notification
function showToast(message, type = 'info') {
    let toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '32px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = type === 'error' ? '#ff4d4f' : (type === 'success' ? '#00feba' : '#5b548a');
    toast.style.color = '#fff';
    toast.style.padding = '12px 28px';
    toast.style.borderRadius = '8px';
    toast.style.fontFamily = 'Montserrat, Arial, sans-serif';
    toast.style.fontSize = '1rem';
    toast.style.boxShadow = '0 2px 8px #0002';
    toast.style.zIndex = '9999';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '1'; }, 100);
    setTimeout(() => { toast.style.opacity = '0'; }, 2200);
    setTimeout(() => { document.body.removeChild(toast); }, 2500);
}

// --- existing code ---

async function checkWeather(city) {
    const loading = document.querySelector('.loading');
    loading.style.display = 'block';
    document.querySelector('.weather').style.display = 'none';
    document.querySelector('.error').style.display = 'none';
    searchBtn.disabled = true;
    try {
        const responce = await fetch(apiUrl + city + `&appid=${apiKey}`);
        if (responce.status == 404) {
            loading.style.display = 'none';
            document.querySelector('.error').style.display = 'block';
            document.querySelector('.weather').style.display = 'none';
            showToast('City not found. Please try again.', 'error');
        } else {
            var data = await responce.json();
            document.querySelector('.city').innerHTML = data.name;
            document.querySelector('.temp').innerHTML = Math.round(data.main.temp) + '°c';
            document.querySelector('.humidity').innerHTML = data.main.humidity + '%';
            document.querySelector('.wind').innerHTML = data.wind.speed + ' km/h';
            if (data.weather[0].main == 'Clouds') {
                weatherIcon.src = 'IMage/Clouds.jpg';
            }
            else if (data.weather[0].main == 'clear') {
                weatherIcon.src = 'IMage/clear.jpg';
            }
            else if (data.weather[0].main == 'rain') {
                weatherIcon.src = 'IMage/rain.jpg';
            }
            else if (data.weather[0].main == 'drizzle') {
                weatherIcon.src = 'IMage/drizzle.jpg';
            }
            else if (data.weather[0].main == 'mist') {
                weatherIcon.src = 'IMage/mist.jpg';
            }
            const weatherDiv = document.querySelector('.weather');
            weatherDiv.style.display = 'block';
            weatherDiv.style.animation = 'fadeIn 0.7s';
            document.querySelector('.error').style.display = 'none';
            loading.style.display = 'none';
            showToast('Weather loaded for ' + data.name, 'success');
        }
    } catch (error) {
        loading.style.display = 'none';
        document.querySelector('.error').style.display = 'block';
        document.querySelector('.weather').style.display = 'none';
        showToast('Network error. Please try again.', 'error');
    }
    searchBtn.disabled = false;
}

// Add tooltips for buttons and input
searchBtn.setAttribute('title', 'Search weather for city');
searchBox.setAttribute('title', 'Type city name and press Enter or click Search');
themeToggleBtn.setAttribute('title', 'Toggle light/dark theme');
saveBtn.setAttribute('title', 'Save this city weather');

// --- existing code ---

saveBtn.addEventListener('click', () => {
    if (savedCities.length >= 3) return;
    const city = document.querySelector('.city').textContent;
    const temp = document.querySelector('.temp').textContent;
    const humidity = document.querySelector('.humidity').textContent;
    const wind = document.querySelector('.wind').textContent;
    if (!savedCities.some(c => c.name === city)) {
        savedCities.push({ name: city, temp, humidity, wind });
        localStorage.setItem('savedCities', JSON.stringify(savedCities));
        updateSavedCities();
        showToast('Saved ' + city + ' weather!', 'success');
    } else {
        showToast('City already saved.', 'info');
    }
});

// --- existing code ---

// Update remove button to show toast
function updateSavedCities() {
    savedList.innerHTML = '';
    savedCities.forEach((city, idx) => {
        const li = document.createElement('li');
        li.textContent = `${city.name}: ${city.temp}, Humidity: ${city.humidity}, Wind: ${city.wind}`;
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.className = 'remove-btn';
        removeBtn.onclick = () => {
            showToast('Removed ' + city.name + ' from saved.', 'info');
            savedCities.splice(idx, 1);
            localStorage.setItem('savedCities', JSON.stringify(savedCities));
            updateSavedCities();
            updateSaveBtn();
        };
        li.appendChild(removeBtn);
        savedList.appendChild(li);
    });
    savedLimitMsg.style.display = savedCities.length >= 3 ? 'block' : 'none';
    updateSaveBtn();
}