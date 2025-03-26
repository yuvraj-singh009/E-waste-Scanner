// ======================
// SUPABASE CONFIGURATION
// ======================
const SUPABASE_URL = 'https://afieewyossvtxetxytnr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmaWVld3lvc3N2dHhldHh5dG5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4MTU3ODAsImV4cCI6MjA0ODM5MTc4MH0._TBxa2B9LPgpeYSuJbBv0ZvrlHw1IbTO1FNs6TEG69U';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ======================
// DOM ELEMENTS
// ======================
const videoElement = document.getElementById('scanner-video');
const canvasElement = document.getElementById('scanner-canvas');
const captureBtn = document.getElementById('capture-btn');
const uploadBtn = document.getElementById('upload-btn');
const fileInput = document.getElementById('file-input');

// ======================
// APP STATE
// ======================
let capturedImage = null;
let currentStream = null;

// ======================
// INITIALIZATION
// ======================
document.addEventListener('DOMContentLoaded', () => {
    captureBtn?.addEventListener('click', captureImage);
    uploadBtn?.addEventListener('click', () => fileInput.click());
    fileInput?.addEventListener('change', handleImageUpload);
    initializeCamera();
});

// ======================
// CAMERA FUNCTIONS
// ======================
async function initializeCamera() {
    try {
        stopCamera();
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
        currentStream = stream;
    } catch (error) {
        console.error('Camera error:', error);
        alert('Camera access denied or unavailable.');
    }
}

function stopCamera() {
    currentStream?.getTracks().forEach(track => track.stop());
}

function captureImage() {
    if (!currentStream) return alert('Camera not initialized.');

    const context = canvasElement.getContext('2d');
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
    context.drawImage(videoElement, 0, 0);

    canvasElement.toBlob(blob => {
        capturedImage = blob;
        alert('Image captured successfully!');
    }, 'image/jpeg');
}

// ======================
// FILE UPLOAD FUNCTIONS
// ======================
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith('image/')) return alert('Invalid image file.');

    const reader = new FileReader();
    reader.onload = event => {
        const img = new Image();
        img.onload = () => {
            const context = canvasElement.getContext('2d');
            canvasElement.width = img.width;
            canvasElement.height = img.height;
            context.drawImage(img, 0, 0);

            canvasElement.toBlob(blob => {
                capturedImage = blob;
                alert('Image uploaded successfully!');
            }, 'image/jpeg');
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

// ======================
// IMAGE UPLOAD TO SUPABASE
// ======================
async function uploadToSupabase() {
    if (!capturedImage) return alert('No image to upload.');

    try {
        const filePath = `uploads/${Date.now()}.jpg`;
        const { error } = await supabase.storage.from('images').upload(filePath, capturedImage);

        if (error) throw error;
        alert('Image uploaded successfully!');
    } catch (error) {
        console.error('Upload error:', error);
        alert('Failed to upload image.');
    }
}
