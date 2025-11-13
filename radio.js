let connections = [];
let peer;
let isAdmin = false;

// --- Initialize PeerJS ---
function initPeer(adminMode = false) {
  if (adminMode) {
    // Admin has fixed ID
    peer = new Peer('admin', { host:'peerjs.com', port:443, secure:true });
  } else {
    peer = new Peer({ host:'peerjs.com', port:443, secure:true });
    // Connect to admin
    peer.on('open', id => {
      const conn = peer.connect('admin');
      conn.on('open', () => console.log('Connected to admin'));
      conn.on('data', handleData);
      connections.push(conn);
    });
  }

  // Accept incoming connections (for admin)
  peer.on('connection', conn => {
    connections.push(conn);
    conn.on('data', handleData);
  });
}

// --- Handle incoming toggle commands ---
function handleData(data) {
  const audio = document.getElementById('audio' + data.station);
  if (!audio) return;
  if (data.action === 'play') audio.play();
  else audio.pause();
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

  // Broadcast to all connected peers
  connections.forEach(conn => conn.send({type:'toggle', station:id, action: action}));
}

// --- Start peer for admin if logged in ---
function startAdminPeer() {
  isAdmin = true;
  initPeer(true);
}
