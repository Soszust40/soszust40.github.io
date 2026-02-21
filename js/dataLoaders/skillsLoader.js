document.addEventListener("DOMContentLoaded", function () {
    const codingContainer = document.getElementById('coding-skills-container');
    const toolsContainer = document.getElementById('tools-skills-container');
    const leadershipContainer = document.getElementById('leadership-skills-container');

    if (!codingContainer || !toolsContainer || !leadershipContainer) {
        return;
    }

    const currentYear = new Date().getFullYear();

    fetch('data/skills.json')
        .then(response => response.json())
        .then(data => {

            // Helper function to format years text
            const getYearsText = (startYear) => {
                const diff = currentYear - startYear;
                const yearsCount = diff <= 0 ? 1 : diff;
                return `${yearsCount} Year${yearsCount > 1 ? 's' : ''}`;
            };
            
            // Load Coding Skills
            let codingHTML = '';
            const levelMap = {
                "Learning": 1,
                "Intermediate": 2,
                "Proficient": 3,
                "Advanced": 4,
                "Expert": 5
            };

            data.coding.forEach((skill, index) => {
                let delay = (index + 1) * 0.1; 
                let levelScore = levelMap[skill.level] || 1; 

                let segmentsHTML = '';
                for (let i = 1; i <= 5; i++) {
                    let activeClass = i <= levelScore ? 'filled' : '';
                    segmentsHTML += `<div class="segment ${activeClass}"></div>`;
                }

                codingHTML += `
                <div class="skill-bar-wrapper wow fadeInLeft" data-wow-delay="${delay}s">
                    <div class="skill-header">
                        <span class="skill-name"><i class="${skill.icon}"></i> ${skill.name}</span>
                        <div class="skill-meta">
                            <span class="skill-level-text">${skill.level}</span>
                            <span class="skill-years">• ${getYearsText(skill.year)}</span>
                        </div>
                    </div>
                    
                    <div class="skill-segments-container">
                        ${segmentsHTML}
                    </div>
                    
                    <div class="segment-labels">
                        <span>Learn</span>
                        <span>Inter</span>
                        <span>Prof</span>
                        <span>Adv</span>
                        <span>Expert</span>
                    </div>
                </div>`;
            });
            codingContainer.innerHTML = codingHTML;

            // Load Skills
            let toolsHTML = '';
            data.tools.forEach(tool => {
                toolsHTML += `
                <div class="tool-item">
                    <i class="${tool.icon}"></i>
                    <span class="tool-name">${tool.name}</span>
                    <span class="tool-years">${getYearsText(tool.year)}</span>
                </div>`;
            });
            toolsContainer.innerHTML = toolsHTML;

            // Load Leadership Skills
            let leadershipHTML = '';
            data.leadership.forEach(item => {
                leadershipHTML += `
                <li>
                    <i class="fa fa-check-circle"></i> 
                    <strong>${item.title}</strong> ${item.desc}
                </li>`;
            });
            leadershipContainer.innerHTML = leadershipHTML;
        })
        .catch(error => console.error('Error loading skills.json:', error));
});