document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. STICKY HEADER & MOBILE NAV TOGGLE
       ========================================================================== */
    const header = document.querySelector('.header');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
        trackActiveLink();
    });

    // Mobile menu toggle
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('open')) {
                icon.classList.replace('fa-bars', 'fa-xmark');
            } else {
                icon.classList.replace('fa-xmark', 'fa-bars');
            }
        });
    }

    // Close mobile menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
                mobileToggle.querySelector('i').classList.replace('fa-xmark', 'fa-bars');
            }
        });
    });

    // Track active nav links on scroll
    function trackActiveLink() {
        const scrollPos = window.scrollY + 120;
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    /* ==========================================================================
       2. SCROLL REVEAL ANIMATIONS
       ========================================================================== */
    const revealElements = [
        document.querySelector('.hero-content'),
        document.querySelector('.hero-visual'),
        document.querySelector('.courses-section .section-header'),
        document.querySelector('.age-filter-container'),
        document.querySelector('.courses-grid'),
        document.querySelector('.robolab-section .section-header'),
        document.querySelector('.robolab-grid'),
        document.querySelector('.benefits-section .section-header'),
        document.querySelector('.benefits-grid'),
        document.querySelector('.journey-section .section-header'),
        document.querySelector('.timeline'),
        document.querySelector('.testimonials-section .section-header'),
        document.querySelector('.slider-wrapper'),
        document.querySelector('.faqs-section .section-header'),
        document.querySelector('.faq-accordion')
    ];

    // Add reveal-el class to elements dynamically
    revealElements.forEach(el => {
        if (el) el.classList.add('reveal-el');
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-el', 'active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        if (el) revealObserver.observe(el);
    });


    /* ==========================================================================
       3. COURSE AGE FILTER
       ========================================================================== */
    const filterTabs = document.querySelectorAll('.filter-tab');
    const courseCards = document.querySelectorAll('.course-card');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const selectedAge = tab.getAttribute('data-age');

            courseCards.forEach(card => {
                const cardGroup = card.getAttribute('data-age-group');
                
                // Add fade out
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';

                setTimeout(() => {
                    if (selectedAge === 'all' || selectedAge === cardGroup) {
                        card.classList.remove('hide');
                        // Trigger reflow to restart animation
                        card.offsetHeight; 
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    } else {
                        card.classList.add('hide');
                    }
                }, 300);
            });
        });
    });


    /* ==========================================================================
       4. INTERACTIVE ROBOT BUILDER (ROBOLAB)
       ========================================================================== */
    const robotParts = {
        base: 'wheels',
        sensor: 'ultrasonic',
        utility: 'gripper'
    };

    const optButtons = document.querySelectorAll('.opt-btn');
    const renderBase = document.getElementById('render-base');
    const renderEye = document.getElementById('render-eye');
    const renderBody = document.getElementById('render-body');
    const robotNameEl = document.getElementById('robot-computed-name');
    const robotDescEl = document.getElementById('robot-computed-desc');
    const powerBtn = document.getElementById('power-on-btn');
    const simulator = document.getElementById('robot-simulator');
    const statusDot = document.getElementById('robot-status-indicator');
    const logBox = document.getElementById('lab-console-log');

    // Stat bars
    const statSpeedBar = document.getElementById('stat-speed-bar');
    const statSpeedVal = document.getElementById('stat-speed-val');
    const statIntelBar = document.getElementById('stat-intel-bar');
    const statIntelVal = document.getElementById('stat-intel-val');
    const statManipBar = document.getElementById('stat-manip-bar');
    const statManipVal = document.getElementById('stat-manip-val');

    // Robot config catalogs
    const partData = {
        base: {
            wheels: { name: 'Sprint', speed: 90, class: 'base-wheels', desc: 'high-speed indoor wheels' },
            treads: { name: 'Rover', speed: 60, class: 'base-treads', desc: 'heavy all-terrain treads' },
            legs: { name: 'Spider', speed: 50, class: 'base-legs', desc: 'agile quadruped spider legs' }
        },
        sensor: {
            ultrasonic: { name: 'Alpha', intel: 40, class: 'sensor-ultrasonic', desc: 'sonar echo rangefinders' },
            camera: { name: 'Vision', intel: 90, class: 'sensor-camera', desc: 'AI computer vision camera' },
            laser: { name: 'Lidar', intel: 75, class: 'sensor-laser', desc: '360° laser lidar scanner' }
        },
        utility: {
            gripper: { name: 'Carrier', manip: 85, class: 'utility-gripper', desc: 'pneumatic gripper claws' },
            'laser-pointer': { name: 'Beacon', manip: 60, class: 'utility-laser-pointer', desc: 'glowing alignment lasers' },
            display: { name: 'Buddy', manip: 40, class: 'utility-display', desc: 'expressive OLED graphics display' }
        }
    };

    optButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.getAttribute('data-type');
            const value = btn.getAttribute('data-value');

            // Set active class
            document.querySelectorAll(`.opt-btn[data-type="${type}"]`).forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update configuration state
            robotParts[type] = value;
            updateRobotGraphics();
        });
    });

    function updateRobotGraphics() {
        const baseInfo = partData.base[robotParts.base];
        const sensorInfo = partData.sensor[robotParts.sensor];
        const utilityInfo = partData.utility[robotParts.utility];

        // 1. Update render classes
        renderBase.className = `robot-component base-component ${baseInfo.class}`;
        renderEye.className = `robot-component eye-component ${sensorInfo.class}`;
        renderBody.className = `robot-component body-component ${utilityInfo.class}`;

        // 2. Update computed names
        const robotName = `${baseInfo.name}Bot-${sensorInfo.name}`;
        robotNameEl.innerText = robotName;

        // 3. Update descriptions
        const desc = `The ${robotName} is an interactive prototype designed using ${baseInfo.desc} for movement. It integrates a ${sensorInfo.desc} for cognition and a ${utilityInfo.desc} as its primary utility system.`;
        robotDescEl.innerText = desc;

        // 4. Update spec progress bars
        statSpeedBar.style.width = `${baseInfo.speed}%`;
        statSpeedVal.innerText = `${baseInfo.speed}%`;

        statIntelBar.style.width = `${sensorInfo.intel}%`;
        statIntelVal.innerText = `${sensorInfo.intel}%`;

        statManipBar.style.width = `${utilityInfo.manip}%`;
        statManipVal.innerText = `${utilityInfo.manip}%`;

        // If simulator was active, reset active status to show changes clearly
        if (simulator.classList.contains('active')) {
            turnOffRobot();
        }
    }

    // Power On button action
    let powerTimeout = null;
    let logIntervals = [];

    powerBtn.addEventListener('click', () => {
        if (simulator.classList.contains('active')) {
            turnOffRobot();
        } else {
            turnOnRobot();
        }
    });

    function turnOnRobot() {
        simulator.classList.add('active');
        powerBtn.classList.add('btn-secondary');
        powerBtn.classList.remove('btn-primary');
        powerBtn.querySelector('span').innerText = 'Power Down';
        
        statusDot.className = 'status-indicator active';
        statusDot.innerHTML = '<span class="status-dot"></span> RUNNING';

        // Console logger simulation
        logBox.innerHTML = '';
        const lines = [
            `> Initializing ${robotNameEl.innerText}...`,
            `> Booting processors... OK.`,
            `> Chassis modules [${robotParts.base.toUpperCase()}] online.`,
            `> Calibrating sensor eye [${robotParts.sensor.toUpperCase()}]... OK.`,
            `> Activating utilities [${robotParts.utility.toUpperCase()}]... READY.`,
            `> SYSTEM DIAGNOSTICS: 100% SUCCESS.`,
            `> Running autonomous navigation simulation...`
        ];

        lines.forEach((line, index) => {
            const timeout = setTimeout(() => {
                const p = document.createElement('p');
                p.className = 'log-line';
                p.innerText = line;
                logBox.appendChild(p);
                logBox.scrollTop = logBox.scrollHeight;
            }, index * 600);
            logIntervals.push(timeout);
        });

        // Autoclose active state after 10s to conserve loop cycles
        powerTimeout = setTimeout(() => {
            turnOffRobot();
        }, 12000);
    }

    function turnOffRobot() {
        // Clear timers
        clearTimeout(powerTimeout);
        logIntervals.forEach(t => clearTimeout(t));
        logIntervals = [];

        simulator.classList.remove('active');
        powerBtn.classList.add('btn-primary');
        powerBtn.classList.remove('btn-secondary');
        powerBtn.querySelector('span').innerText = 'Power On & Run Test';

        statusDot.className = 'status-indicator';
        statusDot.innerHTML = '<span class="status-dot"></span> SYSTEM IDLE';

        logBox.innerHTML = `
            <p class="log-line">> Ready for execution.</p>
            <p class="log-line">> Click 'Power On' to run diagnostics.</p>
        `;
    }

    // Run once on load to render default stats and labels
    updateRobotGraphics();


    /* ==========================================================================
       5. TESTIMONIAL SLIDER CAROUSEL
       ========================================================================== */
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    let currentSlide = 0;
    let slideInterval = null;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function startAutoSlide() {
        slideInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5000);
    }

    function resetAutoSlide() {
        clearInterval(slideInterval);
        startAutoSlide();
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            showSlide(currentSlide - 1);
            resetAutoSlide();
        });

        nextBtn.addEventListener('click', () => {
            showSlide(currentSlide + 1);
            resetAutoSlide();
        });

        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                showSlide(idx);
                resetAutoSlide();
            });
        });

        startAutoSlide();
    }


    /* ==========================================================================
       6. FAQ ACCORDION PANEL
       ========================================================================== */
    const faqTriggers = document.querySelectorAll('.faq-trigger');

    faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.parentElement;
            const panel = trigger.nextElementSibling;
            const isActive = item.classList.contains('active');

            // Close all items
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-panel').style.maxHeight = null;
            });

            // Toggle active item
            if (!isActive) {
                item.classList.add('active');
                panel.style.maxHeight = panel.scrollHeight + 'px';
            }
        });
    });


    /* ==========================================================================
       7. TRIAL BOOKING MODAL & CUSTOM FORM VALIDATION
       ========================================================================== */
    const modal = document.getElementById('booking-modal');
    const openModalBtns = document.querySelectorAll('.open-modal-btn');
    const closeModalBtn = document.getElementById('modal-close-btn');
    const bookingForm = document.getElementById('booking-form');
    const modalSuccess = document.getElementById('modal-success-screen');
    const successCloseBtn = document.getElementById('success-close-btn');

    // Success screen dynamically filled text
    const successParent = document.getElementById('success-parent-name');
    const successTime = document.getElementById('success-time-slot');
    const successPhone = document.getElementById('success-phone');

    // Inputs
    const parentNameInput = document.getElementById('parent-name');
    const parentEmailInput = document.getElementById('parent-email');
    const parentPhoneInput = document.getElementById('parent-phone');
    const kidAgeSelect = document.getElementById('kid-age');
    const prefSlotSelect = document.getElementById('pref-slot');

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('open');
            document.body.style.overflow = 'hidden'; // Lock background scroll
            
            // If button is "Enquire Now" on a card, auto-select corresponding age range
            const card = btn.closest('.course-card');
            if (card && kidAgeSelect) {
                const ageGroup = card.getAttribute('data-age-group');
                if (ageGroup === 'mechano') kidAgeSelect.value = '6';
                else if (ageGroup === 'elex') kidAgeSelect.value = '9';
                else if (ageGroup === 'autobots') kidAgeSelect.value = '11';
                else if (ageGroup === 'mentor') kidAgeSelect.value = '14';
            }
        });
    });

    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = ''; // Restore scroll
        setTimeout(() => {
            bookingForm.reset();
            bookingForm.style.display = 'flex';
            modalSuccess.style.display = 'none';
            // Clear all errors
            document.querySelectorAll('.form-group').forEach(g => g.classList.remove('invalid'));
        }, 300);
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (successCloseBtn) successCloseBtn.addEventListener('click', closeModal);

    // Modal background click close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Form inputs change validation triggers
    const inputsToValidate = [
        { el: parentNameInput, validator: val => val.trim().length >= 2 },
        { el: parentEmailInput, validator: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()) },
        { el: parentPhoneInput, validator: val => /^[6789]\d{9}$/.test(val.trim()) },
        { el: kidAgeSelect, validator: val => val !== '' },
        { el: prefSlotSelect, validator: val => val !== '' }
    ];

    inputsToValidate.forEach(item => {
        if (item.el) {
            item.el.addEventListener('input', () => {
                const group = item.el.closest('.form-group');
                if (item.validator(item.el.value)) {
                    group.classList.remove('invalid');
                }
            });
            if (item.el.tagName === 'SELECT') {
                item.el.addEventListener('change', () => {
                    const group = item.el.closest('.form-group');
                    if (item.validator(item.el.value)) {
                        group.classList.remove('invalid');
                    }
                });
            }
        }
    });

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isFormValid = true;

        inputsToValidate.forEach(item => {
            const group = item.el.closest('.form-group');
            if (!item.validator(item.el.value)) {
                group.classList.add('invalid');
                isFormValid = false;
            } else {
                group.classList.remove('invalid');
            }
        });

        if (isFormValid) {
            // Trigger simulated loader
            const submitBtn = document.getElementById('booking-submit-btn');
            const originalHTML = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Processing Booking...</span> <i class="fa-solid fa-spinner fa-spin"></i>';

            setTimeout(() => {
                // Populate success modal values
                successParent.innerText = parentNameInput.value;
                successTime.innerText = prefSlotSelect.options[prefSlotSelect.selectedIndex].text;
                successPhone.innerText = `+91 ${parentPhoneInput.value}`;

                // Swap layouts
                bookingForm.style.display = 'none';
                modalSuccess.style.display = 'flex';
                
                // Re-enable submit button for future interactions
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
            }, 1500);
        }
    });


    /* ==========================================================================
       8. NEWSLETTER NEWS SUBSCRIPTION
       ========================================================================== */
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterSuccess = document.getElementById('newsletter-success');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            
            // Simulating API loading state
            newsletterForm.style.opacity = '0.5';
            setTimeout(() => {
                newsletterForm.style.opacity = '1';
                input.value = '';
                newsletterSuccess.style.display = 'block';
                setTimeout(() => {
                    newsletterSuccess.style.display = 'none';
                }, 4000);
            }, 1000);
        });
    }

});
