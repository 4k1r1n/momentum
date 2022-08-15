import playList from './playList.js';
import translation from './translation.js';
// import storage from './storage.js';


const main = document.querySelector('.main'),
    body = document.querySelector('body'),
    footer = document.querySelector('.footer'),
    popUp = body.querySelector('.pop-up');

const state = {
    photoSource: ['github', 'unsplash', 'flickr'],
}

//Translation
const changeLangBtn = popUp.querySelector('.settings-right-conrol');

let lang = 'en';

const changeLang = () => {
    lang === 'en' ? lang = 'ru' : lang = 'en';

    translateSettings(lang);
    getQuotes(lang);
    getWeather(lang);
    translateDefaultCity(lang);
    translatePlaceholders(lang);
}

const translatePlaceholders = lang => {
    name.placeholder = translation[lang].placeholderName;
    city.placeholder = translation[lang].placeholderCity;
}

const translateDefaultCity = lang => {
    if (city.value === translation['ru'].defaultCity || city.value === translation['en'].defaultCity)
        city.value = translation[lang].defaultCity;
}

changeLangBtn.addEventListener('click', changeLang);

//Time
const time = main.querySelector('.time');

function showTime() {
    const date = new Date(),
        currentTime = date.toLocaleTimeString('ru');

    time.textContent = currentTime;

    setTimeout(showTime, 1000);
    showDate(lang);
    showGreeting(lang);
}

// //Date 
const date = main.querySelector('.date');

function showDate(lang) {
    const dateNew = new Date(),
        options = { weekday: 'long', month: 'long', day: 'numeric' };

    date.textContent = dateNew.toLocaleDateString(lang, options)
}

//Greeting
const timeOfDayArr = translation[lang].timeOfDay;

const getTimeOfDay = () => {
    const date = new Date(),
        hours = date.getHours(),
        hour = Math.floor(hours / 6);

    let timeOfDay;

    switch (hour) {
        case 1:
            return timeOfDay = timeOfDayArr[0];
        case 2:
            return timeOfDay = timeOfDayArr[1];
        case 3:
            return timeOfDay = timeOfDayArr[2];
        default:
            return timeOfDay = timeOfDayArr[3];
    }
}

const greeting = main.querySelector('.greeting'),
    greetingWidget = main.querySelector('.greeting-container');

function showGreeting(lang) {
    const timeOfDay = getTimeOfDay();

    timeOfDayArr.forEach((time, i) => {
        if (time === timeOfDay) {
            let greetingText = `${Object.values(translation[lang].greeting)[i]},`;
            greeting.textContent = greetingText;
        }
    });
}

showTime();

const name = main.querySelector('.name');

//Slider
const githubSource = popUp.querySelector('#github'),
    unsplashSource = popUp.querySelector('#unsplash'),
    flickrSource = popUp.querySelector('#flickr');

let randomNum;

function getRandomNum() {
    randomNum = String(Math.floor(Math.random() * 20) + 1);
}

getRandomNum();

const setGithubBg = () => {
    const timeOfDay = getTimeOfDay(),
        bgNum = String(randomNum).padStart(2, '0'),
        img = new Image();

    img.src = `https://raw.githubusercontent.com/4k1r1n/momentum-backgrounds/main/${timeOfDay}/${bgNum}.webp`;
    img.onload = () => {
        body.style.backgroundImage = `url(${img.src})`;
    };
}

async function getLinkToImage(photoSource) {
    const timeOfDay = getTimeOfDay();

    let url;

    if (photoSource === state.photoSource[1]) {
        url = `https://api.unsplash.com/photos/random?orientation=landscape&query=${timeOfDay}&client_id=nzyoPf36M1-WxjrvPbm8xgCsC8SZBssdo755IQ-OlCU`;
    } else {
        url = `https://api.unsplash.com/photos/random?orientation=landscape&query=${timeOfDay}&client_id=nzyoPf36M1-WxjrvPbm8xgCsC8SZBssdo755IQ-OlCU`
    }

    const res = await fetch(url),
        data = await res.json();

    const img = new Image();

    img.src = data.urls.regular;
    img.onload = () => {
        body.style.backgroundImage = `url(${img.src})`;
    };
}

