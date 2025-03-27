document.addEventListener("DOMContentLoaded", () => {
    const locationBtn = document.getElementById("get-location");
    const submitReportBtn = document.getElementById("submitReport");

    if (!locationBtn || !submitReportBtn) {
        console.error("❌ Missing buttons!");
        return;
    }

    submitReportBtn.addEventListener("click", async () => {
        // Step 1: Click the 'Get Location' button automatically
        locationBtn.click();

        // Step 2: Wait for location retrieval
        try {
            const { latitude, longitude } = await getCurrentLocation();

            // Step 3: Send report and location data to Supabase
            await saveReportToSupabase(latitude, longitude);
        } catch (error) {
            alert("⚠ Location required to submit report!");
        }
    });
});

/**
 * Get user's current location (Returns Promise)
 */
function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject("Geolocation not supported");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            (error) => {
                reject(error.message);
            }
        );
    });
}

/**
 * Save report + location to Supabase
 */
async function saveReportToSupabase(latitude, longitude) {
    const { createClient } = supabase;

    // Supabase credentials
    const supabaseUrl = "https://afieewyossvtxetxytnr.supabase.co";
    const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmaWVld3lvc3N2dHhldHh5dG5yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjgxNTc4MCwiZXhwIjoyMDQ4MzkxNzgwfQ.agrmFADCTLm4n3w8tykxwIjz9K7MuknHk4GfOCTNWLM";
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

    // Get form data
    const itemType = document.getElementById("item-type").value;
    const itemCondition = document.getElementById("item-condition").value;
    const locationNotes = document.getElementById("location-notes").value;
    const userEmail = document.getElementById("user-email").value || null;

    if (!itemType || !itemCondition) {
        alert("⚠ Please fill all required fields.");
        return;
    }

    // Insert data into Supabase
    const { data, error } = await supabaseClient
        .from("reports") // Replace with your table name
        .insert([
            {
                item_type: itemType,
                item_condition: itemCondition,
                location_notes: locationNotes,
                latitude,
                longitude,
                user_email: userEmail,
                created_at: new Date().toISOString(),
            }
        ]);

    if (error) {
        console.error("❌ Error saving report:", error);
        alert("⚠ Failed to save report.");
    } else {
        console.log("✅ Report saved:", data);
        alert("📍 Report submitted successfully!");
    }
}
