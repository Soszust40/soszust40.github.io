document.addEventListener("DOMContentLoaded", function () {
    const awardsContainer = document.getElementById('awards-container');

    if (!awardsContainer) {
        console.warn('Awards container not found.');
        return;
    }

    fetch('data/awards.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            let awardsHTML = '';

            data.forEach((award, index) => {
                // Stagger animations
                let delay = (index + 1) * 0.1;
                
                awardsHTML += `
                <div class="col-md-4 delay-0${index + 2}s animated wow zoomIn" data-wow-delay="${delay}s">
                    <div class="award-item">
                        <div class="award-icon">
                            <i class="${award.icon}"></i>
                        </div>
                        <div class="award-details">
                            <h4>${award.title}</h4>
                            <span class="issuer">${award.issuer}</span>
                            <span class="project-date" style="display:block; margin-bottom:10px; color:#888; font-size:11px; font-weight:600;">${award.date}</span>
                            <p>${award.description}</p>
                        </div>
                    </div>
                </div>`;
            });

            awardsContainer.innerHTML = awardsHTML;
        })
        .catch(error => console.error('Error loading awards.json:', error));
});