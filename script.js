// Supabase Configuration
const supabaseUrl = 'https://afieewyossvtxetxytnr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmaWVld3lvc3N2dHhldHh5dG5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4MTU3ODAsImV4cCI6MjA0ODM5MTc4MH0._TBxa2B9LPgpeYSuJbBv0ZvrlHw1IbTO1FNs6TEG69U';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// DOM Elements
const loginBtn = document.getElementById('login-btn');
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');
const successModal = document.getElementById('success-modal');
const closeModals = document.querySelectorAll('.close-modal');
const showSignup = document.getElementById('show-signup');
const showLogin = document.getElementById('show-login');
const closeSuccess = document.getElementById('close-success');
const scanNowBtn = document.getElementById('scan-now');
const scannerSection = document.getElementById('scanner');
const scannerVideo = document.getElementById('scanner-video');
const scannerCanvas = document.getElementById('scanner-canvas');
const captureBtn = document.getElementById('capture-btn');
const uploadBtn = document.getElementById('upload-btn');
const fileInput = document.getElementById('file-input');
const toggleFlash = document.getElementById('toggle-flash');
const switchCamera = document.getElementById('switch-camera');
const getLocationBtn = document.getElementById('get-location');
const reportForm = document.getElementById('report-form');
const reportsGallery = document.getElementById('reports-gallery');

// App State
let currentStream = null;
let frontCamera = false;
let flashOn = false;
let currentLocation = null;
let capturedImage = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Load recent reports
    loadRecentReports();
    
    // Set up event listeners
    setupEventListeners();
    
    // Add scroll effect to header
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        header.classList.toggle('scrolled', window.scrollY > 50);
    });
});

function setupEventListeners() {
    // Modal interactions
    loginBtn.addEventListener('click', () => loginModal.classList.add('active'));
    showSignup.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.classList.remove('active');
        signupModal.classList.add('active');
    });
    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        signupModal.classList.remove('active');
        loginModal.classList.add('active');
    });
    closeSuccess.addEventListener('click', () => successModal.classList.remove('active'));
    
    closeModals.forEach(btn => {
        btn.addEventListener('click', () => {
            loginModal.classList.remove('active');
            signupModal.classList.remove('active');
        });
    });
    
    // Scanner interactions
    scanNowBtn.addEventListener('click', () => {
        scannerSection.scrollIntoView({ behavior: 'smooth' });
        initScanner();
    });
    
    captureBtn.addEventListener('click', captureImage);
    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileUpload);
    toggleFlash.addEventListener('click', toggleFlashLight);
    switchCamera.addEventListener('click', switchCameraFn);
    getLocationBtn.addEventListener('click', getCurrentLocation);
    reportForm.addEventListener('submit', submitReport);
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            loginModal.classList.remove('active');
            signupModal.classList.remove('active');
            successModal.classList.remove('active');
        }
    });
}

