const recBtn = document.getElementById("recordBtn");
let audio;
recordBtn.addEventListener("click", handleAudioRec);

var mediaRecorder;

function requestAudioPermission() {
    return navigator.mediaDevices.getUserMedia({ audio: true });
}

function startRecording() {
    mediaRecorder.start();
}

function stopRecording() {
    mediaRecorder.stop();
}

function uploadAudio(blob) {
    // Code to upload blob to the server
    // Example using fetch API:
    /*
    var formData = new FormData();
    formData.append('audio', blob);
  
    fetch('/upload-audio', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      // Handle response
    })
    .catch(error => {
      console.error('Error:', error);
    });
    */
}

let permission = false;
requestAudioPermission()
    .then(function (stream) {
        permission = true;
        mediaRecorder = new MediaRecorder(stream);
        var chunks = [];

        mediaRecorder.ondataavailable = function (e) {
            chunks.push(e.data);
        };

        mediaRecorder.onstop = (e) => {
            if (!audio) {
                audio = document.createElement("audio");
                audio.style.display = "none";
                audio.setAttribute("controls", "");
                document.body.appendChild(audio);
                console.log("created");
            }

            const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
            chunks = [];
            const audioURL = window.URL.createObjectURL(blob);
            audio.src = audioURL;
        };

    })
    .catch(function (err) {
        if (err.name === 'NotAllowedError') {
            console.log('User denied audio permission');
        } else {
            console.log('The following error occurred: ' + err);
        }
    });

let isRec = false;
function handleAudioRec() {
    if (!permission) {
        return;
    }
    if (!isRec) {
        isRec = true;
        startRecording();
    } else {
        isRec = false;
        stopRecording();
    }
}
