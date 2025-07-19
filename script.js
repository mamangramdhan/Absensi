const startBtn = document.getElementById("startBtn");
const captureBtn = document.getElementById("captureBtn");
const video = document.getElementById("camera");
const canvas = document.getElementById("canvas");

startBtn.onclick = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    video.srcObject = stream;

    video.style.display = "block";
    startBtn.style.display = "none";
    captureBtn.style.display = "block";
  } catch (err) {
    alert("Kamera tidak dapat diakses: " + err.message);
  }
};

captureBtn.onclick = () => {
  const context = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageData = canvas.toDataURL("image/jpeg", 0.9);

  // Kirim ke GAS (jika backend sudah siap)
  fetch("https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec", {
    method: "POST",
    body: JSON.stringify({ image: imageData }),
    headers: { "Content-Type": "application/json" }
  })
  .then(res => res.text())
  .then(msg => alert("✅ Foto terkirim"))
  .catch(err => alert("❌ Gagal kirim: " + err.message));
};
