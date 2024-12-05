function handleClickOpen() {
  document.getElementById("small").classList.remove("hidden");
  document.getElementById("small").classList.add("block");
  document.getElementById("open_icon").classList.add("hidden");
}

function handleClickClose() {
  const smallMenu = document.getElementById("small");
  smallMenu.classList.add("hidden");
  smallMenu.classList.remove("block");
  document.getElementById("open_icon").classList.remove("hidden");
}

// ==============================================================
// handle when you click outside the list in small screens
const list = document.getElementById("small");
const openIcon = document.getElementById("open_icon");

document.addEventListener("click", (event) => {
  if (openIcon.classList.contains("hidden")) {
    if (!list.contains(event.target) && !openIcon.contains(event.target)) {
      list.classList.add("hidden"); // Add the "hidden" class to hide the div
      openIcon.classList.remove("hidden");
    }
  }
});
