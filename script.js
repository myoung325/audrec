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

// Function to initialize MediaRecorder for .webm format
function startMediaRecorder(stream) {
  // Create a MediaRecorder instance with the MIME type 'audio/webm'
  const options = { mimeType: 'audio/webm' };

  // Check if MediaRecorder supports the specified MIME type
  if (MediaRecorder.isTypeSupported(options.mimeType)) {
    mediaRecorder = new MediaRecorder(stream, options);
  } else {
    console.error("The MIME type 'audio/webm' is not supported in your browser.");
    return;
  }

  mediaRecorder.start();

  // Change Record button style when recording starts
  recordButton.style.backgroundColor = 'red';  // Change to red when recording
  recordButton.style.color = 'white';  // Make text white when recording

  recordButton.disabled = true;
  stopButton.disabled = false;

  mediaRecorder.ondataavailable = event => {
    audioChunks.push(event.data);
  };

  mediaRecorder.onstop = () => {
    const audioBlob = new Blob(audioChunks, { type: mediaRecorder.mimeType }); // Use the mimeType from mediaRecorder
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
      a.download = clipLabel.textContent || "MyUnnamedClip.webm";
      a.click();
    });

    // Reset the Record button color and state after the recording ends
    recordButton.style.backgroundColor = '';  // Reset to original color
    recordButton.style.color = '';  // Reset text color

    // Re-enable the buttons after recording
    recordButton.disabled = false;
    stopButton.disabled = true;
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
