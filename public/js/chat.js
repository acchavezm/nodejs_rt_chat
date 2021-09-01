var socket = io();

var messages = document.getElementById("messages");
var form = document.getElementById("form");
var input = document.getElementById("input");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat message", input.value);
    input.value = "";
  }
});

socket.on("chat message", function (msg) {
  var item = document.createElement("li");
  item.textContent = msg;
  messages.appendChild(item);
  //window.scrollTo(0, document.body.scrollHeight);
});

socket.on("users_online", function (data) {
  $("#users_online").text(data.users_online);
});

// listen from server.js
socket.on("click_count", function (value) {
  $("#counter").html(value); // set new count value
});

// says to server that the button has been clicked
$("#btn_click").click(function () {
  socket.emit("clicked"); // emitting user click
});
