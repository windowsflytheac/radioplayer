let connections = [];
let peer;
let isAdmin = false;

// --- Update status indicator ---
function updateStatus(id, action) {
  const status = document.getElementById('status' + id);
  if (!status) return;
  status.textContent = action === 'play' ? '▶️' : '⏸️';
}

// --- Initialize PeerJS ---
function initPeer(adminMode = false) {
  if (adminMode) {
    // Admin has fixed ID
    peer = new Peer('admin', {
      host: 'peerjs-server.herokuapp.com',
      port: 443,
      secure: true
    });

    peer.on('connection', conn => {
      connections.push(conn);
      conn.on('data', handleData);
    });

  } else {
    // Normal device
    peer = new Peer({
      host: 'peerjs-server.herokuapp.com',
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
  connections.forEach(conn => conn.send({type:'toggle', station:id, action:action}));
}

// --- Start admin peer ---
function startAdminPeer() {
  isAdmin = true;
  initPeer(true);
}
