const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const ctx = canvas.getContext("2d");
const strip = document.querySelector(".strip");
const snap = document.querySelector(".snap");
let effect;

function getVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((stream) => {
      video.srcObject = stream;
      video.play();
    })
    .catch((err) => {
      console.alert("Refresh and Allow Access to Camera");
      console.log(err);
    });
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    let pixels = ctx.getImageData(0, 0, width, height);
    if (effect === "none") {
      return pixels;
    }
    if (effect === "redEffect") {
      redEffect(pixels);
    }
    if (effect === "rgba") {
      rgbSplit(pixels);
    }
    if (effect === "greenScreen") {
      greenScreen(pixels);
    }
    ctx.putImageData(pixels, 0, 0);
  }, 10);
}

function takePhoto() {
  snap.currentTime = 0;
  snap.play();

  const data = canvas.toDataURL("image/jpeg");
  const link = document.createElement("a");
  link.href = data;
  link.setAttribute("download", "ae-photo");
  link.innerHTML = `<img src=${data} alt={screenshot}/>`;
  strip.insertBefore(link, strip.firstChild);
}

document.querySelectorAll(".filters button").forEach((btn) => {
  const inputs = document.querySelector(".rgb");
  btn.addEventListener("click", () => {
    if (btn.dataset.effect === "greenScreen") {
      inputs.classList.toggle("show");
      if (!inputs.classList.contains("show")) {
        effect = "none";
        console.log(effect);
      } else {
        effect = btn.dataset.effect;
        console.log(effect);
      }
    }
    if (btn.dataset.effect !== "greenScreen") {
      effect = btn.dataset.effect;
      inputs.classList.remove("show");
    }
  });
});

function redEffect(pixels) {
  for (i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 200;
    pixels.data[i + 1] = pixels.data[i + 1];
    pixels.data[i + 2] = pixels.data[i + 2] - 50;
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0];
    pixels.data[i + 100] = pixels.data[i + 1];
    pixels.data[i - 150] = pixels.data[i + 2];
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll(".rgb input").forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo();

video.addEventListener("canplay", paintToCanvas);
