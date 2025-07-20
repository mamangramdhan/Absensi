const video = document.getElementById("camera");
const canvas = document.getElementById("canvas");
const captureBtn = document.getElementById("captureBtn");

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (err) {
    alert("Gagal mengakses kamera: " + err.message);
  }
}

captureBtn.onclick = () => {
  const context = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageData = canvas.toDataURL("image/jpeg", 0.9);

  // Kirim base64 ke GAS backend
  fetch("https://script.google.com/macros/s/AKfycbzkkVrrzB1NOQTs2Uz39YNLE44vPlRp1ITheRTXNqz9pfNJ1KsP_FPPTp1e3qBbWLJs/exec", {
    method: "POST",
    body: JSON.stringify({ image: imageData }),
    headers: { "Content-Type": "application/json" }
  })
  .then(res => res.text())
  .then(msg => alert(msg))
  .catch(err => alert("Gagal kirim gambar: " + err.message));
};

startCamera();
