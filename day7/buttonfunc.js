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
        const res = await fetch(`https://api.restful-api.dev/objects/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });

        if (!res.ok) throw new Error(res.status);

        console.log('✅ Updated');
    } catch (err) {
        console.error('❌ Update failed:', err);
    }
}

function deleteRow(btn) {
    if (confirm('Are you sure you want to delete this row permanently?')) {
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
