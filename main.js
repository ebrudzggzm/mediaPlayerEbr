//control buttons
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const repeatButton = document.getElementById("repeat");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const shuffleButton = document.getElementById("shuffle");

//audio
const audio = document.getElementById("audio");
const songImage = document.getElementById("image");
const songName = document.getElementById("songName");
const songArtist = document.getElementById("singerName");

//playlist listeyi açma butonu
const playListButton = document.getElementById("listIcon");

//time
const currentTimeRef = document.getElementById("current-time");
const maxDuration = document.getElementById("max-duration");

//progressBar

const progressBar = document.getElementById("progress-bar");
const playListContainer = document.getElementById("playlist-container");
const currentProgress = document.getElementById("current-progress");

const closeButton= document.getElementById('close-button')
const playListSongs = document.getElementById("playlist-songs");

//şarkı sırası
let index;

//dongu durumu ,true şarkı bittiğinde başa sarsın
let loop = true;

const songLists = [
  {
    name: "Aramam",
    link: "assests/aramam.mp3",
    artist: "İbrahim Tatlıses",
    image: "assests/aramamImage.jpg",
  },
  {
    name: "Lose Control",
    link: "assests/loseControl.m4a",
    artist: "Teddy Will",
    image: "assests/teddy.jpg",
  },
];

//zaman düzenleme
const timeFormatter = (timeInput) => {
  let minute = Math.floor(timeInput / 60);
  minute = minute < 10 ? "0" + minute : minute;
  let second = Math.floor(timeInput % 60);
  second = second < 10 ? "0" + second : second;
  return `${minute}:${second}`;
};

//sarki atama
const setSong = (arrayIndex) => {
  let { name, link, artist, image } = songLists[arrayIndex];
  // let name1 = songLists[arrayIndex].name;  yerine
  // name1 i kullanmak yerine, şarkı listesindeki elemanları setSong da tüm verileriyle atamış olduk.
  audio.src = link;
  songArtist.innerHTML = artist;
  songName.innerHTML = name;
  songImage.src = image;

  audio.onloadeddata = () => {
    maxDuration.innerHTML = timeFormatter(audio.duration);
  };
  playListContainer.classList.add("hide");
  //playAudio()
};

//sesi oynat
const playAudio = () => {
  audio.play();
  pauseButton.classList.remove("hide");
  playButton.classList.add("hide");
};

//ses ilerlemesi
progressBar.addEventListener("click", (event) => {
  let start = progressBar.getBoundingClientRect().left;
  let end = event.clientX;
  let progress = (end - start) / progressBar.offsetWidth;
  console.log(progressBar.offsetWidth);
  currentProgress.style.width = progress * 100 + "%";

  audio.currentTime = progress * audio.duration;
  console.log(audio.currentTime);
});

//currentTimeRef id li elemente tıklandığı yerdeki zaman değrini verme
setInterval(() => {
  currentTimeRef.innerHTML = timeFormatter(audio.currentTime);
  currentProgress.style.width =
    (audio.currentTime / audio.duration.toFixed(3)) * 100 + "%";
}, 1000);

//sonraki şarkı
const nextSong = () => {
  if (loop) {
    pauseAudio();
    if (index == songLists.length - 1) {
      index = 0;
    } else {
      index = index + 1;
    }
    setSong(index);
  } else {
    let randomIndex = Math.floor(Math.random() * songLists.length);
    setSong(randomIndex);
  }
};
//önceki şarkı
const prevSong = () => {
  if (index > 0) {
    pauseAudio();
    index -= 1;
  } else {
    index = songLists.length - 1;
  }
  setSong(index);
};
//şarkıyı durdur
const pauseAudio = () => {
  audio.pause();
  pauseButton.classList.add("hide");
  playButton.classList.remove("hide");
};

//şarkı listesini oluştur
const initializePlaylist = () => {  
  for (let i in songLists) {
    playListSongs.innerHTML += `  
    <li class="playlistSong" onclick="setSong(${i})">
    <div class="playlist-image-container">
    <img src="${songLists[i].image}"/>
</div>
<div class="playlist-song-details">
    <span id="playlist-song-name">${songLists[i].name}</span>
    <span id="playlist-song-artist-album">${songLists[i].artist}</span>
</div>
    </li>
       `;
  }
};

//ekran yüklendiğinde
window.onload = () => {
  index = 0;
  setSong(index);
  initializePlaylist();
};

//play butonuna tıklandığında playAudio yu çağır
playButton.addEventListener("click", playAudio);

//next button
nextButton.addEventListener("click", nextSong);

//prev buttoncloseButtonhide
prevButton.addEventListener("click", prevSong);

//pause butonuna tıklandığında
pauseButton.addEventListener("click", pauseAudio);

//şarkı listesini aç
playListButton.addEventListener("click", () => {
  playListContainer.classList.remove("hide");
});

//şarkı listesini kapat
closeButton.addEventListener("click", () => {
  playListContainer.classList.add("hide");
});

//şarkı bittiğinde sonraki şarkıya geç
audio.onended = () => {
  nextSong();
};

//repeat butonu
repeatButton.addEventListener("click", () => {
  if (repeatButton.classList.contains("active")) {
    repeatButton.classList.remove("active");
    audio.loop = false;
  } else {
    repeatButton.classList.add("active");
    audio.loop = true;
  }
});

//shuffle buton ile karıştırıcıyı aç
shuffleButton.addEventListener("click", () => {
  if (shuffleButton.classList.contains("active")) {
    shuffleButton.classList.remove("active");
    audio.loop = true;
  } else {
    shuffleButton.classList.add("active");
    audio.loop = false;
  }
});
