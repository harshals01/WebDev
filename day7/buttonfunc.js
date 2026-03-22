async function loadTableData() {
    try {
        const response = await fetch('https://api.restful-api.dev/objects');
        const items = await response.json();
        const table = document.getElementById('tabledesign');

        items.forEach((item, index) => {
            const row = table.insertRow();

            const data = item.data ?? {};

            const colorKey =
                'color' in data ? 'color' :
                'Color' in data ? 'Color' :
                'generation' in data ? 'generation' :
                'CPU model' in data ? 'CPU model' :
                'Strap Colour' in data ? 'Strap Colour' :
                'Capacity' in data ? 'Capacity' : null;

            const capacityKey =
                'capacity' in data ? 'capacity' :
                'capacity GB' in data ? 'capacity GB' :
                'price' in data ? 'price' :
                'Case Size' in data ? 'Case Size' :
                'Description' in data ? 'Description' :
                'Screen size' in data ? 'Screen size' :
                'Price' in data ? 'Price' : null;

            const color = colorKey ? data[colorKey] : 'N/A';
            const capacity = capacityKey ? data[capacityKey] : 'N/A';

            row.dataset.id = item.id;
            row.dataset.data = JSON.stringify(data);
            row.dataset.colorKey = colorKey;
            row.dataset.capacityKey = capacityKey;

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${color}</td>
                <td>${capacity}</td>
                <td>
                    <button class="edit" onclick="editRow(this)">Edit</button>
                    <button class="delete" onclick="deleteRow(this)">Delete</button>
                </td>
            `;
        });

    } catch (error) {
        console.error('❌ Failed to load:', error);
    }
}


function editRow(btn) {
    const row = btn.closest('tr');
    const cells = row.querySelectorAll('td');
    const isEditing = btn.textContent === 'Save';

    if (isEditing) {
        const id = row.dataset.id;

        const updatedName = cells[1].querySelector('input').value;
        const updatedColor = cells[2].querySelector('input').value;
        const updatedCapacity = cells[3].querySelector('input').value;

        // restore UI
        cells[1].textContent = updatedName;
        cells[2].textContent = updatedColor;
        cells[3].textContent = updatedCapacity;

        btn.textContent = 'Edit';
        btn.style.backgroundColor = '';

        // reconstruct data
        let data = JSON.parse(row.dataset.data);

        const colorKey = row.dataset.colorKey;
        const capacityKey = row.dataset.capacityKey;

        if (colorKey) data[colorKey] = updatedColor;
        if (capacityKey) data[capacityKey] = updatedCapacity;

        // persist updated structure locally
        row.dataset.data = JSON.stringify(data);

        updateItem(id, {
            name: updatedName,
            data: data
        });

    } else {
        cells[1].innerHTML = `<input type="text" value="${cells[1].textContent}" />`;
        cells[2].innerHTML = `<input type="text" value="${cells[2].textContent}" />`;
        cells[3].innerHTML = `<input type="text" value="${cells[3].textContent}" />`;

        btn.textContent = 'Save';
        btn.style.backgroundColor = 'green';
    }
}


async function updateItem(id, updatedData) {
    try {
        const res = await fetch(`https://api.restful-api.dev/objects/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });

        if (!res.ok) throw new Error(res.status);

        const result = await res.json();
        console.log('✅ Updated:', result);

    } catch (err) {
        console.error('❌ Update failed:', err);
    }
}


async function deleteRow(btn) {
    const row = btn.closest('tr');
    const id = row.dataset.id;

    if (confirm('Delete permanently?')) {
        try {
            const res = await fetch(`https://api.restful-api.dev/objects/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error(res.status);

            row.remove();
            refreshSerialNumbers();

        } catch (err) {
            console.error('❌ Delete failed:', err);
        }
    }
}


function refreshSerialNumbers() {
    const table = document.getElementById('tabledesign');
    const rows = table.querySelectorAll('tr:not(:first-child)');

    rows.forEach((row, index) => {
        row.cells[0].textContent = index + 1;
    });
}


loadTableData();