// Scanner Functions
async function initScanner() {
    try {
        const constraints = {
            video: {
                facingMode: frontCamera ? 'user' : 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        scannerVideo.srcObject = stream;
        currentStream = stream;
    } catch (err) {
        console.error('Error accessing camera:', err);
        alert('Could not access the camera. Please make sure you have granted camera permissions.');
    }
}

function captureImage() {
    if (!currentStream) {
        alert('Please initialize the scanner first');
        return;
    }
    
    const context = scannerCanvas.getContext('2d');
    scannerCanvas.width = scannerVideo.videoWidth;
    scannerCanvas.height = scannerVideo.videoHeight;
    context.drawImage(scannerVideo, 0, 0, scannerCanvas.width, scannerCanvas.height);
    
    // Convert canvas to blob
    scannerCanvas.toBlob((blob) => {
        capturedImage = blob;
        alert('Image captured successfully! Please fill out the report details.');
    }, 'image/jpeg', 0.9);
}

function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.match('image.*')) {
        alert('Please select an image file');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            const context = scannerCanvas.getContext('2d');
            scannerCanvas.width = img.width;
            scannerCanvas.height = img.height;
            context.drawImage(img, 0, 0);
            
            // Convert canvas to blob
            scannerCanvas.toBlob((blob) => {
                capturedImage = blob;
                alert('Image uploaded successfully! Please fill out the report details.');
            }, 'image/jpeg', 0.9);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function toggleFlashLight() {
    if (!currentStream) return;
    
    flashOn = !flashOn;
    const track = currentStream.getVideoTracks()[0];
    
    if (track.getCapabilities().torch) {
        track.applyConstraints({
            advanced: [{ torch: flashOn }]
        }).then(() => {
            toggleFlash.innerHTML = flashOn ? '<i class="fas fa-bolt"></i>' : '<i class="far fa-bolt"></i>';
        }).catch(err => {
            console.error('Error toggling flash:', err);
        });
    } else {
        alert('Flash is not supported on this device');
    }
}

function switchCameraFn() {
    if (!currentStream) return;
    
    // Stop the current stream
    currentStream.getTracks().forEach(track => track.stop());
    
    // Switch camera
    frontCamera = !frontCamera;
    initScanner();
}

// Location Functions
function getCurrentLocation() {
    if (navigator.geolocation) {
        getLocationBtn.disabled = true;
        getLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Locating...';
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                getLocationBtn.innerHTML = '<i class="fas fa-check-circle"></i> Location Captured';
                getLocationBtn.style.backgroundColor = '#4CAF50';
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('Could not get your location. Please make sure location services are enabled.');
                getLocationBtn.disabled = false;
                getLocationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Get Current Location';
            }
        );
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

// Report Functions
async function submitReport(e) {
    e.preventDefault();
    
    if (!capturedImage) {
        alert('Please capture or upload an image first');
        return;
    }
    
    if (!currentLocation) {
        alert('Please get your current location');
        return;
    }
    
    const itemType = document.getElementById('item-type').value;
    const itemCondition = document.getElementById('item-condition').value;
    const locationNotes = document.getElementById('location-notes').value;
    const userEmail = document.getElementById('user-email').value;
    
    // Show loading state
    const submitBtn = reportForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    
    try {
        // Upload image to Supabase Storage
        const fileExt = capturedImage.type.split('/')[1];
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `reports/${fileName}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('e-waste-reports')
            .upload(filePath, capturedImage);
        
        if (uploadError) throw uploadError;
        
        // Get public URL of the uploaded image
        const { data: urlData } = supabase.storage
            .from('e-waste-reports')
            .getPublicUrl(filePath);
        
        // Insert report data to Supabase
        const { data: reportData, error: reportError } = await supabase
            .from('reports')
            .insert([
                {
                    item_type: itemType,
                    condition: itemCondition,
                    image_url: urlData.publicUrl,
                    location: currentLocation,
                    location_notes: locationNotes,
                    reporter_email: userEmail,
                    status: 'pending'
                }
            ]);
        
        if (reportError) throw reportError;
        
        // Show success message
        successModal.classList.add('active');
        reportForm.reset();
        capturedImage = null;
        currentLocation = null;
        getLocationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Get Current Location';
        getLocationBtn.style.backgroundColor = '';
        
        // Reload recent reports
        loadRecentReports();
    } catch (error) {
        console.error('Error submitting report:', error);
        alert('There was an error submitting your report. Please try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

async function loadRecentReports() {
    try {
        const { data: reports, error } = await supabase
            .from('reports')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(6);
        
        if (error) throw error;
        
        // Clear gallery
        reportsGallery.innerHTML = '';
        
        // Add reports to gallery
        reports.forEach(report => {
            const reportCard = document.createElement('div');
            reportCard.className = 'report-card';
            
            reportCard.innerHTML = `
                <div class="report-image">
                    <img src="${report.image_url}" alt="${report.item_type}">
                </div>
                <div class="report-details">
                    <span class="report-type">${report.item_type}</span>
                    <p class="report-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${report.location_notes || 'Location reported'}
                    </p>
                    <p class="report-date">
                        ${new Date(report.created_at).toLocaleDateString()}
                    </p>
                </div>
            `;
            
            reportsGallery.appendChild(reportCard);
        });
    } catch (error) {
        console.error('Error loading reports:', error);
    }
}

// Clean up camera stream when leaving the page
window.addEventListener('beforeunload', () => {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }
});