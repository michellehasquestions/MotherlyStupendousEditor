document.getElementById("loadButton").addEventListener("click", function() {
  document.getElementById("input").click();
});

function handleClick0() {
  document.getElementById("input").click(); // Click the file input button
  handleFileSelect = function(evt) { // Override the handleFileSelect function
    var files = evt.target.files; // FileList object

    // Loop through the FileList and read the contents of each file
    for (var i = 0, f; f = files[i]; i++) {

      // Only process audio files
      if (!f.type.match('audio.*')) {
        continue;
      }

      var reader = new FileReader();

      // Closure to capture the file information
      reader.onload = (function(theFile) {
        return function(e) {
          // Create an Audio object with a dummy name
          let audioName = 'audio_1';
          let audio = new Audio(e.target.result);
          audios[audioName] = audio;
          fileIndex++;
          
          // Connect the audio source to the AnalyserNode
          let source = audioCtx.createMediaElementSource(audio);
          source.connect(analyser);
          analyser.connect(audioCtx.destination);
        };
      })(f);

      // Read the contents of the file as a data URL
      reader.readAsDataURL(f);
    }
    
    // Clear the input element so the user can load another file
    evt.target.value = '';

    // Set the audio variable to the corresponding element in the audios object
    let audio = audios["audio_1"];
  };
}

// Eh idk if that stuff up there is right

$(function() {
  $(".dial").knob({
    'min':-100,
    'max':100,
    'angleOffset': -135,
    'angleArc': 270,
    'readOnly': true,
    'cursor': true,
    'thickness': 0.4,
    'lineCap': 'round'
  });
});

function handleClick1() {
  // Code to handle button 1 click
}
 
function handleClick2() {
  // Code to handle button 2 click
}

function handleClick3() {
  // Code to handle button 3 click
}

// Code for the audio visualizer
let audioCtx = new AudioContext();
let analyser = audioCtx.createAnalyser();

let fileIndex = 1; // Start the file index at 1

function handleFileSelect(evt) {
  var files = evt.target.files; // FileList object

  // Loop through the FileList and read the contents of each file
  for (var i = 0, f; f = files[i]; i++) {

    // Only process audio files
    if (!f.type.match('audio.*')) {
      continue;
    }

    var reader = new FileReader();

    // Closure to capture the file information
    reader.onload = (function(theFile) {
      return function(e) {
        // Create an Audio object with a dummy name
        let audioName = 'audio_' + fileIndex;
        let audio = new Audio(e.target.result);
        audios[audioName] = audio;
        fileIndex++;
        
        // Connect the audio source to the AnalyserNode
        let source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
      };
    })(f);

    // Read the contents of the file as a data URL
    reader.readAsDataURL(f);
  }
  
  // Clear the input element so the user can load another file
  evt.target.value = '';
}
//let audio = new Audio("song.mp3"); // Replace with your own audio file
let audio = audios["audio_1"];
let source = audioCtx.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(audioCtx.destination);
analyser.fftSize = 2048; // The frequency data size
analyser.smoothingTimeConstant = 0.8; // The smoothing time constant

let canvas = document.getElementById("visualizer");
let canvasCtx = canvas.getContext("2d");
let bufferLength = analyser.frequencyBinCount;
let dataArray = new Uint8Array(bufferLength);

function drawVisualizer() {
  requestAnimationFrame(drawVisualizer);
  
  analyser.getByteFrequencyData(dataArray);
  
  canvasCtx.fillStyle = 'rgb(0, 0, 0)';
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
  
  let barWidth = (canvas.width / bufferLength) * 2.5;  
  let barHeight;
  let x = 0;
  
  for(let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i];
    
    canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
    canvasCtx.fillRect(x,canvas.height-barHeight/2,barWidth,barHeight/2);
    
    x += barWidth + 1;
  }
}

drawVisualizer();