function toggleSubnet() {
  const panel = document.getElementById('subnet-panel');
  panel.classList.toggle('open');
}

function calculateSubnet() {
  const input = document.getElementById('subnet-input').value.trim();
  const result = document.getElementById('subnet-result');

  let ip, cidr;

  if (input.includes('/')) {
    [ip, cidr] = input.split('/');
    cidr = parseInt(cidr);
  } else {
    result.innerHTML = '<p style="color:red">Format invalide. Exemple : 192.168.0.0/24</p>';
    return;
  }

  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255) || isNaN(cidr) || cidr < 0 || cidr > 32) {
    result.innerHTML = '<p style="color:red">Adresse IP invalide.</p>';
    return;
  }

  const maskBits = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
  const ipInt = (parts[0] << 24 | parts[1] << 16 | parts[2] << 8 | parts[3]) >>> 0;
  const networkInt = (ipInt & maskBits) >>> 0;
  const broadcastInt = (networkInt | (~maskBits >>> 0)) >>> 0;
  const firstInt = cidr === 32 ? networkInt : networkInt + 1;
  const lastInt = cidr === 32 ? broadcastInt : broadcastInt - 1;
  const size = Math.pow(2, 32 - cidr);

  const intToIp = n => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
  const intToBin = n => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255]
    .map(b => b.toString(2).padStart(8, '0')).join('.');

  const ipClass = parts[0] < 128 ? 'A' : parts[0] < 192 ? 'B' : parts[0] < 224 ? 'C' : parts[0] < 240 ? 'D' : 'E';

  result.innerHTML = `
    <table class="subnet-table">
      <tr><td>Adresse réseau</td><td>${intToIp(networkInt)}</td></tr>
      <tr><td>Masque réseau</td><td>${intToIp(maskBits)}</td></tr>
      <tr><td>Masque binaire</td><td class="mono">${intToBin(maskBits)}</td></tr>
      <tr><td>Notation CIDR</td><td>/${cidr}</td></tr>
      <tr><td>Masque wildcard</td><td>${intToIp(~maskBits >>> 0)}</td></tr>
      <tr><td>Taille réseau</td><td>${size}</td></tr>
      <tr><td>Première adresse</td><td>${intToIp(firstInt)}</td></tr>
      <tr><td>Dernière adresse</td><td>${intToIp(lastInt)}</td></tr>
      <tr><td>Adresse broadcast</td><td>${intToIp(broadcastInt)}</td></tr>
      <tr><td>Classe IP</td><td>${ipClass}</td></tr>
    </table>
  `;
}

if (!localStorage.getItem('cookies-ok')) {
  document.getElementById('cookie-banner').style.display = 'block';
}

function acceptCookies() {
  localStorage.setItem('cookies-ok', 'yes');
  document.getElementById('cookie-banner').style.display = 'none';
}

function setTheme(theme) {
  document.body.className = theme;
  localStorage.setItem('theme', theme);
  document.getElementById('theme-menu').classList.remove('open');
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme !== null) {
  document.body.className = savedTheme;
}

function toggleThemeMenu() {
  document.getElementById('theme-menu').classList.toggle('open');
}

document.addEventListener('click', e => {
  if (!e.target.closest('.nav-droite')) {
    const menu = document.getElementById('theme-menu');
    if (menu) menu.classList.remove('open');
  }
});