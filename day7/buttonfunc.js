async function loadTableData() {
    try {
        const response = await fetch('https://api.restful-api.dev/objects');
        const items = await response.json();
        const table = document.getElementById('tabledesign');

        items.forEach((item, index) => {
            const row = table.insertRow();
            row.setAttribute('data-id', item.id);
            row.setAttribute('data-fields', JSON.stringify(item.data ?? {}));

            const data = item.data ?? {};

            const color = data['color']
                       ?? data['Color']
                       ?? data['generation']
                       ?? data['CPU model']
                       ?? data['Strap Colour']
                       ?? data['Capacity']
                       ?? 'N/A';

            const capacity = data['capacity']
                          ?? data['capacity GB']
                          ?? data['price']
                          ?? data['Case Size']
                          ?? data['Description']
                          ?? data['Screen size']
                          ?? data['Price']
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

function addRow() {
    const table = document.getElementById('tabledesign');
    const row = table.insertRow(1);
    row.setAttribute('data-id', '');
    row.setAttribute('data-fields', '{}');

    const rowCount = table.rows.length - 1;

    row.innerHTML = `
        <td>${rowCount}</td>
        <td><input name="name" type="text" placeholder="Name" /></td>
        <td><input type="text" placeholder="Color" /></td>
        <td><input type="text" placeholder="Capacity" /></td>
        <td>
            <button class="edit" onclick="saveNewRow(this)">Save</button>
            <button class="delete" onclick="deleteRow(this)">Cancel</button>
        </td>
    `;
}

async function saveNewRow(btn) {
    const row = btn.closest('tr');
    const cells = row.querySelectorAll('td');

    const name     = cells[1].querySelector('input[name="name"]').value.trim();
    const color    = cells[2].querySelector('input').value.trim();
    const capacity = cells[3].querySelector('input').value.trim();

    if (!name) {
        alert('Name is required.');
        return;
    }

    try {
        const response = await fetch('https://api.restful-api.dev/objects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name,
                data: { color: color, capacity: capacity }
            })
        });

        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const result = await response.json();
        console.log('✅ Created:', result);

        row.setAttribute('data-id', result.id);
        row.setAttribute('data-fields', JSON.stringify(result.data ?? {}));
        cells[1].textContent = name;
        cells[2].textContent = color;
        cells[3].textContent = capacity;

        cells[4].innerHTML = `
            <button class="edit" onclick="editRow(this)">Edit</button>
            <button class="delete" onclick="deleteRow(this)">Delete</button>
        `;

        refreshSerialNumbers();

    } catch (error) {
        console.error('❌ Create failed:', error);
        alert('Failed to save. Check console for details.');
    }
}

function editRow(btn) {
    const row = btn.closest('tr');
    const cells = row.querySelectorAll('td');
    const isEditing = btn.textContent === 'Save';

    if (isEditing) {
        const itemId          = row.getAttribute('data-id');
        const updatedName     = cells[1].querySelector('input[name="name"]').value;
        const updatedColor    = cells[2].querySelector('input').value;
        const updatedCapacity = cells[3].querySelector('input').value;

        cells[1].textContent = updatedName;
        cells[2].textContent = updatedColor;
        cells[3].textContent = updatedCapacity;

        btn.textContent = 'Edit';
        btn.style.backgroundColor = '';

        updateItem(itemId, {
            name: updatedName,
            data: JSON.parse(row.getAttribute('data-fields'))
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
