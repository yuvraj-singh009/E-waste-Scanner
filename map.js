document.addEventListener("DOMContentLoaded", async () => {
    const { createClient } = supabase;
    
    // Supabase Credentials
    const supabaseUrl = "https://afieewyossvtxetxytnr.supabase.co";
    const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmaWVld3lvc3N2dHhldHh5dG5yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjgxNTc4MCwiZXhwIjoyMDQ4MzkxNzgwfQ.agrmFADCTLm4n3w8tykxwIjz9K7MuknHk4GfOCTNWLM";
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

    // Initialize Google Map
    let map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 20.5937, lng: 78.9629 }, // Default center (India)
        zoom: 5
    });

    try {
        // Fetch locations data from Supabase
        const { data, error } = await supabaseClient
            .from("locations") // Replace with your table name
            .select("latitude, longitude");

        if (error) {
            console.error("❌ Error fetching locations:", error);
            return;
        }

        // Convert data to Google Maps LatLng objects
        let heatmapData = data.map(entry => new google.maps.LatLng(entry.latitude, entry.longitude));

        // Create Heatmap Layer
        let heatmap = new google.maps.visualization.HeatmapLayer({
            data: heatmapData,
            map: map,
            radius: 40, // Adjust intensity
            opacity: 0.6,
            gradient: [
                "rgba(0, 255, 255, 0)",
                "rgba(0, 255, 255, 1)",
                "rgba(0, 191, 255, 1)",
                "rgba(0, 127, 255, 1)",
                "rgba(0, 63, 255, 1)",
                "rgba(0, 0, 255, 1)",
                "rgba(0, 0, 223, 1)",
                "rgba(0, 0, 191, 1)",
                "rgba(0, 0, 159, 1)",
                "rgba(0, 0, 127, 1)",
                "rgba(63, 0, 91, 1)",
                "rgba(127, 0, 63, 1)",
                "rgba(191, 0, 31, 1)",
                "rgba(255, 0, 0, 1)"
            ]
        });

    } catch (error) {
        console.error("❌ Fetching Error:", error);
    }
});
