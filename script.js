let songs = []
let currentSong = new Audio()

// format time
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00"
    let min = Math.floor(seconds / 60)
    let sec = Math.floor(seconds % 60)
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
}

// GET SONGS (folder ke mutabiq)
async function getSongs() {
    songs = [
        {
            title: "Song 1",
            subtitle: "EDM Remixes Vol. 3",
            image: "songs/song1/cover.jpg",
            track: "songs/song1/song.mp3"
        },
        {
            title: "Song 2",
            subtitle: "Lo-fi beats",
            image: "songs/song2/cover.jpg",
            track: "songs/song2/song.mp3"
        },
        {
            title: "Song 3",
            subtitle: "Late-night mood",
            image: "songs/song3/cover.jpg",
            track: "songs/song3/song.mp3"
        },
        {
            title: "Song 4",
            subtitle: "Diljit Singh",
            image: "songs/song4/cover.jpg",
            track: "songs/song4/song.mp3"
        }
    ]
}

// PLAY SONG
function playMusic(track) {
    currentSong.src = track
    currentSong.play()
    document.querySelector("#play").src = "pause.svg"
}

// SHOW PLAYLIST CARDS
function showPlaylistCards() {
    const cardContainer = document.querySelector(".cardContainer")
    if (!cardContainer) return

    cardContainer.innerHTML = songs.map(item => `
        <div class="card">
            <img src="${item.image}" alt="${item.title}">
            <h4>${item.title}</h4>
            <p>${item.subtitle}</p>
            <div class="play" onclick="playMusic('${item.track}')">
                <img src="play.svg" alt="Play">
            </div>
        </div>
    `).join("")
}

// SHOW SONG LIST (sidebar)
function showSongs() {
    let ul = document.querySelector(".songList ul")
    ul.innerHTML = ""

    songs.forEach((song, index) => {
        ul.innerHTML += `
            <li style="cursor:pointer">${song.title}</li>
        `
    })

    // click event add
    Array.from(document.querySelectorAll(".songList li")).forEach((li, index) => {
        li.addEventListener("click", () => {
            playMusic(songs[index].track)
        })
    })
}

// MAIN FUNCTION
async function main() {
    await getSongs()
    showPlaylistCards()
    showSongs()

    // play/pause
    document.querySelector("#play").addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            document.querySelector("#play").src = "pause.svg"
        } else {
            currentSong.pause()
            document.querySelector("#play").src = "play.svg"
        }
    })

    // next
    document.querySelector("#next").addEventListener("click", () => {
        let index = songs.findIndex(s => s.track === currentSong.src.split("/").slice(-2).join("/"))
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1].track)
        }
    })

    // previous
    document.querySelector("#previous").addEventListener("click", () => {
        let index = songs.findIndex(s => s.track === currentSong.src.split("/").slice(-2).join("/"))
        if (index - 1 >= 0) {
            playMusic(songs[index - 1].track)
        }
    })

    // seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        const rect = e.currentTarget.getBoundingClientRect()
        const offsetX = e.clientX - rect.left
        const width = rect.width || 1
        let percent = (offsetX / width) * 100
        percent = Math.max(0, Math.min(100, percent))
        document.querySelector(".circle").style.left = percent + "%"
        if (isFinite(currentSong.duration) && currentSong.duration > 0) {
            currentSong.currentTime = (currentSong.duration * percent) / 100
        }
    })

    // time update
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML =
            `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
    })

    // volume
    document.querySelector(".range input").addEventListener("input", (e) => {
        currentSong.volume = e.target.value / 100
    })

    // hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })
}



main()
