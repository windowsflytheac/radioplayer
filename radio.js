let connections = [];
let peer;
let isAdmin = false;

// --- List of all audio files ---
const stationFiles = [
  'audio/Portal2-1x06-Overgrowth.mp3',
  'audio/Portal2-1x07-Ghost_of_Rattman.mp3',
  'audio/Portal2-1x08-Haunted_Panels.mp3',
  'audio/Portal2-1x09-The_Future_Starts_With_You.mp3',
  'audio/Portal2-1x10-There_She_Is.mp3',
  'audio/Portal2-1x11-You_Know_Her.mp3',
  'audio/Portal2-1x02-Concentration_Enhancing_Menu_Initialiser.mp3',
  'audio/Portal2-1x03-999999.mp3',
  'audio/Portal2-1x04-The_Courtesy_Call.mp3',
  'audio/Portal2-1x05-Technical_Difficulties.mp3',
  'audio/station1.mp3',
  'audio/station2.mp3'
];

// --- Generate station HTML dynamically ---
const stationsContainer = document.getElementById('stations');
stationFiles.forEach((file, index) => {
  const id = index + 1; // station IDs start from 1
  const stationDiv = document.createElement('div');
  stationDiv.className = 'station';
  stationDiv.dataset.id = id;

  stationDiv.innerHTML = `
    <h2>Station ${id}</h2>
    <audio id="audio${id}" src="${file}" controls></audio>
    <button onclick="toggleStation(${id})">Toggle</button>
    <span id="status${id}" class="status">⏸️</span>
  `;
  stationsContainer.appendChild(stationDiv);
});

// --- Update status indicator ---
function updateStatus(id, action) {
  const status = document.getElementById('status' + id);
  if (!status) return;
  status.textContent = action === 'play' ? '▶️' : '⏸️';
}

// --- Initialize PeerJS ---
function initPeer(adminMode = false) {
  isAdmin = adminMode;

  if (adminMode) {
    peer = new Peer('admin', {
      host: '0.peerjs.com',
      port: 443,
      secure: true
    });

    peer.on('connection', conn => {
      connections.push(conn);
      conn.on('data', handleData);
    });

  } else {
    peer = new Peer({
      host: '0.peerjs.com',
      port: 443,
      secure: true
    });

    peer.on('open', id => {
      const conn = peer.connect('admin');
      conn.on('open', () => console.log('Connected to admin'));
      conn.on('data', handleData);
      connections.push(conn);
    });
  }

  peer.on('error', err => {
    console.error('PeerJS error:', err);
  });
}

// --- Handle incoming toggle events ---
function handleData(data) {
  const audio = document.getElementById('audio' + data.station);
  if (!audio) return;

  if (data.action === 'play') audio.play();
  else audio.pause();

  updateStatus(data.station, data.action);
}

// --- Toggle station ---
function toggleStation(id) {
  if (!isAdmin) {
    alert("Only admin can toggle stations!");
    return;
  }

  const audio = document.getElementById('audio' + id);
  const action = audio.paused ? 'play' : 'pause';
  if (audio.paused) audio.play();
  else audio.pause();

  updateStatus(id, action);

  // Broadcast to all connected peers
  connections.forEach(conn => conn.send({ type:'toggle', station:id, action:action }));
}

// --- Play all stations ---
function playAllStations() {
  if (!isAdmin) { alert("Only admin can play all stations!"); return; }

  stationFiles.forEach((_, index) => {
    const id = index + 1;
    const audio = document.getElementById('audio' + id);
    audio.play();
    updateStatus(id, 'play');

    connections.forEach(conn => conn.send({ type:'toggle', station:id, action:'play' }));
  });
}

// --- Stop all stations ---
function stopAllStations() {
  if (!isAdmin) { alert("Only admin can stop all stations!"); return; }

  stationFiles.forEach((_, index) => {
    const id = index + 1;
    const audio = document.getElementById('audio' + id);
    audio.pause();
    updateStatus(id, 'pause');

    connections.forEach(conn => conn.send({ type:'toggle', station:id, action:'pause' }));
  });
}

// --- Start admin peer ---
function startAdminPeer() {
  isAdmin = true;
  initPeer(true);
}
