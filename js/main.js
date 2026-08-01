const api = '/api/';
const tokenKey = 'wise_token';

async function fetchJSON(url, method = 'GET', body = null, auth = true ) {
    const headers = { 'Content-Type': 'application/json' };

    if (auth) {
        const token = localStorage.getItem(tokenKey);
        if (!token) {
            window.location.href = '/index.html';
            return;
        }
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = { method, headers };
    if (body && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(body);
    }

    try {
        const res = await fetch(url, options);

    if (res.status === 401 && auth) {
        localStorage.removeItem(tokenKey);
        window.location.href = '/index.html';
        return;
    }
    
    const data = await res.json();
    if (!res.ok) {
        return { error: data.error || `Error ${res.status}: Request failed` };
    }
    return data;

    } catch (err) {
        console.error('Fetch Error:', err);
        return { error: 'Network error or server unavaliable'};
    }
}

document.addEventListener( 'DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if  (loginForm){
        loginForm.addEventListener('submit', async e =>{
            e.preventDefault();
            const f = new FormData(loginForm);

            const response = await fetchJSON(
                `${api}auth/login`,
                'POST',
                { email: f.get('email'), password: f.get('password')},
                false
            );

            if (response.token) {
                localStorage.setItem(tokenKey, response.token);
                window.location.href = '/dashboard.html';
            } else {
                alert(response.error || 'Login failed');
            }
        });
    }

    const regForm = document.getElementById('registerForm');
    if (regForm) {
        regForm.addEventListener('submit', async e => {
            e.preventDefault();   
            const f = new FormData(regForm);

            const response = await fetchJSON(
                `${api}auth/register`,
                'POST',
                {
                    business_name: f.get('business_name'),
                    email: f.get('email'),
                    password: f.get('password')
                },
                false
            );

            if (response.id || response.message) {
                alert('Registered succesfully! Please log in.');
                window.location.href = '/index.html';
            } else {
                alert(response.error || 'Registration failed');
            }
        });
    }


    const tabButtons = document.querySelectorAll('[data-tab]');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.tab;

        document.querySelectorAll('.tab').forEach(t => t.style.display='none');

        const targetTab = document.getElementById(targetId);
        if (targetTab) {
            targetTab.style.display = 'block';
        }
        });
    });

    //Logout
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem(tokenKey);
            window.location.href = '/index.html';
        });
    }
});




