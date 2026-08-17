const audio = document.getElementById('bg-music');
const playPauseBtn = document.getElementById('play-pause-btn');
const seekBar = document.getElementById('seek-bar');
const currentTimeDisplay = document.getElementById('current-time');
const durationDisplay = document.getElementById('duration');

const playlist = [
    { src: 'assets/lagu/lagu1.mp3', title: 'Ultraviolence', artist: 'lana del Rey', cover: 'assets/cover/cover1.jpg' },
    { src: 'assets/lagu/lagu2.mp3', title: 'Npaba', artist: 'ooes', cover: 'assets/cover/cover2.jpg' },
    { src: 'assets/lagu/lagu3.mp3', title: 'Night\'s like this', artist: 'the kid laroi', cover: 'assets/cover/cover3.jpg' },
    { src: 'assets/lagu/lagu4.mp3', title: 'Look after you', artist: 'the fray', cover: 'assets/cover/cover4.jpg' },
    { src: 'assets/lagu/lagu5.mp3', title: 'Reflections', artist: 'the neighborhood', cover: 'assets/cover/cover5.jpg' }
];

let currentSongIndex = 0; 

function toggleMusic() {
    if (audio.paused) { 
        audio.play().catch(() => {}); 
        playPauseBtn.innerText = '⏸'; 
    } else { 
        audio.pause(); 
        playPauseBtn.innerText = '▶'; 
    }
}

function changeSong(songSrc, songTitle, songArtist, coverSrc) {
    audio.src = songSrc; 
    document.getElementById('player-title').innerText = songTitle;
    document.getElementById('player-artist').innerText = songArtist;
    document.getElementById('player-cover').src = coverSrc; 
    
    const foundIndex = playlist.findIndex(song => song.src === songSrc);
    if (foundIndex !== -1) {
        currentSongIndex = foundIndex;
    }

    audio.play().catch(() => {});
    playPauseBtn.innerText = '⏸';
}

function nextSong() {
    currentSongIndex++;
    if (currentSongIndex >= playlist.length) {
        currentSongIndex = 0; 
    }
    let next = playlist[currentSongIndex];
    changeSong(next.src, next.title, next.artist, next.cover);
}

function prevSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = playlist.length - 1; 
    }
    let prev = playlist[currentSongIndex];
    changeSong(prev.src, prev.title, prev.artist, prev.cover);
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    if (sec < 10) sec = '0' + sec;
    return `${min}:${sec}`;
}

let isSeeking = false;

if (seekBar) { 
    seekBar.addEventListener('mousedown', () => { isSeeking = true; });
    seekBar.addEventListener('touchstart', () => { isSeeking = true; });

    seekBar.addEventListener('input', () => {
        if (audio.duration) {
            const seekTime = (seekBar.value / 100) * audio.duration;
            if (currentTimeDisplay) {
                currentTimeDisplay.innerText = formatTime(seekTime);
            }
        }
    });

    const finishSeek = () => {
        if (isSeeking && audio.duration) {
            const seekTime = (seekBar.value / 100) * audio.duration;
            audio.currentTime = seekTime;
        }
        isSeeking = false;
    };

    seekBar.addEventListener('change', finishSeek);
    seekBar.addEventListener('mouseup', finishSeek);
    seekBar.addEventListener('touchend', finishSeek);
}

audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        if (seekBar && !isSeeking) {
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            seekBar.value = progressPercent;
        }
        
        if (currentTimeDisplay) {
            currentTimeDisplay.innerText = formatTime(audio.currentTime);
        }
        
        if (durationDisplay && !isNaN(audio.duration)) {
            durationDisplay.innerText = formatTime(audio.duration);
        }
    }
});

audio.addEventListener('loadedmetadata', () => {
    if (durationDisplay) {
        durationDisplay.innerText = formatTime(audio.duration);
    }
});

audio.addEventListener('pause', () => playPauseBtn.innerText = '▶');
audio.addEventListener('play', () => playPauseBtn.innerText = '⏸');
audio.addEventListener('ended', nextSong);

