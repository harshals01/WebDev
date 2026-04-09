document.addEventListener("DOMContentLoaded", () => {

    const searchBox = document.getElementById("searchBox");
    const storeList = document.getElementById("storeList");

    searchBox.addEventListener("input", function () {
        fetchStores(this.value.trim());
    });

    async function fetchStores(search = "") {
        try {
            const url = `https://saleofy.com/api/user/store?latitude=26.4499&longitude=74.6399&mode=all&page=1&limit=10&search=${encodeURIComponent(search)}`;

            console.log("Calling API:", url);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }

            const data = await response.json();
            console.log("API data:", data);

            const stores = data.data || data.stores || data || [];
            displayStores(stores);

        } catch (error) {
            console.error("Fetch failed:", error);
            storeList.innerHTML = "<p>Failed to load stores.</p>";
        }
    }

    function displayStores(stores) {
        storeList.innerHTML = "";

        if (!stores.length) {
            storeList.innerHTML = "<p>No stores found.</p>";
            return;
        }

        stores.forEach(store => {
            const div = document.createElement("div");
            div.className = "store-card";

            div.innerHTML = `
                <h3>${store.name || store.store_name || "Unnamed Store"}</h3>
                <p>${store.address || store.location || "No address available"}</p>
            `;

            storeList.appendChild(div);
        });
    }

    fetchStores();
});


/* login-redirectfnc.js */

let userLat = 26.4499;
let userLng = 74.6399;
let currentMode = 'all';

function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(km) {
    return km < 1 ? `${Math.round(km * 1000)} m Away` : `${km.toFixed(2)} Km Away`;
}

function getStoreStatus(store) {
    if (typeof store.is_open === 'boolean') return store.is_open;
    if (typeof store.isOpen  === 'boolean') return store.isOpen;
    if (typeof store.status  === 'string')  return store.status.toLowerCase() === 'open';
    return null;
}

function setMode(mode) {
    currentMode = mode;
    document.getElementById('pillNear').classList.toggle('active', mode === 'near');
    document.getElementById('pillAll').classList.toggle('active', mode === 'all');
    document.getElementById('pageTitle').textContent =
        mode === 'near' ? 'Stores List (Near Me)' : 'Stores List (All Stores)';
    fetchStores();
}

function shareStore(name) {
    if (navigator.share) {
        navigator.share({ title: name, text: `Check out ${name} on Saleofy!` });
    } else {
        navigator.clipboard.writeText(window.location.href)
            .then(() => alert('Link copied!'))
            .catch(() => {});
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'login.html';
    }
}

function applyLocation(lat, lng, label) {
    userLat = lat;
    userLng = lng;
    document.getElementById('locationTag').textContent = `📍 ${label}`;
    document.getElementById('locationPanel').classList.add('location-set');
    fetchStores();
}

