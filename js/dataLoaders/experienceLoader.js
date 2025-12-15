document.addEventListener("DOMContentLoaded", function () {
    const timelineContainer = document.getElementById('experience-timeline');
    if (!timelineContainer) return;

    fetch('data/experience.json')
        .then(response => response.json())
        .then(data => {
            let timelineHTML = '';

            data.forEach(yearGroup => {
                timelineHTML += `
                <div class="date-title">
                    <span>${yearGroup.year}</span>
                </div>
                <div class="row">`;

                yearGroup.jobs.forEach(job => {
                    const sideClass = job.side === 'right' ? 'right' : '';

                    // Calculate Duration
                    const durationText = calculateDuration(job.startDate, job.endDate);

                    // Build Bullets
                    let bulletsHTML = '';
                    job.description.forEach(point => {
                        bulletsHTML += `<li>${point}</li>`;
                    });

                    // Build Tags
                    let tagsHTML = '';
                    if (job.tags) {
                        tagsHTML = '<div class="job-tags">';
                        job.tags.forEach(tag => {
                            tagsHTML += `<span class="job-tag">${tag}</span>`;
                        });
                        tagsHTML += '</div>';
                    }

                    timelineHTML += `
                    <div class="col-sm-6 experience-item ${sideClass}">
                        <div class="experience-content">
                            <div class="date">
                                <img src="${job.logo}" alt="${job.company}" class="experience-image">
                            </div>
                            
                            <h2 class="experience-title">${job.title}</h2>
                            <span class="company-name">${job.company}</span>
                            
                            <div class="job-meta">
                                <p class="job-dates">
                                    <i class="fa fa-calendar"></i> ${job.startDate} – ${job.endDate} 
                                    <span class="duration">${durationText}</span>
                                </p>
                                <p class="job-location"><i class="fa fa-map-marker"></i> ${job.location}</p>
                            </div>

                            <ul>${bulletsHTML}</ul>
                            
                            ${tagsHTML}

                            <a class="read-more" href="${job.link}" target="_blank">
                                Visit Website <i class="fa fa-external-link"></i>
                            </a>
                        </div>
                    </div>`;
                });

                timelineHTML += `</div>`;
            });

            timelineContainer.innerHTML = timelineHTML;
        })
        .catch(error => console.error('Error:', error));
});

// Helper: Calculate Duration
function calculateDuration(startStr, endStr) {
    if (!startStr || !endStr) return "";

    const startDate = new Date(startStr);
    const endDate = endStr === "Current" ? new Date() : new Date(endStr);

    if (isNaN(startDate) || isNaN(endDate)) return "";

    let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += endDate.getMonth();
    months += 1; 

    if (months <= 0) return "";

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    let result = "(";
    if (years > 0) result += `${years} yr${years > 1 ? 's' : ''} `;
    if (remainingMonths > 0) result += `${remainingMonths} mo${remainingMonths > 1 ? 's' : ''}`;
    result += ")";

    return result.trim() === "()" ? "" : result;
}