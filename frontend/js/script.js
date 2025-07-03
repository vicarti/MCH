$(document).ready(function () {
    // ===== Loader fade out =====
    $(window).on('load', function () {
        $('.loader').fadeOut('slow');
    });

    // ===== CounterUp for Stats =====
    $('.stat-number').counterUp({
        delay: 10,
        time: 1000
    });

    // ===== Back to Top Button =====
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').addClass('active');
        } else {
            $('.back-to-top').removeClass('active');
        }
    });

    $('.back-to-top').click(function (e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 600);
    });

    // ===== Join Form Switcher =====
    $('.btn-join-option').click(function () {
        let target = $(this).data('target');
        $('.btn-join-option').removeClass('active');
        $(this).addClass('active');
        $('.join-form').removeClass('active');
        $('#' + target).addClass('active');
    });

    // ===== Navbar shrink on scroll =====
    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }
    });

    // ===== Language Switcher Placeholder =====
    window.changeLanguage = function (lang) {
        alert('تبديل اللغة إلى: ' + lang + ' (غير مفعلة بعد)');
    };

    // ===== FIXED Event Tabs & Carousel Section =====
    const tabs = document.querySelectorAll('.tab-btn');
    const events = document.querySelectorAll('.event');
    const clubEventCards = document.querySelectorAll('.club-event-card');
    
    // Variable to track if animation is in progress
    let isAnimating = false;

    // FIXED showEvent function with proper animation timing
    // In your showEvent function, replace with this:
window.showEvent = function (index) {
    if (isAnimating) return;
    isAnimating = true;

    // Update tabs
    tabs.forEach((tab, i) => {
        tab.classList.toggle('active', i === index);
    });

    // For mobile, simply switch display property
    if (window.innerWidth <= 768) {
        events.forEach(event => event.style.display = 'none');
        clubEventCards.forEach(card => card.style.display = 'none');
        
        if (events[index]) events[index].style.display = 'grid';
        if (clubEventCards[index]) clubEventCards[index].style.display = 'flex';
        
        isAnimating = false;
        return;
    }

    // Desktop animation remains the same
    events.forEach(event => event.classList.remove('active'));
    clubEventCards.forEach(card => card.classList.remove('active'));

    setTimeout(() => {
        if (events[index]) events[index].classList.add('active');
        if (clubEventCards[index]) clubEventCards[index].classList.add('active');
        setTimeout(() => { isAnimating = false; }, 100);
    }, 200);
};

    // Enhanced carousel function with proper timing
    function startCarousel(carouselId) {
        const carousel = document.getElementById(carouselId);
        if (!carousel) return;

        const images = carousel.querySelectorAll('img');
        let current = 0;

        // Make sure only the first image is active
        images.forEach((img, index) => {
            img.classList.toggle('active', index === 0);
        });

        if (images.length <= 1) return; // Don't start interval if only one image

        setInterval(() => {
            // Fade out current image
            images[current].classList.remove('active');
            
            // Move to next image
            current = (current + 1) % images.length;
            
            // Small delay for smooth transition
            setTimeout(() => {
                images[current].classList.add('active');
            }, 100);
        }, 3000);
    }

    // Add thumbnail click handlers
    function initializeThumbnails() {
        const thumbnails = document.querySelectorAll('.event-thumbnails img');
        
        thumbnails.forEach((thumbnail, thumbIndex) => {
            thumbnail.addEventListener('click', function() {
                // Find the parent event card
                const eventCard = this.closest('.event, .club-event-card');
                if (!eventCard) return;

                // Find all images in this event's carousel
                const carouselImages = eventCard.querySelectorAll('.event-carousel img, .main-event-img img');
                const allThumbnails = eventCard.querySelectorAll('.event-thumbnails img');

                // Remove active from all images and thumbnails in this event
                carouselImages.forEach(img => img.classList.remove('active'));
                allThumbnails.forEach(thumb => thumb.classList.remove('active'));

                // Add active to clicked thumbnail and corresponding image
                this.classList.add('active');
                if (carouselImages[thumbIndex]) {
                    carouselImages[thumbIndex].classList.add('active');
                }
            });
        });
    }

    // Add navigation button handlers
    function initializeNavigation() {
        const prevBtn = document.querySelector('.event-prev');
        const nextBtn = document.querySelector('.event-next');

        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                const currentIndex = getCurrentEventIndex();
                const totalEvents = Math.max(events.length, clubEventCards.length);
                const prevIndex = currentIndex === 0 ? totalEvents - 1 : currentIndex - 1;
                showEvent(prevIndex);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                const currentIndex = getCurrentEventIndex();
                const totalEvents = Math.max(events.length, clubEventCards.length);
                const nextIndex = (currentIndex + 1) % totalEvents;
                showEvent(nextIndex);
            });
        }
    }

    // Helper function to get current active event index
    function getCurrentEventIndex() {
        const activeEvent = document.querySelector('.event.active, .club-event-card.active');
        if (!activeEvent) return 0;

        const allEvents = document.querySelectorAll('.event, .club-event-card');
        return Array.from(allEvents).indexOf(activeEvent);
    }

    // Enhanced tab click handlers
    function initializeTabs() {
        tabs.forEach((tab, index) => {
            tab.addEventListener('click', function() {
                if (!isAnimating) {
                    showEvent(index);
                }
            });
        });
    }

    // Initialize everything when DOM is ready
    function initializeEvents() {
        // Show first event by default
        if (events.length > 0 || clubEventCards.length > 0) {
            showEvent(0);
        }

        // Initialize all interactive elements
        initializeThumbnails();
        initializeNavigation();
        initializeTabs();

        // Start carousels
        startCarousel('carousel-0');
        startCarousel('carousel-1');
        startCarousel('carousel-2');

        // Auto-start any carousels found in club event cards
        document.querySelectorAll('.event-carousel, .main-event-img').forEach((carousel, index) => {
            if (carousel.id) {
                startCarousel(carousel.id);
            } else {
                // Create an ID if none exists
                carousel.id = `carousel-auto-${index}`;
                startCarousel(carousel.id);
            }
        });
    }

    // Call initialization
    initializeEvents();

    // Debug function for testing animations
    window.debugEventAnimations = function() {
        console.log('=== Event Animation Debug ===');
        console.log('Events found:', events.length);
        console.log('Club event cards found:', clubEventCards.length);
        console.log('Tabs found:', tabs.length);
        console.log('Active event:', document.querySelector('.event.active, .club-event-card.active'));
        console.log('Is animating:', isAnimating);
        
        // Test animation by showing each event
        let testIndex = 0;
        const testInterval = setInterval(() => {
            if (testIndex >= Math.max(events.length, clubEventCards.length)) {
                clearInterval(testInterval);
                console.log('Animation test complete');
                return;
            }
            console.log(`Testing event ${testIndex}`);
            showEvent(testIndex);
            testIndex++;
        }, 2000);
    };

    // Force hardware acceleration on key elements
    function forceHardwareAcceleration() {
        const elementsToAccelerate = document.querySelectorAll(
            '.event, .club-event-card, .event-carousel img, .event-thumbnails img'
        );
        
        elementsToAccelerate.forEach(element => {
            element.style.transform = element.style.transform || 'translateZ(0)';
        });
    }

    // Apply hardware acceleration
    setTimeout(forceHardwareAcceleration, 100);
});