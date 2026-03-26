const featuredImageButtons = document.querySelectorAll(".featured-work-btn");
const featuredImageInput = document.getElementById("featured-image-input");

let activeButton = null;

featuredImageButtons.forEach((button) => {
  const slot = Number(button.dataset.slot);
});

featuredImageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeButton = button;
    featuredImageInput.click();
  });
});

featuredImageInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];

  if (!file || !activeButton) return;

  const slot = Number(activeButton.dataset.slot);
  console.log("Slot: ", slot);
  console.log("Selected file:", file);

  const previewUrl = URL.createObjectURL(file);
  activeButton.querySelector("img").src = previewUrl;

  // TODO: upload + db update here
  featuredImageInput.value = "";
});
