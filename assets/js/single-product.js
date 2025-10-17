document.addEventListener('DOMContentLoaded', function () {
    var mainImage = document.getElementById('product-main-image');
    var thumbnails = document.querySelectorAll('.gallery-thumbs .thumb');
    var navPrev = document.querySelector('.gallery-nav--prev');
    var navNext = document.querySelector('.gallery-nav--next');
    var thumbnailArray = Array.prototype.slice.call(thumbnails);
    var currentIndex = 0;

    function setActiveThumbnail(targetIndex) {
        thumbnailArray.forEach(function (item, index) {
            if (index === targetIndex) {
                item.classList.add('is-active');
            } else {
                item.classList.remove('is-active');
            }
        });
    }

    function swapToIndex(targetIndex, options) {
        var config = options || {};
        var thumb = thumbnailArray[targetIndex];
        if (!thumb) {
            return;
        }

        var imageSource = thumb.getAttribute('data-image');
        if (!imageSource) {
            return;
        }

        if (config.skipAnimation) {
            mainImage.src = imageSource;
            currentIndex = targetIndex;
            setActiveThumbnail(targetIndex);
            return;
        }

        if (targetIndex === currentIndex && mainImage.getAttribute('src') === imageSource) {
            setActiveThumbnail(targetIndex);
            return;
        }

        mainImage.classList.add('is-fading');
        var tempImage = new Image();
        tempImage.onload = function () {
            mainImage.src = imageSource;
            currentIndex = targetIndex;
            requestAnimationFrame(function () {
                mainImage.classList.remove('is-fading');
            });
        };
        tempImage.src = imageSource;

        setActiveThumbnail(targetIndex);
    }

    var tabButtons = document.querySelectorAll('.product-details__tab');
    var tabPanels = document.querySelectorAll('.product-details__panel');
    var tabButtonArray = Array.prototype.slice.call(tabButtons);
    var tabPanelArray = Array.prototype.slice.call(tabPanels);

    function activateTab(targetId) {
        tabButtonArray.forEach(function (button) {
            var isActive = button.dataset.target === targetId;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-selected', String(isActive));
            button.setAttribute('tabindex', isActive ? '0' : '-1');
        });

        tabPanelArray.forEach(function (panel) {
            var isTarget = panel.id === targetId;
            panel.classList.toggle('is-active', isTarget);
            if (isTarget) {
                panel.removeAttribute('hidden');
                thumbnailArray.forEach(function (thumb, index) {
                    thumb.dataset.index = index;
                    thumb.addEventListener('click', function () {
                        swapToIndex(index);
                    });
                });
            } else {
                panel.setAttribute('hidden', '');
            }
        });
    }

    if (tabButtonArray.length && tabPanelArray.length) {
        tabButtonArray.forEach(function (button, index) {
            button.addEventListener('click', function () {
                var targetId = button.dataset.target;
                if (!targetId) {
                    return;
                }
                activateTab(targetId);
            });

            button.addEventListener('keydown', function (event) {
                if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
                    return;
                }
                var currentIndex = index;
                var delta = event.key === 'ArrowRight' ? 1 : -1;
                var nextIndex = (currentIndex + delta + tabButtonArray.length) % tabButtonArray.length;
                var nextButton = tabButtonArray[nextIndex];
                if (!nextButton) {
                    return;
                }
                nextButton.focus();
                var nextTarget = nextButton.dataset.target;
                if (nextTarget) {
                    activateTab(nextTarget);
                }
                event.preventDefault();
            });
        });

        var initialTarget = tabButtonArray[0] ? tabButtonArray[0].dataset.target : null;
        if (initialTarget) {
            activateTab(initialTarget);
        }
    }

    var reviewForm = document.querySelector('.review-form');
    var reviewList = document.querySelector('.reviews-list');

    function createElement(tag, className, text) {
        var element = document.createElement(tag);
        if (className) {
            element.className = className;
        }
        if (typeof text === 'string') {
            element.textContent = text;
        }
        return element;
    }

    function createInitials(source) {
        if (!source) {
            return 'BD';
        }
        var parts = source.trim().split(/\s+/);
        if (!parts.length) {
            return 'BD';
        }
        var initials = parts.slice(0, 2).map(function (part) {
            return part.charAt(0).toUpperCase();
        }).join('');
        return initials || 'BD';
    }

    function formatDate(date) {
        var day = String(date.getDate()).padStart(2, '0');
        var month = String(date.getMonth() + 1).padStart(2, '0');
        var year = date.getFullYear();
        return day + '/' + month + '/' + year;
    }

    if (reviewForm && reviewList) {
        var textarea = reviewForm.querySelector('textarea');

        if (textarea) {
            textarea.addEventListener('input', function () {
                var currentValue = textarea.value;
                var sanitized = currentValue.replace(/[0-9]+/g, '');
                if (sanitized !== currentValue) {
                    textarea.value = sanitized;
                }
            });
        }

        reviewForm.addEventListener('submit', function (event) {
            event.preventDefault();
            if (!textarea) {
                return;
            }

            var reviewText = textarea.value.trim();

            if (!reviewText.length) {
                return;
            }

            if (/[0-9]/.test(reviewText)) {
                return;
            }

            var reviewItem = createElement('article', 'review');
            reviewItem.setAttribute('tabindex', '0');

            var avatar = createElement('div', 'review-avatar', createInitials('Bạn đọc'));
            avatar.setAttribute('aria-hidden', 'true');

            var body = createElement('div', 'review-body');
            var meta = createElement('header', 'review-meta');

            var author = createElement('span', 'review-author', 'Bạn đọc');

            var now = new Date();
            var formatted = formatDate(now);
            var time = createElement('time', 'review-date', formatted);
            time.setAttribute('datetime', now.toISOString().split('T')[0]);

            var message = createElement('p', null, reviewText);

            meta.appendChild(author);
            meta.appendChild(time);
            body.appendChild(meta);
            body.appendChild(message);
            reviewItem.appendChild(avatar);
            reviewItem.appendChild(body);

            if (reviewList.firstChild) {
                reviewList.insertBefore(reviewItem, reviewList.firstChild);
            } else {
                reviewList.appendChild(reviewItem);
            }

            textarea.value = '';
            textarea.focus();
        });
    }

    thumbnailArray.forEach(function (thumb, index) {
        thumb.dataset.index = index;
        thumb.addEventListener('click', function () {
            swapToIndex(index);
        });
    });

    if (thumbnailArray.length) {
        swapToIndex(0, { skipAnimation: true });
    }

    if (navPrev) {
        navPrev.addEventListener('click', function () {
            if (!thumbnailArray.length) {
                return;
            }
            var nextIndex = (currentIndex - 1 + thumbnailArray.length) % thumbnailArray.length;
            swapToIndex(nextIndex);
        });
    }

    if (navNext) {
        navNext.addEventListener('click', function () {
            if (!thumbnailArray.length) {
                return;
            }
            var nextIndex = (currentIndex + 1) % thumbnailArray.length;
            swapToIndex(nextIndex);
        });
    }

    var quantityInput = document.querySelector('.qty-input');
    var quantityButtons = document.querySelectorAll('.qty-btn');

    if (quantityInput && quantityButtons.length) {
        quantityButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                var action = button.getAttribute('data-qty-action');
                var currentValue = parseInt(quantityInput.value, 10);
                if (Number.isNaN(currentValue) || currentValue < 1) {
                    currentValue = 1;
                }

                if (action === 'increase') {
                    quantityInput.value = currentValue + 1;
                }

                if (action === 'decrease') {
                    quantityInput.value = Math.max(1, currentValue - 1);
                }

                quantityInput.dispatchEvent(new Event('change', { bubbles: true }));
            });
        });

        quantityInput.addEventListener('input', function () {
            var sanitizedValue = parseInt(quantityInput.value, 10);
            if (Number.isNaN(sanitizedValue) || sanitizedValue < 1) {
                quantityInput.value = 1;
            } else {
                quantityInput.value = sanitizedValue;
            }
        });
    }
});
