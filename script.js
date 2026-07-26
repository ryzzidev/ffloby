// script.js
let currentImageUrl = '';
let isGenerating = false;
const API_BASE = 'https://api.nexray.eu.cc/maker';

async function generateLobby() {
    if (isGenerating) return;

    const nickname = document.getElementById('lobbyNick').value.trim() || 'Ryzzi';
    const btn = document.getElementById('generateBtn');
    const resultCard = document.getElementById('resultCard');
    const preview = document.getElementById('previewContainer');
    const downloadWrapper = document.getElementById('downloadWrapper');

    isGenerating = true;
    btn.classList.add('loading');
    resultCard.classList.add('show');
    downloadWrapper.innerHTML = '';

    preview.innerHTML = `
        <div class="preview-loading">
            <i class="ri-loader-4-line"></i>
            <p>Membuat lobby FF...</p>
            <p style="font-size:11px;color:var(--text-secondary);margin-top:4px;">${nickname}</p>
        </div>
    `;

    try {
        const url = `${API_BASE}/fakelobyff?nickname=${encodeURIComponent(nickname)}`;
        const response = await fetch(url);

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const blob = await response.blob();
        currentImageUrl = URL.createObjectURL(blob);

        preview.innerHTML = `
            <img src="${currentImageUrl}" alt="Fake Lobby FF">
        `;

        downloadWrapper.innerHTML = `
            <button class="btn-download" onclick="downloadImage()">
                <i class="ri-download-2-line"></i> Download Gambar
            </button>
        `;

        showToast('✅ Lobby FF berhasil dibuat!');

    } catch (error) {
        console.error(error);
        preview.innerHTML = `
            <div class="preview-placeholder">
                <i class="ri-error-warning-fill" style="color:#f87171;"></i>
                <p>Gagal generate lobby</p>
                <p style="font-size:11px;color:var(--text-secondary);">Coba lagi nanti</p>
            </div>
        `;
        showToast('❌ Gagal generate, coba lagi');
    } finally {
        isGenerating = false;
        btn.classList.remove('loading');
    }
}

function downloadImage() {
    if (!currentImageUrl) {
        showToast('⚠️ Generate dulu sebelum download');
        return;
    }

    const link = document.createElement('a');
    link.href = currentImageUrl;
    link.download = `lobby_ff_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('⬇️ Download dimulai!');
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toastMsg');
    msg.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

function scrollToTop() {
    document.getElementById('mainContent').scrollTop = 0;
}

function openModal() {
    document.getElementById('modalOverlay').classList.add('active');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}

document.getElementById('modalOverlay').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});

document.getElementById('lobbyNick').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') generateLobby();
});

console.log('🔥 Ryz FF - Fake Lobby FF');

// ==========================================
// KODE PWA (PROGRESSIVE WEB APP)
// ==========================================

// 1. Mendaftarkan Service Worker PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('PWA Service Worker Terdaftar!', reg))
      .catch(err => console.error('Gagal mendaftarkan Service Worker', err));
  });
}

// 2. Logika memicu otomatis install pas masuk web
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Mencegah mini-infobar bawaan Chrome muncul di bawah
  e.preventDefault();
  // Simpan event-nya agar bisa ditembak kapan saja
  deferredPrompt = e;
  
  // Langsung tembak prompt install begitu halaman siap dan event terdeteksi
  setTimeout(() => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User menerima instalasi Ryz FF Loby');
        } else {
          console.log('User menolak instalasi');
        }
        deferredPrompt = null;
      });
    }
  }, 1000); // Jeda 1 detik setelah masuk web agar lebih mulus
});
