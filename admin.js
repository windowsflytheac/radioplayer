function login() {
  const pass = prompt("Enter admin password:");
  if (pass === "GLaDOS_Override") {
    alert("Admin access granted! You can toggle stations.");
    startAdminPeer();
  } else {
    alert("Access denied!");
  }
}
