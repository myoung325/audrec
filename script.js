// Get elements from the DOM
const recordButton = document.getElementById("record");
const stopButton = document.getElementById("stop");
const soundClipsContainer = document.querySelector(".sound-clips");

// Variables for audio recording
let mediaRecorder;
let audioChunks = [];
let mediaStream; // Store the media stream globally to avoid asking for permission again

// Function to start recording
function startRecording() {
  // Clear the audioChunks array for each new recording
  audioChunks = [];

  if (mediaStream) {
    // If we already have a media stream, use it
    startMediaRecorder(mediaStream);
  } else {
    // If no media stream exists, request permission
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaStream = stream; // Store the stream globally
        startMediaRecorder(stream);
      })
      .catch(error => console.error("Error accessing media devices.", error));
  }
}

// Function to initialize MediaRecorder
function startMediaRecorder(stream) {
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

    // Create a new clip container for the recording
    const clipContainer = document.createElement("article");
    clipContainer.classList.add("clip");

    const audioElement = document.createElement("audio");
    audioElement.setAttribute("controls", "");
    audioElement.src = audioUrl;

    const clipName = prompt("Enter a name for your sound clip:", "My unnamed clip");
    const clipLabel = document.createElement("p");
    clipLabel.textContent = clipName ? clipName : "My unnamed clip";

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete");

    const downloadButton = document.createElement("button");
    downloadButton.textContent = "Download";
    downloadButton.classList.add("download");

    // Append the audio and buttons to the clip container
    buttonContainer.appendChild(deleteButton);
    buttonContainer.appendChild(downloadButton);

    clipContainer.appendChild(audioElement);
    clipContainer.appendChild(clipLabel);
    clipContainer.appendChild(buttonContainer);

    soundClipsContainer.appendChild(clipContainer);

    // Delete button action
    deleteButton.addEventListener("click", () => {
      clipContainer.remove();
    });

    // Download button action
    downloadButton.addEventListener("click", () => {
      const a = document.createElement("a");
      a.href = audioUrl;
      a.download = clipLabel.textContent || "MyUnnamedClip";
      a.click();
    });
  };
}

// Start recording
recordButton.addEventListener("click", startRecording);

// Stop recording
stopButton.addEventListener("click", () => {
  mediaRecorder.stop();
  recordButton.disabled = false;
  stopButton.disabled = true;
});
