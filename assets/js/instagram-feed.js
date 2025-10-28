(function () {
        const feedContainer = document.getElementById('instagram-feed');
        if (!feedContainer) {
                return;
        }

        const username = 'saintcip';
        const profileUrl = `https://www.instagram.com/${username}/`;
        const loadingMessage = feedContainer.querySelector('.instagram-feed-loading');

        function showError() {
                feedContainer.innerHTML = '';
                const message = document.createElement('p');
                message.className = 'instagram-feed-error';
                message.innerHTML = `Unable to load Instagram posts right now. <a href="${profileUrl}" target="_blank" rel="noopener">Follow @${username}</a>.`;
                feedContainer.appendChild(message);
        }

        async function fetchPosts() {
                try {
                        const endpoint = `https://r.jina.ai/https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`;
                        const response = await fetch(endpoint, { cache: 'no-store' });

                        if (!response.ok) {
                                throw new Error('Network response was not ok');
                        }

                        const data = await response.json();
                        const edges = data?.data?.user?.edge_owner_to_timeline_media?.edges;

                        if (!Array.isArray(edges) || edges.length === 0) {
                                throw new Error('No posts available');
                        }

                        const fragment = document.createDocumentFragment();

                        edges.slice(0, 6).forEach(({ node }) => {
                                if (!node) {
                                        return;
                                }

                                const link = document.createElement('a');
                                link.href = `https://www.instagram.com/p/${node.shortcode}/`;
                                link.target = '_blank';
                                link.rel = 'noopener';
                                link.className = 'instagram-feed-item';

                                const label = node.accessibility_caption || node.title || 'View this post on Instagram';
                                link.setAttribute('aria-label', label);

                                const image = document.createElement('img');
                                image.src = node.thumbnail_src || node.display_url;
                                image.alt = label;
                                image.loading = 'lazy';

                                link.appendChild(image);
                                fragment.appendChild(link);
                        });

                        feedContainer.innerHTML = '';
                        feedContainer.appendChild(fragment);
                } catch (error) {
                        console.error('Instagram feed error:', error);
                        showError();
                }
        }

        if (loadingMessage) {
                loadingMessage.textContent = 'Loading the latest creations…';
        }

        fetchPosts();
})();
