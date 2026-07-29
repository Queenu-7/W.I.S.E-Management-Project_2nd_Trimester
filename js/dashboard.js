const API_BASE = window.location.origin;

document.addEventListener("DOMContentLoaded", () => {
    loadDashboardStats();
    loadSalesHistory();
    loadProducts();
    loadExpenses();
    loadContacts();
});

async function loadDashboardStats() {
    try {
        const token = localStorage.getItem("wise_token");

        const response = await fetch(`${API_BASE}/api/dashboard`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,

            }
        });

        if (!response.ok) {
            throw new Error("Failed to load dashboard data");
        }

        const data = await response.json();

        document.getElementById("stat-products").textContent = data.products ?? 0;

        document.getElementById("stat-sales").textContent = data.sales ?? 0;

        document.getElementById("stat-revenue").textContent = `${(data.revenue || 0).toLocaleString()} RWF`;

        document.getElementById("stat-expenses").textContent = `${(data.expenses || 0).toLocaleString()} RWF`;

        document.getElementById("stat-profit").textContent = `${(data.profit || 0).toLocaleString()} RWF`;
    
    } catch (error) {
        console.error("Dashboard Error:", error);

        alert("Could not load dashboard information.");
    }
}

async function loadSalesHistory() {
    try {
        const token = localStorage.getItem("wise_token");

        const response = await fetch(`${API_BASE}/api/sales`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const sales = await response.json();

        document.getElementById("sales-list").innerHTML = sales.map(sale => `
            <tr>
                <td>${sale.id}</td>
                <td>${sale.product_name}</td>
                <td>${sale.quantity}</td>
                <td>${Number(sale.total).toLocaleString()} RWF</td>
                <td>${sale.timestamp}</td>
            </tr>
            `).join("");
    } catch (error) {
        console.error("Sales History Error:", error);
    }
}

async function loadProducts() {
    try {
        const token = localStorage.getItem("wise_token");

        const response = await fetch(`${API_BASE}/api/products`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const products = await response.json();

        document.getElementById("inventory-list").innerHTML = products.map(product => `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.quantity}</td>
                <td>${Number(product.unit_price).toLocaleString()} RWF</td>
                <td>-</td>
            </tr>
        `).join("");
    } catch (error) {
        console.error("Products Error:", error);
    }
}

async function loadExpenses() {
     try {
        const token = localStorage.getItem("wise_token");

        const response = await fetch(`${API_BASE}/api/expenses`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const expenses = await response.json();

        document.getElementById("expense-list").innerHTML = expenses.map(expense => `
            <tr>
                <td>${expense.id}</td>
                <td>${expense.category}</td>
                <td>${expense.description || ""}</td>
                <td>${Number(expense.amount).toLocaleString()} RWF</td>
            </tr>
        `).join("");
    } catch (error) {
        console.error("Expenses Error:", error);
    }

    
}

async function loadContacts() {
    try {
        const token = localStorage.getItem("wise_token");

        const response = await fetch(`${API_BASE}/api/contacts`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const contacts = await response.json();

        document.getElementById("contact-list").innerHTML = contacts.map(contact => `
            <tr>
                <td>${contact.name}</td>
                <td>${contact.contact_detail}</td>
                <td>-</td>
            </tr>
        `).join("");
    } catch (error) {
        console.error("Contacts Error:", error);
    }
}

document.getElementById("product-form").addEventListener("submit", async(e) =>{
    e.preventDefault();

    const token = localStorage.getItem("wise_token");

    await fetch(`${API_BASE}/api/products`, {
        method: "POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${token}`
        },
        body:JSON.stringify({
            name: document.getElementById("prod-name").value,
            quantity: document.getElementById("prod-quantity").value,
            unit_price: document.getElementById("prod-price").value 
        })
    });

    loadProducts();
    loadDashboardStats();

    e.target.reset();
})
