# Radio Player

---

A web-based multi-station radio built for GitHub Pages using HTML, CSS, JavaScript, and PeerJS.
Supports an admin panel, toggleable stations, real-time status indicators, and multi-device syncing.

---
**Features**

Dynamic stations: Add audio files to stationFiles in radio.js, and new stations are generated automatically.

Admin panel: Login with a password to control playback for all stations.

Play All / Stop All: Start or stop all stations at once.

Status indicators: Each station shows ▶️ for playing or ⏸️ for paused.

PeerJS multi-device sync: Admin actions sync across connected devices (requires WebSocket connection).

Fully frontend — no Node.js backend needed.

Compatible with GitHub Pages.

---

**Installation / Setup**

Clone the repository 

git clone https://github.com/yourusername/radio-photon.git
cd radio-photon

Add your audio files
Place MP3 files in the audio/ folder and add them to the stationFiles array in radio.js:
const stationFiles = [
  'audio/Portal2-1x06-Overgrowth.mp3',
  'audio/Portal2-1x07-Ghost_of_Rattman.mp3',
  'audio/station1.mp3',
  'audio/station2.mp3'
];

---

**Usage**

Open the page in a browser.

Click Admin Login and enter the password: GLaDOS_Override
As admin, you can:

Toggle individual stations.

Play or stop all stations.

On connected devices, playback and status indicators will sync automatically (if PeerJS connects).

---

**Customization**

Adding stations: Add more audio files and update the stationFiles array — stations are created automatically.

Track names: Currently stations are labeled as Station 1/2/.... You can modify the radio.js generation code to display custom names.

Admin password: Change in admin.js.

---

**Notes**

PeerJS uses a public broker: peerjs-server.herokuapp.com.

If WebSocket fails, stations still work locally, but multi-device sync will not function.

Audio files should be <100 MB each for GitHub hosting; otherwise use Git LFS or external hosting.
