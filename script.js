const playlistSongs = document.getElementById("playlist-songs");
const previousBtn = document.getElementById("previous");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const pauseBtn = document.getElementById("pause");
const shuffleBtn = document.getElementById("shuffle");

const allSongs = [
  {
    id: 0,
    title: "Scratching The Surface",
    artist: "Quincy Larson",
    duration: "4:25",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/scratching-the-surface.mp3",
  },
  {
    id: 1,
    title: "Can't Stay Down",
    artist: "Quincy Larson",
    duration: "4:15",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/can't-stay-down.mp3",
  },
  {
    id: 2,
    title: "Still Learning",
    artist: "Quincy Larson",
    duration: "3:51",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/still-learning.mp3",
  },
  {
    id: 3,
    title: "Cruising for a Musing",
    artist: "Quincy Larson",
    duration: "3:34",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/cruising-for-a-musing.mp3",
  },
  {
    id: 4,
    title: "Never Not Favored",
    artist: "Quincy Larson",
    duration: "3:35",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/never-not-favored.mp3",
  },
  {
    id: 5,
    title: "From the Ground Up",
    artist: "Quincy Larson",
    duration: "3:12",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/from-the-ground-up.mp3",
  },
  {
    id: 6,
    title: "Walking on Air",
    artist: "Quincy Larson",
    duration: "3:25",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/walking-on-air.mp3",
  },
  {
    id: 7,
    title: "Can't Stop Me. Can't Even Slow Me Down.",
    artist: "Quincy Larson",
    duration: "3:52",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/cant-stop-me-cant-even-slow-me-down.mp3",
  },
  {
    id: 8,
    title: "The Surest Way Out is Through",
    artist: "Quincy Larson",
    duration: "3:10",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/the-surest-way-out-is-through.mp3",
  },
  {
    id: 9,
    title: "Chasing That Feeling",
    artist: "Quincy Larson",
    duration: "2:43",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/chasing-that-feeling.mp3",
  },
];

const audio = new Audio();

let userData = {
    songs: [...allSongs],
    currentSong: null,
    songCurrentTime: 0
};

const getCurrentSongIndex = () => userData?.songs.indexOf(userData?.currentSong);

const sortSong = () => {
    userData?.songs.sort((a, b) => {
        if (a.title < b.title) {
            return -1;
        } else if (a.title > b.title) {
            return 1;
        } else {
            return 0;
        }
    });
    return userData?.songs;
};

const playSong = (id) => {
    const song = userData?.songs.find((song) => song.id === id);
    audio.src = song.src;
    audio.title = song.title;

    if (userData?.currentSong === null || userData?.currentSong.id !== song.id) {
        audio.currentTime = 0;
    } else {
        audio.currentTime = userData?.songCurrentTime;
    }
    userData.currentSong = song;
    playBtn.classList.add("playing");
    playBtn.setAttribute("aria-label", song?.title ? `Pause ${song.title}` : "Pause");

    highlightCurrentSong();
    setPlayerDisplay();
    setPlayButtonAccessibleText();
    audio.play();
};

const pauseSong = () => {
    userData.songCurrentTime = audio.currentTime;

    playBtn.classList.remove("playing");
    playBtn.setAttribute("aria-label", userData?.currentSong?.title ? `Play ${userData.currentSong.title}` : "Play");

    audio.pause();
};

const playNextSong = () => {
    if (userData?.currentSong === null) {
        playSong(userData?.songs[0].id);
        return;
    }
    let currentSongIndex = getCurrentSongIndex();
    if (currentSongIndex < userData?.songs.length - 1) {
        const nextSong = userData?.songs[currentSongIndex + 1];

        playSong(nextSong.id);
    } else {
        playSong(userData?.songs[0].id);
    }
};

const playPrevSong = () => {
    if (userData?.currentSong === null) {
        return;
    }
    let currentSongIndex = getCurrentSongIndex();
    if (currentSongIndex > 0) {
        const prevSong = userData?.songs[currentSongIndex - 1];

        playSong(prevSong.id);
    } else {
        playSong(userData?.songs[0].id);
    }
};

const shuffle = () => {
    const songs = userData?.songs;
    const currentSong = userData?.currentSong;
    if (!songs || songs.length === 0) return;
    const wasPlaying = !audio.paused;
    const lastTime = audio.currentTime;

    for (let i = songs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [songs[i], songs[j] = songs[j], songs[i]];
    }

    if (currentSong) {
        const currentIndex = getCurrentSongIndex();

        if (currentIndex > -1) {
            const current = songs.splice(currentIndex, 1)[0];
            songs.unshift(current);
        }
    }

    renderSongs(songs);
    highlightCurrentSong();
    setPlayerDisplay();
    setPlayButtonAccessibleText();

    if (currentSong) {
        audio.src = currentSong.src;
        audio.title = currentSong.title;
        audio.currentTime = lastTime;

        if (wasPlaying) {
            audio.play();
        } else {
            audio.pause();
        }
    }
};

