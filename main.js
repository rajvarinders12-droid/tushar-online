document.addEventListener('DOMContentLoaded', () => {
    // Initial load animations
    setTimeout(() => {
        const animatedElements = document.querySelectorAll('.slide-up');
        animatedElements.forEach(el => {
            el.classList.add('visible');
        });
    }, 100);

    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Video Modal Logic
    const videoShields = document.querySelectorAll('.video-click-shield');
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const closeModalBtn = document.getElementById('closeModal');

    if (videoModal && modalVideo) {
        // Open Modal
        videoShields.forEach(shield => {
            shield.addEventListener('click', () => {
                const videoEl = shield.nextElementSibling;
                if (videoEl && videoEl.tagName === 'VIDEO') {
                    const src = videoEl.getAttribute('data-src') || videoEl.getAttribute('src');
                    if (src) {
                        modalVideo.src = src;
                        videoModal.classList.add('active');
                        modalVideo.play().catch(e => console.log('play prevented', e));
                    }
                }
            });
        });

        // Close Modal logic
        const closeVideoModal = () => {
            videoModal.classList.remove('active');
            modalVideo.pause();
            modalVideo.src = ''; // Clear src to stop video
        };

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeVideoModal);
        }

        // Click outside video to close
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                closeVideoModal();
            }
        });
    }
    // Hamburger Menu Logic
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            mobileMenu.classList.toggle('open');
            // Prevent body scrolling when menu is open
            document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
        });

        // Close menu when a link is clicked
        mobileNavItems.forEach(item => {
            item.addEventListener('click', () => {
                hamburgerBtn.classList.remove('active');
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // Carousel Scroll Progress & Arrow Logic
    const carousels = document.querySelectorAll('.carousel-wrapper');

    carousels.forEach(wrapper => {
        const scrollArea = wrapper.querySelector('.carousel-scroll-area');
        const progressBar = wrapper.querySelector('.progress-fill');
        const prevBtn = wrapper.querySelector('.prev-arrow');
        const nextBtn = wrapper.querySelector('.next-arrow');

        if (scrollArea) {
            const updateProgress = () => {
                if (!progressBar) return;
                const scrollLeft = scrollArea.scrollLeft;
                const scrollWidth = scrollArea.scrollWidth - scrollArea.clientWidth;

                if (scrollWidth > 0) {
                    const scrollPercentage = (scrollLeft / scrollWidth) * 100;
                    progressBar.style.width = `${scrollPercentage}%`;
                } else {
                    progressBar.style.width = '0%';
                }
            };

            scrollArea.addEventListener('scroll', updateProgress, { passive: true });
            window.addEventListener('resize', updateProgress);

            // Initial call
            setTimeout(updateProgress, 100);

            // Arrow Looping Logic
            if (prevBtn && nextBtn) {
                const getScrollAmount = () => {
                    const firstItem = scrollArea.firstElementChild;
                    if (!firstItem) return scrollArea.clientWidth * 0.5;
                    const gap = parseFloat(window.getComputedStyle(scrollArea).gap) || 0;
                    return firstItem.offsetWidth + gap;
                };

                nextBtn.addEventListener('click', () => {
                    const maxScroll = scrollArea.scrollWidth - scrollArea.clientWidth;
                    if (scrollArea.scrollLeft >= maxScroll - 10) { // At the end, loop to start
                        scrollArea.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        scrollArea.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
                    }
                });

                prevBtn.addEventListener('click', () => {
                    if (scrollArea.scrollLeft <= 10) { // At the start, loop to end
                        const maxScroll = scrollArea.scrollWidth - scrollArea.clientWidth;
                        scrollArea.scrollTo({ left: maxScroll, behavior: 'smooth' });
                    } else {
                        scrollArea.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
                    }
                });
            }
        }
    });

    // Play videos on hover to save resources and prevent lag
    const allVideoContainers = document.querySelectorAll('.video-container');
    allVideoContainers.forEach(container => {
        const videoEl = container.querySelector('video');
        if (videoEl) {
            container.addEventListener('mouseenter', () => {
                videoEl.play().catch(e => console.log("Play prevented:", e));
            });
            container.addEventListener('mouseleave', () => {
                videoEl.pause();
            });
        }
    });

    // Timeline Scroll Animation
    const experienceSection = document.getElementById('experience');
    const timelineProgress = document.getElementById('timelineProgress');

    if (experienceSection && timelineProgress) {
        window.addEventListener('scroll', () => {
            const sectionRect = experienceSection.getBoundingClientRect();
            const viewportMiddle = window.innerHeight / 2;
            let progress = 0;

            if (sectionRect.top < viewportMiddle) {
                const scrollDistance = viewportMiddle - sectionRect.top;
                const totalDistance = sectionRect.height;
                progress = (scrollDistance / totalDistance) * 100;
                progress = Math.max(0, Math.min(100, progress));
            }

            timelineProgress.style.height = `${progress}%`;
        });
        window.dispatchEvent(new Event('scroll'));
    }

    // Coverflow effect for Long Format videos
    const longGrid = document.querySelector('.long-grid');
    const longPreviews = document.querySelectorAll('.long-preview');

    if (longGrid && longPreviews.length > 0) {
        const updateCoverflow = () => {
            const gridCenter = longGrid.getBoundingClientRect().left + (longGrid.clientWidth / 2);

            let closestPreview = null;
            let minDistance = Infinity;

            longPreviews.forEach(preview => {
                const rect = preview.getBoundingClientRect();
                const previewCenter = rect.left + (rect.width / 2);
                const distanceFromCenter = Math.abs(gridCenter - previewCenter);

                if (distanceFromCenter < minDistance) {
                    minDistance = distanceFromCenter;
                    closestPreview = preview;
                }

                // Remove active class from all first
                preview.classList.remove('active-center');
            });

            if (closestPreview) {
                closestPreview.classList.add('active-center');
            }
        };

        longGrid.addEventListener('scroll', updateCoverflow);
        window.addEventListener('resize', updateCoverflow);
        setTimeout(updateCoverflow, 100);
    }
});
