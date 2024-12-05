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

// ================================================ Toggle Image input ================================================
function toggleImageInput() {
  const doctorRadio = document.getElementById("doctor");
  const doctorContainer = document.getElementById("doctor_container");
  // const imageInput = document.getElementById("image");
  // const lableImage = document.getElementById("label_image");

  // Enable Image input if "Doctor" is selected, otherwise disable it
  if (doctorRadio.checked) {
    // lableImage.style.display = "block";
    // imageInput.style.display = "block";
    doctorContainer.style.display = "block";
  } else {
    doctorContainer.style.display = "none";
  }
}
