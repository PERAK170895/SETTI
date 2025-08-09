// Ganti dengan URL dan API KEY Supabase kamu
const SUPABASE_URL = 'https://ciashuymvwhmfuxqgqlr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpYXNodXltdndobWZ1eHFncWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0NTQyOTEsImV4cCI6MjA2MzAzMDI5MX0.CfmfbISXd_T941XE0j8pAMqrgCUFa9ocBhuQ3B6gUY8';
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY); // ✅

document.addEventListener('DOMContentLoaded', async () => {
  const infoEl = document.querySelector('.info');
  const authBtn = document.getElementById('auth-button');
  const loginPopup = document.getElementById('login-popup');
  const closePopup = document.getElementById('close-popup');
  const loginForm = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  const { data: { user }, error } = await client.auth.getUser();

  if (user) {
    infoEl.textContent = `Selamat datang: ${user.user_metadata?.full_name || user.email}`;
    authBtn.textContent = 'LOGOUT';
    authBtn.onclick = async (e) => {
      e.preventDefault();
      await client.auth.signOut();
      location.reload();
    };
  } else {
    const newLocal = infoEl.textContent = 'DEVELOPER...';
    authBtn.textContent = 'SIGN IN';
    authBtn.onclick = (e) => {
      e.preventDefault();
      loginPopup.style.display = 'flex';
    };
    closePopup.onclick = () => {
      loginPopup.style.display = 'none';
    };

    loginForm.onsubmit = async (e) => {
      e.preventDefault();
      const email = emailInput.value;
      const password = passwordInput.value;

      const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert('Login gagal: ' + error.message);
      } else {
        loginPopup.style.display = 'none';
        location.reload();
      }
    };
  }
});
// 🔓 Fungsi toggle menu lipat (gambar klik ➜ menu muncul)
function toggleFold() {
  const content = document.getElementById('foldContent');
  content.classList.toggle('open');
}
 function updateClock() {
  const now = new Date();

  // Format tanggal tanpa waktu
  const dateOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  const formattedDate = now.toLocaleDateString('id-ID', dateOptions);

  // Format waktu (jam:menit:detik) 24 jam
  const timeOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };
  const formattedTime = now.toLocaleTimeString('id-ID', timeOptions);

  // Gabungkan dengan emoji kalender di depan
  document.getElementById('clock').textContent = `⏰ ${formattedDate}, ${formattedTime}`;
}

// Update setiap detik
setInterval(updateClock, 1000);
updateClock();
