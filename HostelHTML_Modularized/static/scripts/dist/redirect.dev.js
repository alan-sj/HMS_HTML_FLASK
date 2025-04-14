"use strict";

if (!localStorage.getItem('username')) {
  window.location.href = 'login.html';
}