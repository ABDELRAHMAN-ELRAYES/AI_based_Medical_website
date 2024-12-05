function togglePasswordVisibility() {
  const passwordInput = document.getElementById("password_input");
  const viewIcon = document.getElementById("password_icon_view");
  const hideIcon = document.getElementById("password_icon_hide");

  // Toggle the input type
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    viewIcon.classList.add("hidden");
    hideIcon.classList.remove("hidden");
  } else {
    passwordInput.type = "password";
    hideIcon.classList.add("hidden");
    viewIcon.classList.remove("hidden");
  }
}