const deleteSong = (id) => {
    if (userData?.currentSong?.id === id) {
        userData.currentSong = null;
        userData.songCurrentTime = 0;

        pauseSong();
        setPlayerDisplay();
    }

    userData.songs = userData?.songs.filter((song) => song.id !== id);

    renderSongs(userData?.songs);
    highlightCurrentSong();
    setPlayButtonAccessibleText();
}

const highlightCurrentSong = () => {
    const playlistSongElement = document.querySelectorAll(".playlist-song");
    const songToHighlight = document.getElementById(`song-${userData?.currentSong?.id}`);

    playlistSongElement.forEach((songEl) => songEl.removeAttribute("aria-current"));
    if (songToHighlight) songToHighlight.setAttribute("aria-current", "true");
};

const setPlayerDisplay = () => {
    const playingSong = document.getElementById("player-song-title");
    const songArtist = document.getElementById("player-song-artist");
    const seekBar = document.getElementById("seek-bar");
    const currentTimeEl = document.getElementById("current-time");
    const totalTimeEl = document.getElementById("total-time");

    const currentTitle = userData?.currentSong?.title;
    const currentArtist = userData?.currentSong?.artist;

    playingSong.textContent = currentTitle || "";
    songArtist.textContent = currentArtist || "";

    if (!seekBar || !audio) return;

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    seekBar.value = 0;
    currentTimeEl.textContent = "0:00";
    totalTimeEl.textContent = "0:00";

    if (!seekBar.dataset.eventBound) {
        audio.addEventListener("loadedmetadata", () => {
            seekBar.max = audio.duration || 0;
            totalTimeEl.textContent = formatTime(audio.duration);
        });

        audio.addEventListener("timeupdate", () => {
            seekBar.value = audio.currentTime;
            currentTimeEl.textContent = formatTime(audio.currentTime);
        });

        seekBar.addEventListener("input", () => {
            audio.currentTime = seekBar.value;
        });

        seekBar.dataset.eventBound = "true";
    }
};

const setPlayButtonAccessibleText = () => {
    const song = userData?.currentSong || userData?.songs[0];
    const isPlaying = playBtn.classList.contains("playing");  // Checks visual state (or swap to !audio.paused)

    playBtn.setAttribute("aria-label", song?.title 
        ? (isPlaying ? `Pause ${song.title}` : `Play ${song.title}`) 
        : (isPlaying ? "Pause" : "Play")
    );
};

const renderSongs = (array) => {
    const songsHTML = array
    .map((song)=> {
        return `
        <li id="song-${song.id}" class="playlist-song">
        <button class="playlist-song-info" onclick="playSong(${song.id})">
            <span class="playlist-song-title">${song.title}</span>
            <span class="playlist-song-artist">${song.artist}</span>
            <span class="playlist-song-duration">${song.duration}</span>
        </button>
        <button class="playlist-song-delete" onclick="deleteSong(${song.id})" aria-label="Delete ${song.title}">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#4d4d62"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.32587 5.18571C5.7107 4.90301 6.28333 4.94814 6.60485 5.28651L8 6.75478L9.39515 5.28651C9.71667 4.94814 10.2893 4.90301 10.6741 5.18571C11.059 5.4684 11.1103 5.97188 10.7888 6.31026L9.1832 7.99999L10.7888 9.68974C11.1103 10.0281 11.059 10.5316 10.6741 10.8143C10.2893 11.097 9.71667 11.0519 9.39515 10.7135L8 9.24521L6.60485 10.7135C6.28333 11.0519 5.7107 11.097 5.32587 10.8143C4.94102 10.5316 4.88969 10.0281 5.21121 9.68974L6.8168 7.99999L5.21122 6.31026C4.8897 5.97188 4.94102 5.4684 5.32587 5.18571Z" fill="white"/></svg>
        </button>
        </li>
        `;
    })
    .join("");

    playlistSongs.innerHTML = songsHTML;

    if (userData?.songs.length === 0) {
        const resetButton = document.createElement("button");
        const resetText = document.createTextNode("Reset Playlist");

        resetButton.id = "reset";
        resetButton.setAttribute("aria-label", "Reset Playlist");
        resetButton.appendChild(resetText);
        playlistSongs.appendChild(resetButton);

        resetButton.addEventListener("click", () => {
            userData.songs = [...allSongs];
            
            renderSongs(sortSong());
            setPlayButtonAccessibleText();
        });
    };
};

playBtn.addEventListener("click", () => {
    if (userData?.currentSong === null) {
        playSong(userData?.songs[0].id);
    } else {
        playSong(userData?.currentSong.id);
    }
});

pauseBtn.addEventListener("click", pauseSong);

nextBtn.addEventListener("click", playNextSong);

previousBtn.addEventListener("click", playPrevSong);

shuffleBtn.addEventListener("click", shuffle);

audio.addEventListener("ended", () => {
    const currentSongIndex = getCurrentSongIndex();
    const songExhists = userData?.songs[currentSongIndex + 1] !== undefined;

    if (songExhists) {
        playNextSong();
    } else {
        userData.currentSong = null;
        userData.songCurrentTime = 0;

        pauseSong();
        highlightCurrentSong();
        setPlayerDisplay();
        setPlayButtonAccessibleText();

    }
});

renderSongs(sortSong());

setPlayButtonAccessibleText();