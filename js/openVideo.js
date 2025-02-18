// Function to open the video in a new tab
function openVideoInNewTab(videoURL) {
    window.open(videoURL, '_blank');
}

// Event listener for the portfolio item click
document.querySelectorAll('.portfolio-item').forEach(function(item) {
    if (item.hasAttribute('data-video')) {
        item.addEventListener('click', function() {
            const videoURL = item.getAttribute('data-video');  // Get video path from data-video attribute
            openVideoInNewTab(videoURL);
        });
    }
});
