document.addEventListener("DOMContentLoaded", () => {
    const locationBtn = document.getElementById("get-location");

    if (!locationBtn) {
        console.error("❌ Missing 'Get Location' button!");
        return;
    }

    locationBtn.addEventListener("click", () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        locationBtn.innerHTML = "<i class='fas fa-spinner fa-spin'></i> Getting Location...";

        navigator.geolocation.getCurrentPosition(async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log(`📍 Location: ${latitude}, ${longitude}`);

            locationBtn.innerHTML = "<i class='fas fa-check'></i> Location Captured!";
            locationBtn.disabled = true; // Disable after getting location

            // Save to Supabase
            await saveLocationToSupabase(latitude, longitude);
        }, (error) => {
            alert("⚠ Unable to retrieve location: " + error.message);
            locationBtn.innerHTML = "<i class='fas fa-map-marker-alt'></i> Get Current Location";
        });
    });
});

/**
 * Save location data to Supabase
 */
async function saveLocationToSupabase(latitude, longitude) {
    const { createClient } = supabase;
    
    // Initialize Supabase
    const supabaseUrl = "https://afieewyossvtxetxytnr.supabase.co";
    const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmaWVld3lvc3N2dHhldHh5dG5yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjgxNTc4MCwiZXhwIjoyMDQ4MzkxNzgwfQ.agrmFADCTLm4n3w8tykxwIjz9K7MuknHk4GfOCTNWLM";
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

    // Insert location into Supabase table
    const { data, error } = await supabaseClient
        .from("locations") // Replace with your table name
        .insert([{ latitude, longitude, created_at: new Date().toISOString() }]);

    if (error) {
        console.error("❌ Error saving location:", error);
        alert("⚠ Failed to save location.");
    } else {
        console.log("✅ Location saved:", data);
        alert("📍 Location saved successfully!");
    }
}
