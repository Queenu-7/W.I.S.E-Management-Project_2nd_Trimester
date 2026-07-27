const API_BASE = window.location.origin;

document.addEventListener("DOMContentLoaded", () => {
    loadDashboardStats();
});

async function loadDashboardStats() {
    try {
        const token = localStorage.getItem("token");

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

        document.getElementById("stat-products").textContent = data.products;

        document.getElementById("stat-sales").textContent = data.sales;

        document.getElementById("stat-revenue").textContent = `${data.revenue.toLocaleString()} RWF`;

        document.getElementById("stat-expenses").textContent = `${data.expenses.toLocaleString()} RWF`;

        document.getElementById("stat-profit").textContent = `${data.profit.toLocaleString()} RWF`;
    
    } catch (error) {
        console.error("Dashboard Error:", error);

        alert("Could not load dashboard information.");
    }
}
