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

            // Build the HTML for all cards
            data.forEach((project, index) => {
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
                    <a href="#" class="project-card project-trigger" data-index="${index}">
                        <div class="project-img-container">
                            <img loading="lazy" src="${project.image}" alt="${project.title}">
                            <div class="project-overlay">
                                <div class="overlay-content">
                                    <i class="fa-solid fa-circle-info"></i>
                                    <span>View Details</span>
                                </div>
                            </div>
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

            // Inject the HTML into the page
            portfolioWrapper.innerHTML = projectsHTML;

            // Setup Modal & Preloader Logic
            const modalOverlay = document.getElementById('project-modal-overlay');
            const modalContentArea = document.getElementById('modal-dynamic-content');
            const closeModalBtn = document.getElementById('close-modal-btn');
            
            let previousActiveElement;
            const preloadedImages = new Set();

            function preloadProjectImages(projectIndex) {
                const project = data[projectIndex];
                if (!project) return;
                
                let imagesToLoad = [];
                if (project.gallery && project.gallery.length > 0) {
                    imagesToLoad = project.gallery;
                } else if (project.image) {
                    imagesToLoad = [project.image];
                }

                imagesToLoad.forEach(src => {
                    if (!preloadedImages.has(src)) {
                        const img = new Image(); 
                        img.src = src;
                        preloadedImages.add(src);
                    }
                });
            }

            function openModal(projectIndex) {
                previousActiveElement = document.activeElement;
                const project = data[projectIndex];
                
                let modalIconsHTML = project.technologies.map(tech => {
                    let parts = tech.split('-');
                    let name = parts.length > 1 ? parts[1] : tech;
                    name = name.charAt(0).toUpperCase() + name.slice(1);
                    if (name === 'Cplusplus') name = 'C++';
                    if (name === 'Csharp') name = 'C#';
                    return `<span class="tech-icon-wrapper" data-tech="${name}"><i class="${tech}"></i></span>`;
                }).join('');
                
                let buttonsHTML = '';
                let customBtnText = project.buttonText || "View Project";
                let externalLink = project.liveLink || project.link || "";
                
                if (externalLink) {
                    buttonsHTML += `<a href="${externalLink}" target="_blank" rel="noopener noreferrer" class="modal-btn modal-btn-primary"><i class="fa-solid fa-arrow-up-right-from-square"></i> ${customBtnText}</a>`;
                }
                if (project.downloadLink) {
                    buttonsHTML += `<a href="${project.downloadLink}" target="_blank" rel="noopener noreferrer" class="modal-btn modal-btn-primary"><i class="fa-solid fa-download"></i> Download</a>`;
                }
                if (project.githubLink) {
                    buttonsHTML += `<a href="${project.githubLink}" target="_blank" rel="noopener noreferrer" class="modal-btn modal-btn-secondary"><i class="fa-brands fa-github"></i> GitHub</a>`;
                }

                let isCurrent = project.dates.toLowerCase().includes("current") || project.dates.toLowerCase().includes("present");
                let statusBadge = isCurrent 
                    ? `<span class="modal-badge status-active"><span class="pulse-dot"></span> Active Development</span>` 
                    : `<span class="modal-badge status-completed"><i class="fa-solid fa-check"></i> Completed</span>`;

                let roleHTML = '';
                if (project.role || project.company) {
                    let roleText = project.role ? project.role : '';
                    let compText = project.company ? `<span>at</span> ${project.company}` : '';
                    let separator = (project.role && project.company) ? ' ' : '';
                    roleHTML = `<div class="modal-company-role"><i class="fa-solid fa-user-tie"></i> ${roleText}${separator}${compText}</div>`;
                }

                let mediaHTML = '';
                let galleryClass = '';
                if (project.gallery && project.gallery.length > 0) {
                    galleryClass = 'has-gallery';
                    let images = project.gallery.map((img, index) => {
                        let loadAttr = index === 0 ? 'eager' : 'lazy';
                        return `<img src="${img}" class="modal-gallery-image" alt="App Screenshot" loading="${loadAttr}">`;
                    }).join('');
                    mediaHTML = `<div class="modal-gallery-container">${images}</div>`;
                } else {
                    mediaHTML = `
                    <div class="modal-hero-image-container">
                        <img src="${project.image}" class="modal-hero-image" alt="${project.title}">
                    </div>`;
                }

                modalContentArea.innerHTML = `
                    <div class="${galleryClass}">
                        ${mediaHTML}
                        
                        <div class="modal-header-card">
                            <div class="modal-header-top">
                                <h2>${project.title}</h2>
                                <div class="modal-action-buttons">
                                    ${buttonsHTML}
                                </div>
                            </div>
                            
                            ${roleHTML}

                            <div class="modal-badges">
                                ${statusBadge}
                                <span class="modal-badge"><i class="fa-solid fa-briefcase"></i> ${project.type}</span>
                                <span class="modal-badge"><i class="fa-solid fa-calendar-days"></i> ${project.dates}</span>
                            </div>
                            
                            <div class="modal-tech-stack">${modalIconsHTML}</div>
                        </div>

                        <div class="modal-content-body" style="padding-top: 0;">
                            <div class="modal-text-section">
                                <h4>Overview</h4>
                                <p>${project.detailedDescription || project.description}</p>
                            </div>

                            ${project.whyBuilt ? `
                            <div class="modal-text-section">
                                <h4>Why I Built It</h4>
                                <p>${project.whyBuilt}</p>
                            </div>` : ''}

                            ${project.whatILearned ? `
                            <div class="modal-text-section">
                                <h4>What I Learned</h4>
                                <p>${project.whatILearned}</p>
                            </div>` : ''}
                        </div>
                    </div>
                `;

                document.body.style.overflow = 'hidden';
                modalOverlay.classList.remove('hidden');

                setTimeout(() => { closeModalBtn.focus(); }, 10);
            }

            function closeModal() {
                document.body.style.overflow = '';
                modalOverlay.classList.add('hidden');
                
                if (previousActiveElement) {
                    previousActiveElement.focus();
                }
            }

            // Attach Event Listeners to the cards
            document.querySelectorAll('.project-trigger').forEach(card => {
                card.addEventListener('mouseenter', function() {
                    const index = this.getAttribute('data-index');
                    preloadProjectImages(index);
                });

                card.addEventListener('click', function(e) {
                    e.preventDefault();
                    const index = this.getAttribute('data-index');
                    openModal(index);
                });
            });

            closeModalBtn.addEventListener('click', closeModal);
            modalOverlay.addEventListener('click', function(e) {
                if(e.target === modalOverlay) closeModal();
            });
            document.addEventListener('keydown', function(e) {
                if(e.key === 'Escape' && !modalOverlay.classList.contains('hidden')) {
                    closeModal();
                }
            });

            modalOverlay.addEventListener('keydown', function(e) {
                if (e.key === 'Tab') {
                    const focusable = modalOverlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                    if (focusable.length === 0) return;
                    
                    const first = focusable[0];
                    const last = focusable[focusable.length - 1];

                    if (e.shiftKey) { 
                        if (document.activeElement === first) {
                            last.focus();
                            e.preventDefault();
                        }
                    } else { 
                        if (document.activeElement === last) {
                            first.focus();
                            e.preventDefault();
                        }
                    }
                }
            });

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