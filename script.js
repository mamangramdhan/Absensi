const video = document.getElementById("camera");
const canvas = document.getElementById("canvas");
const captureBtn = document.getElementById("captureBtn");
const reloadBtn = document.getElementById("reloadBtn");

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.setAttribute("playsinline", true);
    video.onloadedmetadata = () => {
      video.play();
    };
    reloadBtn.style.display = "none";
  } catch (err) {
    console.error("Gagal membuka kamera:", err);
    alert("Gagal membuka kamera. Klik untuk mencoba lagi.");
    reloadBtn.style.display = "block";
  }
}

captureBtn.onclick = () => {
  const context = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageData = canvas.toDataURL("image/jpeg", 0.9);

  fetch("https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec", {
    method: "POST",
    body: JSON.stringify({ image: imageData }),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.text())
    .then(msg => alert(msg))
    .catch(err => alert("Gagal kirim gambar: " + err.message));
};

reloadBtn.onclick = () => {
  startCamera(); // Coba ulang kamera
};

startCamera(); // Mulai otomatis
