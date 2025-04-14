"use strict";

function login(event) {
  var username, password, response, result;
  return regeneratorRuntime.async(function login$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          username = document.getElementById("username").value;
          password = document.getElementById("password").value;
          _context.next = 4;
          return regeneratorRuntime.awrap(fetch("http://127.0.0.1:5000/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              username: username,
              password: password
            })
          }));

        case 4:
          response = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap(response.json());

        case 7:
          result = _context.sent;

          if (response.ok) {
            alert("Logged In as " + username);
            localStorage.setItem("username", username);
            window.location.href = "/dashboard";
          } else {
            alert("Incorrect Credentials");
          }

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
}