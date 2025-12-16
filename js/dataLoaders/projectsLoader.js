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

            function getInitialItemsCount() {
                const width = window.innerWidth;
                if (width > 1200) {
                    return 8; // Desktop: 4 cols * 2 rows
                } else if (width > 900) {
                    return 6; // Laptop: 3 cols * 2 rows
                } else if (width > 600) {
                    return 4; // Tablet: 2 cols * 2 rows
                } else {
                    return 4; // Mobile: 1 col * 2 rows
                }
            }

            const initialItems = getInitialItemsCount();
            const loadIncrement = initialItems / 2;
            let visibleCount = initialItems;
            let currentFilter = '*';

            // Create Load More Button
            const loadMoreContainer = document.createElement('div');
            loadMoreContainer.id = 'load-more-container';
            loadMoreContainer.style.textAlign = 'center';
            loadMoreContainer.style.marginTop = '30px';
            loadMoreContainer.style.width = '100%';
            loadMoreContainer.style.display = 'none'; 
            
            loadMoreContainer.innerHTML = `<a href="#" id="load-more-btn" class="read_more">Load More Projects</a>`;
            portfolioWrapper.parentNode.insertBefore(loadMoreContainer, portfolioWrapper.nextSibling);

            // Initialize Isotope
            if (window.jQuery && window.jQuery.fn.isotope) {
                var $container = window.jQuery('#portfolio_wrapper');
                
                if ($container.data('isotope')) {
                    $container.isotope('destroy');
                }

                // Helper to show/hide the button
                function updateLoadMoreVisibility() {
                    const totalItems = data.length;
                    if (currentFilter === '*' && visibleCount < totalItems) {
                        window.jQuery('#load-more-container').show();
                    } else {
                        window.jQuery('#load-more-container').hide();
                    }
                }

                // This function decides if an item shows or hides
                function isotopeFilterLogic() {
                    if (currentFilter !== '*') {
                        return window.jQuery(this).is(currentFilter);
                    }
                    return window.jQuery(this).index() < visibleCount;
                }

                setTimeout(function() {
                    $container.isotope({
                        itemSelector: '.portfolio-item',
                        layoutMode: 'fitRows',
                        filter: isotopeFilterLogic,
                        animationOptions: {
                            duration: 750,
                            easing: 'linear',
                            queue: false
                        }
                    });
                    
                    updateLoadMoreVisibility();

                }, 100);

                // Handle Filter Clicks
                window.jQuery('#filters a').click(function(){
                    window.jQuery('#filters .active').removeClass('active');
                    window.jQuery(this).addClass('active');
                    
                    currentFilter = window.jQuery(this).attr('data-filter');
                    if (currentFilter === '*') { visibleCount = initialItems; }
                    $container.isotope({ filter: isotopeFilterLogic });
                    
                    updateLoadMoreVisibility();
                    return false;
                });

                // Handle Load More Click
                window.jQuery('#load-more-btn').click(function(e) {
                    e.preventDefault();
                    
                    visibleCount += loadIncrement;
                    
                    $container.isotope({ filter: isotopeFilterLogic });
                    
                    updateLoadMoreVisibility();
                });
            }
        })
        .catch(error => console.error('Error loading projects.json:', error));

    // Hide Floating Tools Button on Scroll for Phones
    const toolsBtn = document.querySelector('.float-tools-btn');
    
    if (toolsBtn) {
        window.addEventListener('scroll', function() {
            if (window.innerWidth < 768) {
                const scrollThreshold = 800; 
                
                if (window.scrollY > scrollThreshold) {
                    toolsBtn.classList.add('fade-out');
                } else {
                    toolsBtn.classList.remove('fade-out');
                }
            } else {
                toolsBtn.classList.remove('fade-out');
            }
        });
    }
});