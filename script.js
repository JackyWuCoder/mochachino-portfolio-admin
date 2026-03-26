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
  if (![1, 2, 3, 4].includes(slot)) return;

  console.log("Slot: ", slot);
  console.log("Selected file:", file);

  // temporary Local preview
  const previewUrl = URL.createObjectURL(file);
  activeButton.querySelector("img").src = previewUrl;

  // TODO: upload + db update here
  try {
    // 1) ask backend for SAS upload URL + public URL
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const sasRes = await fetch(
      "http://localhost:8000//api/uploads/featured-image-sas",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // adjust if needed
        },
        body: JSON.stringify({ slot, fileExt }),
      },
    );

    if (!sasRes.ok) {
      throw new Error("Failed to get upload URL");
    }

    const { uploadUrl, publicUrl } = await sasRes.json();

    // 2) upload file directly to Azure Blob Storage
    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "x-ms-blob-type": "BlockBlob",
        "Content-type": file.type || "application/octet-stream",
      },
      body: file,
    });

    if (!uploadRes.ok) {
      throw new Error("Blob upload failed");
    }
  } catch (error) {}

  featuredImageInput.value = "";
});
