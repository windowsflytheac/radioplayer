// --- Declare connections first ---
let connections = [];

// --- Setup PeerJS ---
let peer = new Peer(); // random ID

peer.on('open', id => {
  console.log('Connected with ID:', id);
});

// Handle incoming peer connections
peer.on('connection', conn => {
  connections.push(conn);
  conn.on('data', handleData);
});

// Handle incoming toggle events
function handleData(data) {
  if (data.type === 'toggle') {
    const audio = document.getElementById('audio' + data.station);
    if (audio.paused) audio.play();
    else audio.pause();
  }
}

// --- Station toggling ---
function toggleStation(id) {
  const audio = document.getElementById('audio' + id);
  if (audio.paused) audio.play();
  else audio.pause();

  // Broadcast to other peers
  connections.forEach(conn => conn.send({type:'toggle', station:id}));
}
