async function loadTableData() {
    try {
        const response = await fetch('https://api.restful-api.dev/objects');
        const items = await response.json();
        const table = document.getElementById('tabledesign');

        items.forEach((item, index) => {
            const row = table.insertRow();
            row.setAttribute('data-id', item.id);
            row.setAttribute('data-fields', JSON.stringify(item.data ?? {}));

            // ✅ Extract color and capacity with fallbacks for different key casings
            const data = item.data ?? {};

            const color = data['color']           // id 1,3,4,5
                       ?? data['Color']           // id 9
                       ?? data['generation']      // id 6
                       ?? data['CPU model']       // id 7
                       ?? data['Strap Colour']    // id 8
                       ?? data['Capacity']        // id 10,11,12
                       ?? 'N/A';

            const capacity = data['capacity']     // id 1
                          ?? data['capacity GB']  // id 3
                          ?? data['price']        // id 4,5,6,7
                          ?? data['Case Size']    // id 8
                          ?? data['Description']  // id 9
                          ?? data['Screen size']  // id 10,11
                          ?? data['Price']        // id 12
                          ?? 'N/A';

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
        const itemId      = row.getAttribute('data-id');
        const updatedName = cells[1].querySelector('input[name="name"]').value;
        const updatedColor    = cells[2].querySelector('input').value;
        const updatedCapacity = cells[3].querySelector('input').value;

        cells[1].textContent = updatedName;
        cells[2].textContent = updatedColor;
        cells[3].textContent = updatedCapacity;

        btn.textContent = 'Edit';
        btn.style.backgroundColor = '';

        updateItem(itemId, {
            name: updatedName,
            data: JSON.parse(row.getAttribute('data-fields')) // send original data structure
        });

    } else {
        cells[1].innerHTML = `<input name="name" type="text" value="${cells[1].textContent}" />`;
        cells[2].innerHTML = `<input type="text" value="${cells[2].textContent}" />`;
        cells[3].innerHTML = `<input type="text" value="${cells[3].textContent}" />`;

        btn.textContent = 'Save';
        btn.style.backgroundColor = 'green';
    }
}

async function updateItem(id, updatedData) {
    try {
        const response = await fetch(`https://api.restful-api.dev/objects/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const result = await response.json();
        console.log('✅ Update accepted:', result);

    } catch (error) {
        console.error('❌ Update failed:', error);
    }
}

function deleteRow(btn) {
    if (confirm('Are you sure you want to delete this row?')) {
        btn.closest('tr').remove();
        refreshSerialNumbers();
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