const petalsContainer = document.getElementById('petals-container');
if (petalsContainer) {
    for (let i = 0; i < 35; i++) {
        let petal = document.createElement('div');
        petal.classList.add('petal');
        let size = Math.random() * 8 + 6; 
        petal.style.width = size + 'px'; 
        petal.style.height = size + 'px';
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.animationDuration = Math.random() * 6 + 6 + 's';
        petal.style.animationDelay = Math.random() * 7 + 's';
        petalsContainer.appendChild(petal);
    }
}

function createBurst() {
    const emojis = ['🌸', '🌺', '🌹', '✨', '💖'];
    const container = document.getElementById('cover-screen');
    if (!container) return;

    for (let i = 0; i < 15; i++) {
        let flower = document.createElement('div');
        flower.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        flower.classList.add('burst-flower');
        flower.style.left = '50%'; 
        flower.style.top = '50%';
        container.appendChild(flower);
        setTimeout(() => {
            const angle = Math.random() * Math.PI * 2;
            const velocity = 100 + Math.random() * 150;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;
            flower.style.transform = `translate(${tx}px, ${ty}px) rotate(${Math.random() * 360}deg) scale(${0.5 + Math.random()})`;
            flower.style.opacity = '1';
        }, 10);
    }
}

let isGiftOpened = false;
const popupOverlay = document.getElementById('popup-overlay');
const popupBox = document.getElementById('popup-box');
const btnNo = document.getElementById('btn-no');

function showPopup() {
    if (isGiftOpened) return;
    if (popupOverlay) {
        popupOverlay.classList.remove('hidden');
        popupOverlay.classList.add('show');
        const coverScreen = document.getElementById('cover-screen');
        if (coverScreen) coverScreen.onclick = null;
    } else {
        executeOpenGift();
    }
}

function confirmOpenGift() {
    if (popupOverlay) popupOverlay.classList.remove('show');
    executeOpenGift();
}

function moveButton(e) {
    if (!btnNo || !popupBox) return;
    btnNo.style.position = 'absolute';
    
    const boxWidth = popupBox.clientWidth;
    const boxHeight = popupBox.clientHeight;
    const btnWidth = btnNo.clientWidth;
    const btnHeight = btnNo.clientHeight;

    const maxX = Math.max(0, boxWidth - btnWidth - 20);
    const maxY = Math.max(0, boxHeight - btnHeight - 20);

    const randomX = Math.floor(Math.random() * maxX) + 10;
    const randomY = Math.floor(Math.random() * maxY) + 10;

    btnNo.style.left = `${randomX}px`;
    btnNo.style.top = `${randomY}px`;
}

if (btnNo) {
    btnNo.addEventListener('click', (e) => {
        e.preventDefault();
        moveButton();
    });
    btnNo.addEventListener('mouseover', moveButton);
}

function executeOpenGift() {
    if (isGiftOpened) return;
    isGiftOpened = true;

    const firstSong = playlist[0];
    changeSong(firstSong.src, firstSong.title, firstSong.artist, firstSong.cover);

    const giftIcon = document.getElementById('gift-icon');
    const tapText = document.getElementById('tap-text');
    if (giftIcon) giftIcon.style.display = 'none';
    if (tapText) tapText.style.display = 'none';
    
    createBurst(); 
    
    let coverScreen = document.getElementById('cover-screen');
    if (coverScreen) {
        setTimeout(() => {
            coverScreen.style.opacity = '0';
            setTimeout(() => {
                coverScreen.style.display = 'none';
                let mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.style.display = 'block';
                    setTimeout(() => { mainContent.style.opacity = '1'; }, 50);
                }
            }, 1000);
        }, 800);
    }
}

function nextSection(btn) {
    const currentSection = btn.closest('section');
    const nextSec = currentSection ? currentSection.nextElementSibling : null;
    
    if (nextSec && nextSec.tagName === 'SECTION') {
        nextSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

const observerOptions = { root: null, rootMargin: '0px', threshold: 0.2 };
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        } else {
            entry.target.classList.remove('in-view');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(sec => {
    sectionObserver.observe(sec);
});