new ClipboardJS('img');
let peer = null;
document.getElementById("start_chatting_loader").style.visibility = "visible";
var lastPeerId = null;
var peerId = null;
var conn = null;
var recvId = document.getElementById("receiver-id");
var connStatus = document.getElementById("status");
var message = document.getElementById("chat_messages");
var sendMessageBox = document.getElementById("sendMessageBox");
var sendButton = document.getElementById("sendButton");
var clearMsgsButton = document.getElementById("clearMsgsButton");


function initialize() {
  // Create own peer object with connection to shared PeerJS server
  peer = new Peer(null, {
      debug: 2
  });

  peer.on('open', function (id) {
      // Workaround for peer.reconnect deleting previous id
      document.getElementById("chat_link").value = `https://securechat11.netlify.app/join.html?token=${peer.id}`;
      document.getElementById("link_data").style.display = "block";
      document.getElementById("start_chatting_loader").style.visibility = "hidden";
      document.getElementById("start_chatting").style.display = "none";
      if (peer.id === null) {
          console.log('Received null id from peer open');
          peer.id = lastPeerId;
      } else {
          lastPeerId = peer.id;
      }

      console.log('ID: ' + peer.id);
      recvId.innerHTML = "ID: " + peer.id;
      connStatus.innerHTML = "Awaiting connection...";
  });


  peer.on('connection', function (c) {
      // Allow only a single connection
      if (conn && conn.open) {
          c.on('open', function() {
              c.send("Already connected to another client");
              setTimeout(function() { c.close(); }, 500);
          });
          return;
      }

      conn = c;
      console.log("Connected to: " + conn.peer);
      connStatus.innerHTML = "Connected";
      ready();
  });


  peer.on('disconnected', function () {
      connStatus.innerHTML = "Connection lost. Please reconnect";
      console.log('Connection lost. Please reconnect');

      // Workaround for peer.reconnect deleting previous id
      peer.id = lastPeerId;
      peer._lastServerId = lastPeerId;
      peer.reconnect();
  });

  peer.on('close', function() {
      conn = null;
      connStatus.innerHTML = "Connection destroyed. Please refresh";
      console.log('Connection destroyed');
  });

  peer.on('error', function (err) {
      console.log(err);
      alert('' + err);
  });

}

function ready() {
  conn.on('data', function (data) {
      console.log("Data recieved");
      addMessage("<span class=\"peerMsg\">Peer: </span>" + data);
  });
  conn.on('close', function () {
      connStatus.innerHTML = "Connection reset<br>Awaiting connection...";
      conn = null;
  });
}

function addMessage(msg) {
  var now = new Date();
  var h = now.getHours();
  var m = addZero(now.getMinutes());
  var s = addZero(now.getSeconds());

  if (h > 12)
      h -= 12;
  else if (h === 0)
      h = 12;

  function addZero(t) {
      if (t < 10)
          t = "0" + t;
      return t;
  };

  message.innerHTML = "<br><span class=\"msg-time\">" + h + ":" + m + ":" + s + "</span>  -  " + msg + message.innerHTML;
}

function clearMessages() {
  message.innerHTML = "";
  addMessage("Msgs cleared");
}

// Listen for enter in message box
sendMessageBox.addEventListener('keypress', function (e) {
  var event = e || window.event;
  var char = event.which || event.keyCode;
  if (char == '13')
      sendButton.click();
});

// Send message
sendButton.addEventListener('click', function () {
  if (conn && conn.open) {
      var msg = sendMessageBox.value;
      sendMessageBox.value = "";
      conn.send(msg);
      console.log("Sent: " + msg)
      addMessage("<span class=\"selfMsg\">Self: </span>" + msg);
  } else {
      console.log('Connection is closed');
  }
});

// Clear messages box
clearMsgsButton.addEventListener('click', clearMessages);

initialize();