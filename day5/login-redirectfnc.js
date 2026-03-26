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
