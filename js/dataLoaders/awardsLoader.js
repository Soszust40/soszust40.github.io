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
                let delay = (index + 1) * 0.1;

                const credentialLink = award.url 
                    ? `<div class="award-actions">
                        <a href="${award.url}" target="_blank" class="btn-verify">
                            <i class="fa-solid fa-arrow-up-right-from-square"></i> Verify Credential
                        </a>
                    </div>` 
                    : '';
                    
                const expirationDisplay = award.expiration_date ? ` - ${award.expiration_date}` : '';
                const dateLine = `<span class="project-date">${award.issue_date}${expirationDisplay}</span>`;

                awardsHTML += `
                <div class="award-card animated wow zoomIn" data-wow-delay="${delay}s">
                    <div class="award-item">
                        <div class="award-icon"><i class="${award.icon}"></i></div>
                        <div class="award-details">
                            <h4>${award.title}</h4>
                            <span class="issuer">${award.issuer}</span>
                            ${dateLine}
                            <p>${award.description}</p>
                            ${credentialLink}
                        </div>
                    </div>
                </div>`;
            });

            awardsContainer.innerHTML = awardsHTML.trim();
        })
        .catch(error => console.error('Error loading awards.json:', error));
});