// Get elements from the DOM
const recordButton = document.getElementById("record");
const stopButton = document.getElementById("stop");
const audioPlayer = document.getElementById("audio-player");
const downloadButton = document.getElementById("download");

// Variables for audio recording
let mediaRecorder;
let audioChunks = [];

// Start recording
recordButton.addEventListener("click", () => {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();

      recordButton.disabled = true;
      stopButton.disabled = false;

      mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        audioPlayer.src = audioUrl;
        downloadButton.disabled = false;

        // Enable the download button with a download link
        downloadButton.addEventListener("click", () => {
          const a = document.createElement("a");
          a.href = audioUrl;
          a.download = "recording.wav";
          a.click();
        });
      };
    })
    .catch(error => console.error("Error accessing media devices.", error));
});

// Stop recording
stopButton.addEventListener("click", () => {
  mediaRecorder.stop();
  recordButton.disabled = false;
  stopButton.disabled = true;
});
