let video = document.getElementById('video');
let canvas = document.getElementById('canvas');
let switchBtn = document.getElementById('switch');
let snapBtn = document.getElementById('snap');
let sendBtn = document.getElementById('send');

let currentStream = null;
let usingFront = false;
// let currentCoords = { lat: null, lon: null };
// let address = "Alamat tidak ditemukan";

// Load kamera
async function getStream() {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
  }

  const constraints = {
    video: { facingMode: usingFront ? 'user' : 'environment' },
    audio: false
  };

  try {
    currentStream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = currentStream;
  } catch (err) {
    alert("Tidak bisa mengakses kamera: " + err);
  }
}

// Ganti kamera
switchBtn.onclick = () => {
  usingFront = !usingFront;
  getStream();
};

getStream(); // Start awal

// Lokasi GPS + Reverse geocode
// function getLocation() {
//   if (!navigator.geolocation) {
//     document.getElementById("lokasi").textContent = "Geolocation tidak didukung!";
//     return;
//   }

//   navigator.geolocation.getCurrentPosition(async pos => {
//     const { latitude, longitude } = pos.coords;
//     currentCoords.lat = latitude;
//     currentCoords.lon = longitude;

//     document.getElementById("koordinat").textContent = `📌 Koordinat: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

//     try {
//       const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
//       const data = await res.json();
//       address = data.display_name;
//       document.getElementById("lokasi").textContent = `📍 Lokasi: ${address}`;
//     } catch (e) {
//       document.getElementById("lokasi").textContent = "📍 Tidak bisa ambil alamat";
//     }
//   }, () => {
//     document.getElementById("lokasi").textContent = "📍 Gagal mendapatkan lokasi!";
//   });
// }

// getLocation();

// Timestamp live
setInterval(() => {
  const now = new Date();
  const jam = now.toLocaleTimeString();
  const tanggal = now.toLocaleDateString('id-ID');
  document.getElementById("timestamp").textContent = `🕒 Waktu: ${tanggal} ${jam}`;
}, 1000);

// Ambil foto
snapBtn.onclick = () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  sendBtn.disabled = false;
  alert("📸 Foto diambil, siap dikirim.");
};

// Kirim ke backend (ganti URL)
sendBtn.onclick = async () => {
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));

  const form = new FormData();
  form.append("photo", blob, "absen.jpg");
  // form.append("lat", currentCoords.lat);
  // form.append("lon", currentCoords.lon);
  // form.append("alamat", address);
  form.append("waktu", new Date().toISOString());

  try {
    const res = await fetch("https://script.google.com/macros/s/AKfycbzkkVrrzB1NOQTs2Uz39YNLE44vPlRp1ITheRTXNqz9pfNJ1KsP_FPPTp1e3qBbWLJs/exec", {
      method: "POST",
      body: form
    });

    if (res.ok) {
      alert("✅ Absensi berhasil dikirim!");
    } else {
      throw new Error("Status: " + res.status);
    }
  } catch (err) {
    alert("❌ Gagal kirim absensi: " + err.message);
  }
};
