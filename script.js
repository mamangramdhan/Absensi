const startBtn = document.getElementById("startBtn");
const video = document.getElementById("camera");
const canvas = document.getElementById("canvas");
const captureBtn = document.getElementById("captureBtn");

startBtn.onclick = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    // Tampilkan elemen setelah kamera aktif
    startBtn.style.display = "none";
    video.style.display = "block";
    captureBtn.style.display = "inline-block";
  } catch (err) {
    alert("Gagal mengakses kamera: " + err.message);
  }
};

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
