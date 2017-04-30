var audio_files = [
  "audio_files/hans.webm",
  "audio_files/beyonce.webm"
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
  console.log(loaded);
  if (loaded == audio_files.length) {
    console.log("all audio files loaded");
  }
}
