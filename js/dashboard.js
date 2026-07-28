const API_BASE = window.location.origin;

document.addEventListener("DOMContentLoaded", () => {
    loadDashboardStats();
    loadSalesHistory();
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
