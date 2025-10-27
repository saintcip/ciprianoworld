const popupOverlay = document.getElementById('popup-overlay');

function setPopupVisibility(isVisible) {
    if (!popupOverlay) {
        return;
    }

    popupOverlay.classList.toggle('is-visible', isVisible);
    popupOverlay.setAttribute('aria-hidden', isVisible ? 'false' : 'true');
}

function OpenPopup() {
    setPopupVisibility(true);
}

function ClosePopup() {
    setPopupVisibility(false);
}

if (popupOverlay) {
    popupOverlay.setAttribute('aria-hidden', 'true');

    const closeTriggers = popupOverlay.querySelectorAll('[data-popup-close]');

    closeTriggers.forEach((trigger) => {
        trigger.addEventListener('click', ClosePopup);
    });

    popupOverlay.addEventListener('click', (event) => {
        if (event.target === popupOverlay) {
            ClosePopup();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && popupOverlay.classList.contains('is-visible')) {
            ClosePopup();
        }
    });

    window.addEventListener('load', () => {
        window.setTimeout(OpenPopup, 9000);
    });
}
