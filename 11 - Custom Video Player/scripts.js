// Get DOM Elements
const player = document.querySelector(".player");
const video = player.querySelector(".viewer");
const progress = player.querySelector(".progress");
const progressBar = player.querySelector(".progress__filled");
const toggle = player.querySelector(".toggle");
const ranges = player.querySelectorAll(".player__slider");
const skipButtons = player.querySelectorAll("[data-skip]");
// Functions
function togglePlay() {
  const playControl = video.paused ? "play" : "pause";
  video[playControl]();
}

function updatePlayBtn() {
  const icon = this.paused ? "►" : "❚ ❚";
  toggle.textContent = icon;
}

function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function skip() {
  video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
  video[this.name] = this.value;
}

function moveTo(e) {
  const targetTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = targetTime;
}

// Listners
video.addEventListener("click", togglePlay);
video.addEventListener("play", updatePlayBtn);
video.addEventListener("pause", updatePlayBtn);
video.addEventListener("timeupdate", handleProgress);

toggle.addEventListener("click", togglePlay);

skipButtons.forEach((btn) => btn.addEventListener("click", skip));

ranges.forEach((range) => range.addEventListener("change", handleRangeUpdate));
ranges.forEach((range) =>
  range.addEventListener("mousemove", handleRangeUpdate)
);

progress.addEventListener("click", moveTo);
