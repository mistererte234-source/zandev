/* 
==============================================
   ZANDEV.ID - MAIN JAVASCRIPT
   Handles dynamic data & interactions
============================================== 
*/

document.addEventListener('DOMContentLoaded', () => {
    // 0. Splash Screen Logic
    const splashScreen = document.getElementById('splash-screen');
    const splashLog = document.getElementById('splash-log');
    
    if (splashScreen && splashLog) {
        const logs = [
            "Mounting virtual drives...",
            "Bypassing security protocols...",
            "Decrypting core matrix...",
            "Establishing secure connection...",
            "ACCESS GRANTED."
        ];
        
        let logIndex = 0;
        const logInterval = setInterval(() => {
            if (logIndex < logs.length) {
                splashLog.innerText = logs[logIndex];
                logIndex++;
            }
        }, 400); // 400ms per log

        // Fade out splash screen after 2.5 seconds (matching the loading bar animation)
        setTimeout(() => {
            clearInterval(logInterval);
            document.body.classList.add('loaded');
            // Remove from DOM after transition
            setTimeout(() => {
                splashScreen.style.display = 'none';
            }, 800);
        }, 2500);
    }

    // 1. Dynamic Portfolio Injection
    const portfolioData = [
        {
            title: "Kitab Online",
            description: "Portal pencarian kitab kuning (Turath) & Tafsir Al-Quran era digital. Terintegrasi AI dengan antarmuka futuristik.",
            tags: ["Web App", "Search Engine", "AI"],
            url: "https://kitab.online",
            category: "Web App",
            image: "https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=600&q=80"
        },
        {
            title: "Airlangga Online",
            description: "Platform digital Airlangga Online. Memberikan pengalaman yang responsif dan modern untuk akses informasi.",
            tags: ["Web App", "UI/UX", "Modern"],
            url: "https://airlangga.online",
            category: "Web App",
            image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80"
        },
        {
            title: "Bothway Store",
            description: "E-Commerce modern untuk pengalaman belanja yang seamless, cepat, dan aman.",
            tags: ["E-Commerce", "Web Development", "Integration"],
            url: "https://bothway.store",
            category: "E-Commerce",
            image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80"
        },
        {
            title: "Silaturrahim Online",
            description: "Platform konektivitas digital untuk mempererat tali silaturahmi secara online dengan antarmuka yang ramah pengguna.",
            tags: ["Community", "Social", "Web App"],
            url: "http://silaturrahim.online",
            category: "Web App",
            image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
        },
        // --- Dummy data for testing Load More ---
        {
            title: "Project Alpha", description: "Sistem manajemen data enterprise dengan arsitektur cloud-native.",
            tags: ["Web App", "Enterprise"], url: "#", category: "Web App",
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80"
        },
        {
            title: "Beta Commerce", description: "Platform jualan online generasi berikutnya.",
            tags: ["E-Commerce", "Mobile UI"], url: "#", category: "E-Commerce",
            image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80"
        },
        {
            title: "Gamma Design System", description: "Kumpulan komponen UI/UX untuk aplikasi modern.",
            tags: ["UI/UX", "Design"], url: "#", category: "UI/UX",
            image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80"
        },
        {
            title: "Delta Analytics", description: "Dashboard analitik real-time.",
            tags: ["Web App", "Data"], url: "#", category: "Web App",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80"
        }
    ];

    const portfolioContainer = document.getElementById('portfolio-container');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let currentCategory = 'all';
    let currentPage = 1;
    const itemsPerPage = 6;

    function renderPortfolio() {
        if (!portfolioContainer) return;
        
        // Filter data
        const filteredData = portfolioData.filter(item => {
            return currentCategory === 'all' || item.category === currentCategory;
        });

        // Calculate items to show
        const itemsToShow = filteredData.slice(0, currentPage * itemsPerPage);

        // Render HTML
        portfolioContainer.innerHTML = '';
        itemsToShow.forEach((item, index) => {
            const cardHTML = `
                <div class="glass-card portfolio-item" style="animation: fadeIn 0.5s ease forwards; animation-delay: ${(index % itemsPerPage) * 50}ms; opacity: 0;">
                    <img src="${item.image}" alt="${item.title}" class="portfolio-image" loading="lazy">
                    <div class="portfolio-content">
                        <h3 class="portfolio-title">${item.title}</h3>
                        <p class="portfolio-desc">${item.description}</p>
                        <div class="portfolio-tags">
                            ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                        <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="portfolio-link">
                            [ Execute_Link ] <i class="ph ph-arrow-up-right"></i>
                        </a>
                    </div>
                </div>
            `;
            portfolioContainer.innerHTML += cardHTML;
        });

        // Update Load More button
        if (loadMoreBtn) {
            if (filteredData.length > currentPage * itemsPerPage) {
                loadMoreBtn.style.display = 'inline-flex';
            } else {
                loadMoreBtn.style.display = 'none';
            }
        }
    }

    // Initial render
    renderPortfolio();

    // Load More click handler
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            currentPage++;
            renderPortfolio();
        });
    }

    // Filter click handlers
    if (filterBtns) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                currentCategory = e.target.getAttribute('data-filter');
                currentPage = 1;
                renderPortfolio();
            });
        });
    }

    // 2. Terminal Typing Effect
    const terminalElement = document.getElementById('terminal-typing');
    if (terminalElement) {
        const lines = [
            "Initializing Zandev.id Core...",
            "Loading modules: [██████████] 100%",
            "Connecting to database...",
            "SUCCESS: Connection established.",
            "Fetching portfolio data...",
            "-> 4 records found.",
            "Rendering UI components...",
            "System status: OPTIMAL.",
            "Awaiting user input..."
        ];

        let lineIndex = 0;
        
        function typeLine() {
            if (lineIndex < lines.length) {
                const p = document.createElement('div');
                p.innerHTML = `> ${lines[lineIndex]}`;
                p.style.opacity = '0';
                p.style.animation = 'fadeIn 0.1s forwards';
                terminalElement.appendChild(p);
                
                lineIndex++;
                
                // Keep scroll at bottom
                terminalElement.scrollTop = terminalElement.scrollHeight;
                
                setTimeout(typeLine, Math.random() * 400 + 200);
            } else {
                const cursor = document.createElement('span');
                cursor.className = 'cursor';
                terminalElement.appendChild(cursor);
            }
        }
        
        setTimeout(typeLine, 1000); // start after 1s
    }

    // 3. Navbar scroll effect
    const navbar = document.querySelector('.glass-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '0.5rem 0';
            navbar.style.background = 'rgba(2, 5, 2, 0.8)';
        } else {
            navbar.style.padding = '1rem 0';
            navbar.style.background = 'rgba(5, 20, 10, 0.4)';
        }
    });

    // 4. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
});
// Add basic CSS animations on the fly
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
}
`;
document.head.appendChild(style);
