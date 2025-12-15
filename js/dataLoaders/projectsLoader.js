document.addEventListener("DOMContentLoaded", function () {
    const portfolioWrapper = document.getElementById('portfolio_wrapper');

    if (!portfolioWrapper) {
        return;
    }

    fetch('data/projects.json')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            let projectsHTML = '';

            data.forEach((project) => {
                let iconsHTML = project.technologies.map(tech => {
                    // Logic to extract a clean name from the class string
                    let parts = tech.split('-');
                    let name = parts.length > 1 ? parts[1] : tech; 

                    // Capitalize first letter
                    name = name.charAt(0).toUpperCase() + name.slice(1);

                    // Manual fixes for common tech names
                    if (name === 'Cplusplus') name = 'C++';
                    if (name === 'Csharp') name = 'C#';
                    if (name === 'Html5') name = 'HTML5';
                    if (name === 'Css3') name = 'CSS3';
                    if (name === 'Javascript') name = 'JS';
                    if (name === 'Typescript') name = 'TS';
                    if (name === 'Androidstudio') name = 'Android Studio';

                    return `<span class="tech-icon-wrapper" data-tech="${name}">
                                <i class="${tech}"></i>
                            </span>`;
                }).join('');

                let typeClass = project.type.toLowerCase(); 
                let statusClass = "";
                let dateClass = "";

                if (project.dates.toLowerCase().includes("current") || project.dates.toLowerCase().includes("present")) {
                    statusClass = "present"; 
                    dateClass = "present"; 
                }

                let wrapperClasses = `portfolio-item isotope-item ${project.category} ${typeClass} ${statusClass}`;

                projectsHTML += `
                <div class="${wrapperClasses}">
                    <a href="${project.link}" target="_blank" class="project-card">
                        <div class="project-img-container">
                            <img loading="lazy" src="${project.image}" alt="${project.title}">
                        </div>
                        <div class="project-content">
                            <div class="project-tech-header">
                                <div class="project-icons">${iconsHTML}</div>
                                <span class="project-type-tag ${typeClass}">${project.type}</span>
                            </div>

                            <h3 class="project-title">${project.title}</h3>
                            <span class="project-date ${dateClass}">${project.dates}</span>
                            <p>${project.description}</p>
                        </div>
                    </a>
                </div>`;
            });

            portfolioWrapper.innerHTML = projectsHTML;

            // Initialize Isotope
            if (window.jQuery && window.jQuery.fn.isotope) {
                var $container = window.jQuery('#portfolio_wrapper');
                
                if ($container.data('isotope')) {
                    $container.isotope('destroy');
                }

                setTimeout(function() {
                    $container.isotope({
                        itemSelector: '.portfolio-item',
                        layoutMode: 'fitRows',
                        animationOptions: {
                            duration: 750,
                            easing: 'linear',
                            queue: false
                        }
                    });
                }, 100);

                window.jQuery('#filters a').click(function(){
                    window.jQuery('#filters .active').removeClass('active');
                    window.jQuery(this).addClass('active');
                    var selector = window.jQuery(this).attr('data-filter');
                    $container.isotope({ filter: selector });
                    return false;
                });
            }
        })
        .catch(error => console.error('Error loading projects.json:', error));
});