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
            url: "https://kitab-online.vercel.app/",
            category: "Web App",
            image: "https://plus.unsplash.com/premium_photo-1764695579456-9e6f13928281?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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

// 5. Zandev Intel Core (Tracker & 7-Tap Secret)
document.addEventListener('DOMContentLoaded', () => {
    // A. Background Tracker
    fetch('api/track.php').catch(e => console.log('Intel tracking initialized.'));

    // B. 7-Tap Secret Logic
    const logo = document.querySelector('.nav-logo');
    let tapCount = 0;
    let tapTimer;

    if (logo) {
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            tapCount++;
            clearTimeout(tapTimer);
            
            if (tapCount === 7) {
                tapCount = 0;
                triggerHackerPrompt();
            } else {
                tapTimer = setTimeout(() => { tapCount = 0; }, 2000); // Reset if pause > 2s
            }
        });
    }

    function triggerHackerPrompt() {
        if (document.getElementById('hacker-prompt-overlay')) return;

        // Create Overlay
        const overlay = document.createElement('div');
        overlay.id = 'hacker-prompt-overlay';
        overlay.innerHTML = `
            <div class="hacker-prompt-box" style="transition: transform 0.3s ease;">
                <div class="h-header">
                    <span class="h-dot red"></span>
                    <span class="h-dot yellow"></span>
                    <span class="h-dot green"></span>
                    <span class="h-title">zandev_intel_access.sh</span>
                </div>
                <div class="h-body">
                    <p class="h-text">> UNAUTHORIZED ACCESS DETECTED.</p>
                    <p class="h-text">> ENTER DECRYPTION KEY:</p>
                    <form id="hacker-form" method="POST" action="intel-core.php">
                        <span class="h-prompt">root@zandev:~# </span>
                        <input type="password" name="access_key" id="h-input" autocomplete="new-password" data-lpignore="true" autofocus>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        
        // Add CSS dynamically
        const style = document.createElement('style');
        style.id = 'hacker-prompt-style';
        style.innerHTML = `
            #hacker-prompt-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0, 5, 2, 0.95); z-index: 9999;
                display: flex; justify-content: center; align-items: center;
                backdrop-filter: blur(5px); animation: fadeIn 0.3s;
            }
            .hacker-prompt-box {
                width: 400px; max-width: 90%; background: #0a0a0a;
                border: 1px solid #00ff41; border-radius: 8px;
                box-shadow: 0 0 20px rgba(0, 255, 65, 0.2);
                overflow: hidden; font-family: 'Fira Code', monospace;
            }
            .h-header {
                background: #1a1a1a; padding: 10px; display: flex; align-items: center;
                border-bottom: 1px solid #333;
            }
            .h-dot { width: 12px; height: 12px; border-radius: 50%; margin-right: 6px; }
            .h-dot.red { background: #ff5f56; } .h-dot.yellow { background: #ffbd2e; } .h-dot.green { background: #27c93f; }
            .h-title { margin-left: 10px; color: #888; font-size: 12px; }
            .h-body { padding: 20px; }
            .h-text { color: #00ff41; margin-bottom: 10px; font-size: 14px; text-shadow: 0 0 5px rgba(0,255,65,0.5); }
            #hacker-form { display: flex; align-items: center; margin-top: 15px; }
            .h-prompt { color: #00ff41; margin-right: 10px; font-weight: bold; }
            #h-input { 
                background: transparent; border: none; outline: none; 
                color: #fff; font-family: 'Fira Code', monospace; font-size: 14px;
                flex: 1; border-bottom: 1px solid transparent; transition: 0.3s;
            }
            #h-input:focus { border-bottom: 1px solid #00ff41; }
        `;
        document.head.appendChild(style);

        const hInput = document.getElementById('h-input');
        const hBox = document.querySelector('.hacker-prompt-box');
        
        hInput.addEventListener('focus', () => {
            if (window.innerWidth <= 768) hBox.style.transform = 'translateY(-25vh)';
        });
        hInput.addEventListener('blur', () => {
            if (window.innerWidth <= 768) hBox.style.transform = 'translateY(0)';
        });

        // Focus and handle closing
        setTimeout(() => hInput.focus(), 100);
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
                document.getElementById('hacker-prompt-style')?.remove();
            }
        });
    }
});
