
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Initialize theme
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Add subtle animation feedback
    themeToggle.style.transform = 'scale(0.95)';
    setTimeout(() => themeToggle.style.transform = 'scale(1)', 150);
});

// Mobile Navigation Toggle
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.querySelector('.nav-menu');

mobileToggle?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileToggle.classList.toggle('active');
});

// Smooth Scroll with Offset for Fixed Header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Feature Card Interaction
async function handleOption(feature) {
    const responseBox = document.getElementById('serverResponse');
    const responseStatus = document.getElementById('responseStatus');
    
    // Update UI to loading state
    responseStatus.textContent = 'Processing...';
    responseBox.innerHTML = '<span class="loading-dots">Connecting to server</span>';
    responseBox.style.opacity = '0.7';
    
    try {
        const response = await fetch('http://localhost:3000/api/feature', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ 
                feature, 
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
            })
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        // Success UI update
        responseStatus.textContent = 'Connected';
        responseBox.style.opacity = '1';
        responseBox.innerHTML = `
            <div style="color: var(--text-primary);">
                <div style="margin-bottom: 0.5rem; color: var(--primary); font-weight: 600;">
                    ✓ ${data.feature.toUpperCase()} activated
                </div>
                <div style="font-size: 0.8rem; color: var(--text-tertiary); margin-bottom: 0.75rem;">
                    Server: ${data.serverTime} • ID: ${data.data?.id || 'N/A'}
                </div>
                <div style="color: var(--text-secondary);">
                    ${data.message}
                </div>
            </div>
        `;
        
    } catch (error) {
        // Error UI update
        responseStatus.textContent = 'Error';
        responseBox.style.opacity = '1';
        responseBox.innerHTML = `
            <div style="color: #ef4444;">
                <div style="font-weight: 600; margin-bottom: 0.5rem;">⚠ Connection Failed</div>
                <div style="font-size: 0.8rem; color: var(--text-tertiary);">
                    ${error.message}<br>
                    Ensure server is running on localhost:3000
                </div>
            </div>
        `;
    }
}

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
const contactResponse = document.getElementById('contactResponse');
const submitBtn = contactForm?.querySelector('button[type="submit"]');

contactForm?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const name = formData.get('name');
    
    // Loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    contactResponse.className = 'form-response';
    contactResponse.style.display = 'none';
    
    // Simulate API call (replace with actual endpoint)
    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Success state
        contactResponse.className = 'form-response success';
        contactResponse.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span>✓</span>
                <span>Thanks ${name}! Your message has been sent successfully.</span>
            </div>
        `;
        contactResponse.style.display = 'block';
        this.reset();
        
    } catch (error) {
        contactResponse.className = 'form-response error';
        contactResponse.textContent = 'Failed to send message. Please try again.';
        contactResponse.style.display = 'block';
        
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
});

// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.about-card, .feature-card').forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
});

// Navbar Scroll Effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = 'var(--shadow-md)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});