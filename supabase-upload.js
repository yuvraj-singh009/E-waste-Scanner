// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function () {
    // Ensure Supabase is available globally
    if (typeof supabase === "undefined") {
        console.error("Supabase is not loaded. Check if the script is included.");
        return;
    }

    // Initialize Supabase
    const SUPABASE_URL = "https://afieewyossvtxetxytnr.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmaWVld3lvc3N2dHhldHh5dG5yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjgxNTc4MCwiZXhwIjoyMDQ4MzkxNzgwfQ.agrmFADCTLm4n3w8tykxwIjz9K7MuknHk4GfOCTNWLM";
    const bucketName = "e-waste-reports";

    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Get elements after the DOM is ready
    const fileInput = document.getElementById("imageUpload");
    const uploadStatus = document.getElementById("uploadStatus");
    const submitButton = document.getElementById("submitReport");
    const captureBtn = document.getElementById("capture-btn"); // Get capture button

    if (!fileInput || !captureBtn) {
        console.error("❌ Missing HTML elements! Check your IDs.");
        return;
    }

    // Clicking 'Capture' should open file selector
    captureBtn.addEventListener("click", () => {
        console.log("📸 Capture button clicked! Opening file selector...");
        fileInput.click();
    });

    submitButton.addEventListener("click", async () => {
        if (!fileInput.files.length) {
            uploadStatus.innerText = "⚠️ Please select an image.";
            uploadStatus.style.color = "red";
            return;
        }

        const file = fileInput.files[0];
        const filePath = `reports/${Date.now()}-${file.name}`;

        uploadStatus.innerText = "Uploading...";
        uploadStatus.style.color = "blue";

        try {
            // Upload to Supabase bucket
            const { data, error } = await supabaseClient.storage
                .from(bucketName)
                .upload(filePath, file);

            if (error) {
                throw error;
            }

            uploadStatus.innerText = "✅ Upload successful!";
            uploadStatus.style.color = "green";

        } catch (err) {
            uploadStatus.innerText = "❌ Upload failed: " + err.message;
            uploadStatus.style.color = "red";
        }
    });
});
