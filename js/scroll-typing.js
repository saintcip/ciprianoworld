(function () {
  const heroVideo = document.querySelector('.hero-video-embed iframe[data-src]');
  if (heroVideo) {
    window.addEventListener('load', () => {
      const videoSource = heroVideo.getAttribute('data-src');
      if (!videoSource) {
        return;
      }
      setTimeout(() => {
        heroVideo.src = videoSource;
      }, 2000);
    });
  }

  const paragraphs = document.querySelectorAll('.typed-paragraph');
  if (!paragraphs.length) {
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return;
  }

  const charMap = new WeakMap();

  const wrapTextNodes = (element) => {
    const childNodes = Array.from(element.childNodes);
    childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const textContent = node.textContent || '';
        const fragment = document.createDocumentFragment();
        for (const char of textContent) {
          const span = document.createElement('span');
          span.className = 'typed-char';
          span.textContent = char === '\n' ? ' ' : char;
          fragment.appendChild(span);
        }
        node.replaceWith(fragment);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        wrapTextNodes(node);
      }
    });
  };

  paragraphs.forEach((paragraph) => {
    if (paragraph.dataset.typingPrepared === 'true') {
      return;
    }
    wrapTextNodes(paragraph);
    const charSpans = paragraph.querySelectorAll('.typed-char');
    charMap.set(paragraph, charSpans);
    paragraph.dataset.typingPrepared = 'true';
  });

  if (typeof IntersectionObserver !== 'function') {
    paragraphs.forEach((paragraph) => {
      const chars = charMap.get(paragraph);
      if (!chars) {
        return;
      }
      chars.forEach((char) => char.classList.add('visible'));
      paragraph.dataset.typingState = 'done';
    });
    return;
  }

  const typeParagraph = (paragraph) => {
    if (paragraph.dataset.typingState === 'running' || paragraph.dataset.typingState === 'done') {
      return;
    }

    const chars = charMap.get(paragraph);
    if (!chars || !chars.length) {
      paragraph.dataset.typingState = 'done';
      return;
    }

    paragraph.dataset.typingState = 'running';
    let index = 0;

    const revealNext = () => {
      if (index >= chars.length) {
        paragraph.dataset.typingState = 'done';
        return;
      }

      const currentChar = chars[index];
      currentChar.classList.add('visible');

      let delay = 22;
      const charValue = currentChar.textContent;
      if (charValue === ' ') {
        delay = 10;
      } else if (/[,.;!?]/.test(charValue)) {
        delay = 140;
      }

      index += 1;
      setTimeout(revealNext, delay);
    };

    revealNext();
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        requestAnimationFrame(() => typeParagraph(entry.target));
      }
    });
  }, {
    root: null,
    threshold: 0.2,
    rootMargin: '0px 0px -20% 0px'
  });

  paragraphs.forEach((paragraph) => {
    observer.observe(paragraph);
  });
})();
