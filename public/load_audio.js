var audio_files = [
  "audio_files/pop.webm",
  "audio_files/hiphop.webm",
  "audio_files/latino.webm",
  "audio_files/edm.webm",
  "audio_files/kpop.webm",
  "audio_files/classical.webm",
  "audio_files/jazz.webm",
  "audio_files/metal.webm"
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