const getSlideNext = () => {
    if (flickrSource.checked) {
        getLinkToImage(state.photoSource[1]);
    } else if (unsplashSource.checked) {
        getLinkToImage(state.photoSource[2]);
    } else {
        randomNum === 20 ? randomNum = 1 : randomNum++;
        setGithubBg();
    }
}

const getSlidePrev = () => {
    if (flickrSource.checked) {
        getLinkToImage(state.photoSource[1]);
    } else if (unsplashSource.checked) {
        getLinkToImage(state.photoSource[2]);
    } else {
        randomNum === 1 ? randomNum = 20 : randomNum--;
        setGithubBg();
    }
}

const slideNext = main.querySelector('.slide-next'),
    slidePrev = main.querySelector('.slide-prev');

slideNext.addEventListener('click', getSlideNext);
slidePrev.addEventListener('click', getSlidePrev);

// setGithubBg();

githubSource.addEventListener('change', e => {
    flickrSource.checked = false;
    unsplashSource.checked = false;
    if (e.target.checked) setGithubBg();
});

unsplashSource.addEventListener('change', e => {
    flickrSource.checked = false;
    githubSource.checked = false;
    if (e.target.checked) getLinkToImage(state.photoSource[1]);
});

flickrSource.addEventListener('change', e => {
    githubSource.checked = false;
    unsplashSource.checked = false;
    if (e.target.checked) getLinkToImage(state.photoSource[2]);
})


//Weather Widget
const weather = document.querySelector('.weather');

const weatherIcon = weather.querySelector('.weather-icon'),
    temperature = weather.querySelector('.temperature'),
    wind = weather.querySelector('.wind'),
    humidity = weather.querySelector('.humidity'),
    weatherDescription = weather.querySelector('.weather-description'),
    weatherError = weather.querySelector('.weather-error');

const city = weather.querySelector('.city');

city.addEventListener('change', () => getWeather(lang));

