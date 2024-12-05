// handle upload Image
const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const placeholder = document.getElementById("placeholder");
const previewContainer = document.getElementById("previewContainer");
const previewImage = document.getElementById("previewImage");

// Show image preview when a file is selected
function showPreview(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.src = e.target.result;
    placeholder.classList.add("hidden");
    previewContainer.classList.remove("hidden");

    previewContainer.classList.add("flex");
    previewContainer.style.justifyContent = "center";
    previewContainer.style.alignContent = "center";
  };
  reader.readAsDataURL(file);
}

// Handle file selection via input
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    showPreview(file);
  }
});

// Drag-and-drop events
dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropzone.classList.add("border-blue-400", "bg-blue-50");
});

dropzone.addEventListener("dragleave", () => {
  dropzone.classList.remove("border-blue-400", "bg-blue-50");
});

dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropzone.classList.remove("border-blue-400", "bg-blue-50");
  const file = e.dataTransfer.files[0];
  if (file) {
    fileInput.files = e.dataTransfer.files; // Bind file to input
    showPreview(file);
  }
});
