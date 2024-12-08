const BASE_URL = 'http://localhost:5001';
let currentToken = null;

// for different collections
const collectionFields = {
    users: [
        { name: 'name', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
        { name: 'password', type: 'password', required: true },
        { 
            name: 'role', 
            type: 'select', 
            options: ['user', 'guardian'], 
            required: true 
        }
    ]
};

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password,
                loginAsRole: 'admin'
            })
        });

        const data = await response.json();

        if (data.status === 'ok') {
            currentToken = data.token;
            localStorage.setItem('token', currentToken);
            toggleSections();
        } else {
            errorMessage.textContent = data.data || 'Login failed';
        }
    } catch (error) {
        errorMessage.textContent = 'An error occurred during login';
    }
}

function toggleSections() {
    document.getElementById('login-section').classList.toggle('hidden');
    document.getElementById('admin-dashboard').classList.toggle('hidden');
}

function logout() {
    const dataTable = document.getElementById('data-table');
    dataTable.classList.remove('visible');
    currentToken = null;
    localStorage.removeItem('token');
    toggleSections();
}

async function showCollections() {
    const collectionSelect = document.getElementById('collection-select').value;
    const dataTable = document.getElementById('data-table');
    
    // Show table
    dataTable.classList.add('visible');
    
    await loadCollectionData(collectionSelect);
}

async function loadCollectionData(collection) {
    const token = currentToken || localStorage.getItem('token');
    const dataList = document.getElementById('data-list');
    dataList.innerHTML = '';

    try {
        const response = await fetch(`${BASE_URL}/${collection}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.status === 'ok') {
            data[collection].forEach(doc => {
                const row = document.createElement('tr');
                const docString = JSON.stringify(doc, null, 2);

                const deleteButton = doc.role !== 'admin' ? 
                    `<button class="action-btn delete-btn" onclick='deleteDocument("${doc._id}", this)'>Delete</button>` : 
                    '';

                row.innerHTML = `
                    <td><pre>${docString}</pre></td>
                    <td>
                        <button class="action-btn view-btn" onclick='viewDocument(${JSON.stringify(doc).replace(/"/g, "&quot;")})'>View</button>
                        ${deleteButton}
                    </td>
                `;
                dataList.appendChild(row);
            });

            document.getElementById('data-section').classList.remove('hidden');
        } else {
            console.error('Failed to fetch data');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function viewDocument(doc) {
    const viewModal = document.getElementById('view-document-modal');
    const detailsElement = document.getElementById('document-details');
    detailsElement.textContent = JSON.stringify(doc, null, 2);
    viewModal.style.display = 'block';
}

function closeViewDocumentModal() {
    document.getElementById('view-document-modal').style.display = 'none';
}

function showAddDocumentModal() {
    const modal = document.getElementById('add-document-modal');
    const dynamicFields = document.getElementById('dynamic-fields');
    const collection = document.getElementById('document-collection').value;
    
    dynamicFields.innerHTML = '';

    collectionFields[collection].forEach(field => {
        const fieldContainer = document.createElement('div');
        
        if (field.type === 'select') {
            const select = document.createElement('select');
            select.name = field.name;
            select.required = field.required;
            
            field.options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                select.appendChild(optionElement);
            });
            
            fieldContainer.innerHTML = `<label>${field.name}</label>`;
            fieldContainer.appendChild(select);
        } else {
            fieldContainer.innerHTML = `
                <label>${field.name}</label>
                <input 
                    type="${field.type}" 
                    name="${field.name}" 
                    ${field.required ? 'required' : ''}
                >
            `;
        }
        
        dynamicFields.appendChild(fieldContainer);
    });

    modal.style.display = 'block';
}

function closeAddDocumentModal() {
    document.getElementById('add-document-modal').style.display = 'none';
}

async function addDocument() {
    const collection = document.getElementById('document-collection').value;
    const form = document.getElementById('add-document-form');
    const formData = new FormData(form);
    const documentData = {};

    for (let [key, value] of formData.entries()) {
        documentData[key] = value;
    }

    try {
        const response = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentToken}`
            },
            body: JSON.stringify(documentData)
        });

        const data = await response.json();

        if (data.status === 'ok') {
            alert('Document added successfully');
            closeAddDocumentModal();
            showCollections();
        } else {
            alert(`Error: ${data.data}`);
        }
    } catch (error) {
        console.error('Error adding document:', error);
        alert('Failed to add document');
    }
}

async function deleteDocument(docId, buttonElement) {
    const token = currentToken || localStorage.getItem('token');
    
    if (!confirm('Are you sure you want to delete this document?')) {
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/users/${docId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.status === 'ok') {
            const row = buttonElement.closest('tr');
            if (row) {
                row.remove();
            }
            alert('Document deleted successfully');
        } else {
            alert('Failed to delete document: ' + (data.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error deleting document:', error);
        alert('Error deleting document: ' + error.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        currentToken = token;
        toggleSections();
    }
    document.getElementById('view-collections-btn').addEventListener('click', showCollections);
});
