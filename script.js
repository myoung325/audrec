// Get the container for sound clips
const soundClips = document.querySelector(".sound-clips");

// Inside the 'onSuccess' function, define the chunks and mediaRecorder only once
let chunks = [];
let mediaRecorder;

let onSuccess = function (stream) {
  // Create a MediaRecorder instance and initialize the visualizer here
  mediaRecorder = new MediaRecorder(stream);

  // Visualizer setup
  visualize(stream);

  // When the user starts recording, clear old clips and start recording
  record.onclick = function () {
    // Clear any existing sound clips before starting a new one
    soundClips.innerHTML = '';  // Clears all the previous clips

    // Start the recorder
    mediaRecorder.start();
    console.log(mediaRecorder.state);
    console.log("Recorder started.");
    record.style.background = "red";  // Indicate recording state
    record.disabled = true;  // Disable the record button while recording
    stop.disabled = false;  // Enable the stop button
  };

  // Stop the recording and handle the stop event
  stop.onclick = function () {
    mediaRecorder.stop();
    console.log(mediaRecorder.state);
    console.log("Recorder stopped.");

    // Reset buttons and UI after stopping the recording
    record.style.background = "";
    record.style.color = "";
    stop.disabled = true;
    record.disabled = false;
  };

  // Handle the data when the recorder stops
  mediaRecorder.onstop = function () {
    console.log("Last data to read (after MediaRecorder.stop() called).");

    const clipName = prompt("Enter a name for your sound clip?", "My unnamed clip");

    // Create the container for the new clip
    const clipContainer = document.createElement("article");
    const clipLabel = document.createElement("p");
    const audio = document.createElement("audio");
    const deleteButton = document.createElement("button");

    clipContainer.classList.add("clip");
    audio.setAttribute("controls", "");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete";

    clipLabel.textContent = clipName === null ? "My unnamed clip" : clipName;

    clipContainer.appendChild(audio);
    clipContainer.appendChild(clipLabel);
    clipContainer.appendChild(deleteButton);
    soundClips.appendChild(clipContainer);

    const blob = new Blob(chunks, { type: mediaRecorder.mimeType });
    chunks = [];  // Reset the chunks for the next recording
    const audioURL = window.URL.createObjectURL(blob);
    audio.src = audioURL;
    console.log("Recorder stopped");

    // Set the delete button action
    deleteButton.onclick = function (e) {
      e.target.closest(".clip").remove();
    };

    // Clip label click to rename the clip
    clipLabel.onclick = function () {
      const existingName = clipLabel.textContent;
      const newClipName = prompt("Enter a new name for your sound clip?");
      clipLabel.textContent = newClipName === null ? existingName : newClipName;
    };
  };

  // Handle the data availability event (recording chunks)
  mediaRecorder.ondataavailable = function (e) {
    chunks.push(e.data);
  };
};

// Error handling for accessing the microphone
let onError = function (err) {
  console.log("The following error occurred: " + err);
};

// Check for media device support and start the recording process
if (navigator.mediaDevices.getUserMedia) {
  console.log("The mediaDevices.getUserMedia() method is supported.");
  const constraints = { audio: true };
  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
} else {
  console.log("MediaDevices.getUserMedia() not supported on your browser!");
}

// Ensure the canvas resizes correctly
window.onresize = function () {
  canvas.width = mainSection.offsetWidth;
};

window.onresize();
