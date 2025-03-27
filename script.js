// const SUPABASE_URL = "YOUR_SUPABASE_URL";
// const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
// const BUCKET_NAME = "your-bucket-name";

// const { createClient } = supabase;
// const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// const captureButton = document.getElementById("capture-btn");
// const uploadButton = document.getElementById("upload-btn");
// const fileInput = document.getElementById("file-input");
// const submitButton = document.querySelector("#report-form button[type='submit']");
// const canvas = document.getElementById("scanner-canvas");
// const video = document.getElementById("scanner-video");

// let capturedImage = null;

// // Capture image from video feed
// captureButton.addEventListener("click", () => {
//     const context = canvas.getContext("2d");
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     context.drawImage(video, 0, 0, canvas.width, canvas.height);
//     canvas.toBlob(blob => capturedImage = blob, "image/png");
// });

// // Handle file upload
// uploadButton.addEventListener("click", () => fileInput.click());
// fileInput.addEventListener("change", (event) => {
//     const file = event.target.files[0];
//     if (file) capturedImage = file;
// });

// // Upload to Supabase on form submit
// submitButton.addEventListener("click", async (event) => {
//     event.preventDefault();
//     if (!capturedImage) {
//         alert("Please capture or upload an image first.");
//         return;
//     }
    
//     const fileName = `ewaste_${Date.now()}.png`;
//     const { data, error } = await supabaseClient.storage.from(BUCKET_NAME).upload(fileName, capturedImage, {
//         contentType: "image/png"
//     });
    
//     if (error) {
//         console.error("Upload failed", error);
//         alert("Failed to upload image.");
//     } else {
//         alert("Image uploaded successfully!");
//         console.log("Uploaded file details:", data);
//     }
// });