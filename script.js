// Get the container for sound clips
const soundClips = document.querySelector(".sound-clips");

// Inside the 'onSuccess' function, update the record button to clear previous clips when a new recording starts:
record.onclick = function () {
  // Clear any existing sound clips before starting a new one
  soundClips.innerHTML = '';  // Clears all the previous clips

  mediaRecorder.start();
  console.log(mediaRecorder.state);
  console.log("Recorder started.");
  record.style.background = "red";  // Indicate recording state
  record.disabled = true;  // Disable the record button while recording
  stop.disabled = false;  // Enable the stop button
};

stop.onclick = function () {
  mediaRecorder.stop();
  console.log(mediaRecorder.state);
  console.log("Recorder stopped.");

  // Reset button styles and enable the record button again
  record.style.background = "";
  record.style.color = "";
  stop.disabled = true;
  record.disabled = false;
};

// Inside mediaRecorder.onstop (to handle clip creation):
mediaRecorder.onstop = function (e) {
  console.log("Last data to read (after MediaRecorder.stop() called).");

  const clipName = prompt(
    "Enter a name for your sound clip?",
    "My unnamed clip"
  );

  const clipContainer = document.createElement("article");
  const clipLabel = document.createElement("p");
  const audio = document.createElement("audio");
  const deleteButton = document.createElement("button");

  clipContainer.classList.add("clip");
  audio.setAttribute("controls", "");
  deleteButton.textContent = "Delete";
  deleteButton.className = "delete";

  if (clipName === null) {
    clipLabel.textContent = "My unnamed clip";
  } else {
    clipLabel.textContent = clipName;
  }

  clipContainer.appendChild(audio);
  clipContainer.appendChild(clipLabel);
  clipContainer.appendChild(deleteButton);
  soundClips.appendChild(clipContainer);

  audio.controls = true;
  const blob = new Blob(chunks, { type: mediaRecorder.mimeType });
  chunks = [];
  const audioURL = window.URL.createObjectURL(blob);
  audio.src = audioURL;
  console.log("recorder stopped");

  deleteButton.onclick = function (e) {
    e.target.closest(".clip").remove();
  };

  clipLabel.onclick = function () {
    const existingName = clipLabel.textContent;
    const newClipName = prompt("Enter a new name for your sound clip?");
    if (newClipName === null) {
      clipLabel.textContent = existingName;
    } else {
      clipLabel.textContent = newClipName;
    }
  };
};