async function getWeather(lang) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${lang}&appid=08f2a575dda978b9c539199e54df03b0&units=metric`,
        res = await fetch(url),
        data = await res.json();

    weatherIcon.className = 'weather-icon owf';

    try {
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
        wind.textContent = `${translation[lang].windSpeed}: ${Math.round(data.wind.speed)} ${translation[lang].windSpeedUnit}`;
        humidity.textContent = `${translation[lang].weatherHumidity}: ${Math.round(data.main.humidity)}%`;
        weatherDescription.textContent = data.weather[0].description;
        weatherError.textContent = '';
    } catch {
        weatherError.textContent = `${translation[lang].weatherError}`;
        temperature.textContent = '';
        wind.textContent = '';
        humidity.textContent = '';
        weatherDescription.textContent = '';
    }
}

//"Quote of the Day" Widget
const quote = footer.querySelector('.quote'),
    quoteWidget = footer.querySelector('.quote-container'),
    author = footer.querySelector('.author'),
    newQuote = footer.querySelector('.change-quote');

async function getQuotes(lang) {
    const quotes = `./assets/quotes/data-${lang}.json`,
        res = await fetch(quotes),
        data = await res.json();

    const randomQuoteNum = Math.floor(Math.random() * data.length);

    if (data[randomQuoteNum].author === null) {
        author.textContent = '';
    } else {
        author.textContent = `${data[randomQuoteNum].author}`;
    }

    quote.textContent = `"${data[randomQuoteNum].text}"`;
}

getQuotes(lang);

newQuote.addEventListener('click', () => getQuotes(lang));

//Audio player
const audioPlayer = document.querySelector('.audio-player');

const title = audioPlayer.querySelector('.title'),
    artist = audioPlayer.querySelector('.artist'),
    audio = new Audio();

let playNum = 0;

const loadTrack = playNum => {
    title.textContent = playList[playNum].title;
    artist.textContent = playList[playNum].artist;
    audio.src = playList[playNum].src;

    setActiveTrack(playNum);
}

const ulPlayList = audioPlayer.querySelector('.play-list');

const loadPlaylist = () => {
    playList.forEach(el => {
        let liTrackTag = `<li class="play-item">
        <div class="row">
        <div class="column">
        <span>${el.title}</span>
        <span class="artist">${el.artist}</span>
        </div>
        <span class="duration">${el.duration}</span>
        </div>
        </li>`;

        ulPlayList.insertAdjacentHTML('beforebegin', liTrackTag);
    })
}

loadPlaylist();

const playItems = audioPlayer.querySelectorAll('.play-item');

const setActiveTrack = (playNum) => {
    for (let i = 0; i < playItems.length; i++) {
        if (i === playNum) {
            playItems[i].classList.add('active');
        } else {
            playItems[i].classList.remove('active');
        }
    }
}

const playlistBtn = audioPlayer.querySelector('.playlist'),
    playListContainer = audioPlayer.querySelector('.play-list-container');

const togglePlayList = () => {
    playListContainer.classList.toggle('active');
}

playlistBtn.addEventListener('click', togglePlayList)

const playPauseBtn = audioPlayer.querySelector('.play'),
    playPrevBtn = audioPlayer.querySelector('.play-prev'),
    playNextBtn = audioPlayer.querySelector('.play-next');

function playAudio() {
    playPauseBtn.classList.add('pause');
    audio.play();

    audio.addEventListener('ended', playNext);
}

function pauseAudio() {
    playPauseBtn.classList.remove('pause');
    audio.pause();
}

const playNext = () => {
    playNum++;

    if (playNum > playList.length - 1) playNum = 0;

    loadTrack(playNum);
    playAudio();
}

const playPrev = () => {
    playNum--;

    if (playNum < 0) playNum = playList.length - 1;

    loadTrack(playNum);
    playAudio();
}

function switchAudio() {
    if (audio.paused) {
        playAudio();
    } else {
        pauseAudio();
    }
}

playPauseBtn.addEventListener('click', switchAudio);
playNextBtn.addEventListener('click', playNext);
playPrevBtn.addEventListener('click', playPrev);

const progress = audioPlayer.querySelector('.progress'),
    trackCurrentTime = audioPlayer.querySelector('.current-time');

audio.addEventListener('timeupdate', e => {
    const progressWidth = (e.target.currentTime / e.target.duration) * 100;
    progress.style.width = `${progressWidth}% `;

    trackCurrentTime.textContent = getTimeCodeFromNum(audio.currentTime)
})

const duration = audioPlayer.querySelector('.duration');

audio.addEventListener('loadeddata', () => {
    duration.textContent = getTimeCodeFromNum(audio.duration);

    audio.volume = 0.75;
});

const getTimeCodeFromNum = num => {
    let seconds = parseInt(num % 60),
        minutes = parseInt(num / 60);

    return `${minutes}:${String(seconds).padStart(2, 0)} `;
}

const timeline = audioPlayer.querySelector('.timeline');

const timelineSkipAround = e => {
    const timelineWidth = timeline.clientWidth;
    const timeToSeek = e.offsetX;

    audio.currentTime = (timeToSeek / timelineWidth) * audio.duration;
}

timeline.addEventListener('click', e => timelineSkipAround(e))

const volumeSlider = audioPlayer.querySelector('.volume-slider'),
    volumePercentage = audioPlayer.querySelector('.volume-percentage');

const changeVolume = e => {
    const newVolume = e.offsetX / volumeSlider.clientWidth;
    audio.volume = newVolume;

    volumePercentage.style.width = `${newVolume * 100}%`;
}

volumeSlider.addEventListener('click', e => {
    changeVolume(e);

    if (volumeBtn.classList.contains('mute')) {
        audio.muted = !audio.muted;
        volumeBtn.classList.remove('mute')
    };
})

const volumeBtn = audioPlayer.querySelector('.volume');

const toggleMute = () => {
    audio.muted = !audio.muted;

    if (audio.muted) {
        volumeBtn.classList.add('mute');
        volumePercentage.style.width = 0;
    } else {
        volumeBtn.classList.remove('mute');
        volumePercentage.style.width = `${audio.volume * 100}% `;
    }
}

volumeBtn.addEventListener('click', toggleMute);

// Settings
const settingsBtn = footer.querySelector('.settings');

const openSettings = () => {
    popUp.classList.add('active');
}

const closeSettings = (e) => {
    if (e.target.classList.contains('pop-up-close') || e.target.classList.contains('pop-up')) {
        popUp.classList.remove('active');
    }
}

const popUpTitle = popUp.querySelector('.pop-up-title'),
    popUpText = popUp.querySelectorAll('.pop-up-text'),
    widgetsNames = popUp.querySelectorAll('.widget'),
    langContext = popUp.querySelector('.settings-lang');

const translateSettings = (lang) => {
    popUpTitle.textContent = `${translation[lang].settingsTitle}`;
    changeLangBtn.textContent = `${translation[lang].changeBtn}`;
    langContext.textContent = `${translation[lang].language}`;

    [...popUpText].forEach((el, i) => {
        el.textContent = `${Object.values(translation[lang].settingNames)[i]}`;
    });

    [...widgetsNames].forEach((el, i) => {
        el.textContent = `${Object.values(translation[lang].widgetsNames)[i]}`;
    });
}

body.addEventListener('click', e => closeSettings(e));
settingsBtn.addEventListener('click', openSettings);

const timeCheckbox = popUp.querySelector('#time'),
    dateCheckbox = popUp.querySelector('#date'),
    greetingCheckbox = popUp.querySelector('#greeting'),
    quoteCheckbox = popUp.querySelector('#quote'),
    weatherCheckbox = popUp.querySelector('#weather'),
    audioPlayerCheckbox = popUp.querySelector('#audio-player');

const hideWidget = (widget) => {
    widget.classList.add('hide');
}

const showWidget = (widget) => {
    widget.classList.remove('hide');
}

const toggleWidgets = () => {
    const widgetsCheckboxes = [timeCheckbox, dateCheckbox, greetingCheckbox, quoteCheckbox, weatherCheckbox, audioPlayerCheckbox];
    const widgets = [time, date, greetingWidget, quoteWidget, weather, audioPlayer];

    widgetsCheckboxes.forEach((checkbox, i) => {
        checkbox.addEventListener('change', e => {
            if (!e.target.checked) {
                hideWidget(widgets[i]);
            } else {
                showWidget(widgets[i]);
            };
        })
    })
}

toggleWidgets();

//Local Storage
let settings = {
    "githubSource": true,
    "unsplashSource": false,
    "flickrSource": false,

    "timeCheckbox": true,
    "dateCheckbox": true,
    "greetingCheckbox": true,
    "quoteCheckbox": true,
    "weatherCheckbox": false,
    "audioPlayerCheckbox": true,
}

let parsedSettings;

function setLocalStorage() {
    localStorage.setItem('city', city.value);
    localStorage.setItem('lang', lang);
    localStorage.setItem('name', name.value);

    localStorage.setItem('settings', JSON.stringify(settings));
}

window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage() {
    lang = localStorage.getItem('lang');

    if (localStorage.getItem('name')) {
        name.value = localStorage.getItem('name');
    }

    if (localStorage.getItem('city') !== 'null') {
        city.value = localStorage.getItem('city');
    } else {
        city.value = 'Minsk';
    }

    parsedSettings = JSON.parse(localStorage.getItem('settings'));

    parsedSettings.audioPlayerCheckbox = audioPlayerCheckbox.checked;

    console.log(parsedSettings)
}

window.addEventListener('load', () => {
    getLocalStorage();
    getWeather(lang);
    loadTrack(playNum);
    translatePlaceholders(lang);
    getQuotes(lang);
    translateSettings(lang);
});