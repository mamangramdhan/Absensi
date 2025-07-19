const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snapshot = document.getElementById('snapshot');
const captureBtn = document.getElementById('capture');
const sendBtn = document.getElementById('send');

let imageDataBase64 = null;
let captureTime = null;
let userLocation = null;

// Minta akses kamera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => video.srcObject = stream)
  .catch(err => alert("Gagal akses kamera: " + err.message));

// Ambil lokasi
navigator.geolocation.getCurrentPosition(
  (pos) => {
    userLocation = {
      lat: pos.coords.latitude,
      lon: pos.coords.longitude,
      accuracy: pos.coords.accuracy
    };
    console.log("Lokasi:", userLocation);
  },
  (err) => alert("Gagal dapat lokasi: " + err.message),
  { enableHighAccuracy: true }
);

// Ambil foto
captureBtn.onclick = () => {
  captureTime = new Date().toISOString();
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  imageDataBase64 = canvas.toDataURL('image/jpeg');
  snapshot.src = imageDataBase64;
  sendBtn.disabled = false;
};

// Kirim ke server
sendBtn.onclick = () => {
  if (!imageDataBase64) return;
  const photoBlob = dataURLtoBlob(imageDataBase64);
  const formData = new FormData();
  formData.append('photo', photoBlob, 'photo.jpg');
  formData.append('timestamp', captureTime);

  if (userLocation) {
    formData.append('latitude', userLocation.lat);
    formData.append('longitude', userLocation.lon);
    formData.append('accuracy', userLocation.accuracy);
  }

  fetch('https://your-backend-endpoint.com/upload', {
    method: 'POST',
    body: formData
  })
    .then(res => res.text())
    .then(msg => alert("Berhasil dikirim!"))
    .catch(err => alert("Gagal: " + err.message));
};

// Base64 ke Blob
function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length, u8arr = new Uint8Array(n);
  while(n--) u8arr[n] = bstr.charCodeAt(n);
  return new Blob([u8arr], { type: mime });
}