document.addEventListener('DOMContentLoaded', () => {
    const useGPSBtn        = document.getElementById('useGPSBtn');
    const confirmManualBtn = document.getElementById('confirmManualBtn');
    const manualLat        = document.getElementById('manualLat');
    const manualLng        = document.getElementById('manualLng');
    const searchBox        = document.getElementById('searchBox');

    useGPSBtn.addEventListener('click', () => {
        useGPSBtn.textContent = '⏳ Locating...';
        useGPSBtn.disabled = true;

        navigator.geolocation.getCurrentPosition(
            pos => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                applyLocation(lat, lng, `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
                useGPSBtn.textContent = '✅ Location Set';
            },
            () => {
                useGPSBtn.textContent = '🛰 Use My Location';
                useGPSBtn.disabled = false;
                alert('Location access denied. Please enter coordinates manually.');
            }
        );
    });

    confirmManualBtn.addEventListener('click', () => {
        const lat = parseFloat(manualLat.value);
        const lng = parseFloat(manualLng.value);
        if (isNaN(lat) || isNaN(lng)) {
            alert('Please enter valid latitude and longitude.');
            return;
        }
        applyLocation(lat, lng, `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    });

    searchBox.addEventListener('input', function () {
        fetchStores(this.value.trim());
    });

    fetchStores();
});

async function fetchStores(search = '') {
    const storeList  = document.getElementById('storeList');
    const storeCount = document.getElementById('storeCount');
    const city       = document.getElementById('citySelect')?.value || '';

    storeList.innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Finding stores near you...</p>
        </div>`;
    storeCount.textContent = 'Searching...';

    try {
        const params = new URLSearchParams({
            latitude:  userLat,
            longitude: userLng,
            mode:      currentMode,
            page:      1,
            limit:     10,
            search:    search,
            ...(city ? { city } : {})
        });

        const res = await fetch(`https://saleofy.com/api/user/store?${params}`);
        if (!res.ok) throw new Error('HTTP ' + res.status);

        const data   = await res.json();
        const stores = data.data || data.stores || (Array.isArray(data) ? data : []);
        displayStores(stores);

    } catch (err) {
        console.error('Fetch failed:', err);
        storeList.innerHTML = `<div class="empty-state">⚠️ Could not load stores. Please try again.</div>`;
        storeCount.textContent = '';
    }
}

function displayStores(stores) {
    const storeList  = document.getElementById('storeList');
    const storeCount = document.getElementById('storeCount');

    storeList.innerHTML = '';

    if (!stores.length) {
        storeList.innerHTML = `<div class="empty-state">🔍 No stores found.</div>`;
        storeCount.textContent = '0 stores found';
        return;
    }

    storeCount.textContent = `${stores.length} store${stores.length !== 1 ? 's' : ''} found`;

    stores.forEach((store, i) => {
        const name = store.name || store.store_name || 'Unnamed Store';

        const addressParts = [
        store.street_address,
        store.street_address2,
        store.landmark,l,
        store.area,
        store.city,
        store.state,
        store.postal_code
        ].filter(part => part && part.trim() !== '');
        const address = addressParts.length
    ? addressParts.join(', ')
    : store.address || store.location || store.full_address || 'Address not available';
        const tagline  = store.description || store.tagline || `Welcome To ${name}, ...`;
        const offers   = store.active_offers ?? store.activeOffers ?? store.offers_count ?? 0;
        const imgSrc   = store.image || store.logo || store.cover_image || store.thumbnail || '';
        const storeUrl = store.url || store.store_url || store.link ||
                         (store.slug ? `https://saleofy.com/store/${store.slug}` : null);

        const sLat = parseFloat(store.latitude  || store.lat);
        const sLng = parseFloat(store.longitude || store.lng || store.lon);
        let distText = '';
        if (!isNaN(sLat) && !isNaN(sLng)) {
            distText = formatDistance(haversineDistance(userLat, userLng, sLat, sLng));
        }

        const isOpen = getStoreStatus(store);
        let statusClass, statusLabel;
        if (isOpen === true)       { statusClass = 'open';    statusLabel = 'Open Now'; }
        else if (isOpen === false) { statusClass = 'closed';  statusLabel = 'Closed'; }
        else                       { statusClass = 'unknown'; statusLabel = 'Unknown'; }

        const imgHTML = imgSrc
            ? `<img src="${imgSrc}" alt="${name}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'img-placeholder\\'>🏪</div>'">`
            : `<div class="img-placeholder">img</div>`;

        const viewBtnHTML = storeUrl
            ? `<a href="${storeUrl}" target="_blank" class="view-store-btn">View Store →</a>`
            : `<span class="view-store-btn disabled">View Store →</span>`;

        const card = document.createElement('div');
        card.className = 'store-card';
        card.style.animationDelay = `${i * 55}ms`;

        card.innerHTML = `
            <div class="store-img-wrap">${imgHTML}</div>
            <div class="store-info">
                <div class="store-name">${name}</div>
                <div class="store-tagline">${tagline}</div>

                <div class="meta-row">
                    <span class="meta-label">Address:</span>
                    <span>${address}</span>
                </div>

                <div class="meta-row">
                    <span class="meta-label">Active Offers:</span>
                    <span>${offers}</span>
                </div>

                <div class="meta-row">
                    ${distText ? `<span class="meta-label">Distance:</span><span>${distText}</span>` : ''}
                    <span class="status-inline ${statusClass}">
                        <span class="status-dot"></span>${statusLabel}
                    </span>
                </div>

                <div class="card-actions">
                    <button class="icon-btn" title="Location">📍</button>
                    <button class="icon-btn" title="Share" onclick="shareStore('${name.replace(/'/g, "\\'")}')">🔗</button>
                    <button class="icon-btn" title="Save">🔖</button>
                    <button class="icon-btn" title="Call">📞</button>
                    ${viewBtnHTML}
                </div>
            </div>
        `;

        storeList.appendChild(card);
    });
}