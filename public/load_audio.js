var audio_files = [
  "audio_files/pop.mp3",
  "audio_files/hiphop.mp3",
  "audio_files/latino.mp3",
  "audio_files/edm.mp3",
  "audio_files/kpop.mp3",
  "audio_files/classical.mp3",
  "audio_files/jazz.mp3",
  "audio_files/metal.mp3"
];

function loadAudioFiles(){
  for (var i = 0 ; i < audio_files.length; i++){
    var audio = new Audio();
    audio.addEventListener('canplaythrough', loadedAudio, false);
    audio.src = audio_files[i];
  }
}

var loaded = 0;
function loadedAudio(){
  loaded++;
  if (loaded == audio_files.length) {
    console.log("all audio files loaded");
  }
}
