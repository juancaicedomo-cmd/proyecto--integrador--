const API_BASE = 'http://localhost:3000/api';
const user = JSON.parse(localStorage.getItem('user'));
if (!localStorage.getItem('token')) window.location.href = 'login.html';

// --- State & Settings ---
let settings = JSON.parse(localStorage.getItem('parking_settings')) || {
    name: 'PARKING MASTER PRO',
    totalSlots: 20,
    rates: { Carro: 5000, Moto: 3000, Camioneta: 7000 }
};

let vehicles = [];
let typeChart;

// --- Init UI ---
function initUI() {
    document.getElementById('userName').textContent = user.nombre;
    document.getElementById('userInitial').textContent = user.nombre.charAt(0).toUpperCase();
    document.getElementById('parkingNameDisplay').textContent = settings.name;
    document.getElementById('setParkingName').value = settings.name;
    document.getElementById('setTotalSlots').value = settings.totalSlots;
    document.getElementById('rateCarro').value = settings.rates.Carro;
    document.getElementById('rateMoto').value = settings.rates.Moto;
    document.getElementById('rateCamioneta').value = settings.rates.Camioneta;
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    
    // Theme Persistence
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// --- Navigation ---
function switchTab(id) {
    document.querySelectorAll('.tab-view').forEach(v => v.classList.remove('active'));
    document.getElementById(id + 'Tab').classList.add('active');
    
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.getElementById('nav' + id.charAt(0).toUpperCase() + id.slice(1)).classList.add('active');
    
    const titles = { dashboard: 'Resumen de Operaciones', history: 'Historial de Transacciones', admins: 'Personal Administrativo', settings: 'Configuración del Sistema' };
    document.getElementById('tabTitle').textContent = titles[id];
    
    if (id === 'admins') loadAdmins();
    loadData();
}

// --- Data Fetching ---
async function loadData() {
    try {
        const res = await fetch(`${API_BASE}/vehiculos`);
        vehicles = await res.json();
        renderDashboard();
    } catch (e) { console.error('Error:', e); }
}

async function loadAdmins() {
    try {
        const res = await fetch(`${API_BASE}/auth/usuarios`);
        const admins = await res.json();
        const tbody = document.getElementById('adminList');
        tbody.innerHTML = '';
        admins.forEach(a => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>#${a.id}</td><td style="font-weight:700;">${a.nombre}</td><td>${a.email}</td><td><span class="tag tag-blue">${a.id === 1 ? 'Súper Admin' : 'Operador'}</span></td><td><span class="tag tag-green">En Línea</span></td>`;
            tbody.appendChild(tr);
        });
    } catch (e) { console.error(e); }
}

// --- Billing Logic ---
function calculateBill(v) {
    const start = new Date(v.hora_ingreso);
    const end = new Date();
    const diffMs = end - start;
    const diffHours = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60)));
    const rate = settings.rates[v.tipo] || 5000;
    return {
        amount: diffHours * rate,
        hours: Math.floor(diffMs / (1000 * 60 * 60)),
        minutes: Math.floor((diffMs / (1000 * 60)) % 60)
    };
}

function openVehicleModal(id) {
    const v = vehicles.find(veh => veh.id === id);
    if (!v) return;
    
    const bill = calculateBill(v);
    document.getElementById('vDetailPlate').textContent = v.placa;
    document.getElementById('vDetailType').textContent = v.tipo.toUpperCase();
    document.getElementById('vDetailTime').textContent = `${bill.hours}h ${bill.minutes}m`;
    document.getElementById('vDetailBill').textContent = `$${bill.amount.toLocaleString()}`;
    
    document.getElementById('btnConfirmExit').onclick = () => registerExit(v.id, v.placa);
    openModal('modalVehicle');
}

async function registerExit(id, placa) {
    const res = await fetch(`${API_BASE}/vehiculos/salida/${id}`, { method: 'PUT' });
    if (res.ok) {
        showToast(`Salida exitosa: ${placa}`, 'success');
        closeModals();
        loadData();
    }
}

// --- Rendering ---
function renderDashboard() {
    renderTable();
    renderMap();
    renderHistory();
    updateStats();
    updateCharts();
}

function renderTable() {
    const tbody = document.getElementById('vehicleList');
    tbody.innerHTML = '';
    const search = document.getElementById('searchPlate').value.toUpperCase();
    
    vehicles.filter(v => v.estado === 'activo' && v.placa.includes(search)).forEach(v => {
        const tr = document.createElement('tr');
        const minutes = Math.floor((new Date() - new Date(v.hora_ingreso)) / 60000);
        const timeStr = minutes < 60 ? `${minutes}m` : `${Math.floor(minutes/60)}h ${minutes%60}m`;
        
        tr.innerHTML = `
            <td><strong style="font-size:1.1rem;">${v.placa}</strong></td>
            <td><span class="badge" style="background:#eef2ff; color:#4f46e5; padding:4px 8px; border-radius:8px; font-size:0.7rem;">${v.tipo}</span></td>
            <td>${new Date(v.hora_ingreso).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
            <td style="font-weight:700; color:var(--primary);">${timeStr}</td>
            <td><button class="btn-pay" style="padding:0.4rem 0.8rem; font-size:0.7rem;" onclick="openVehicleModal(${v.id})">COBRAR</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function renderMap() {
    const map = document.getElementById('parkingMap');
    map.innerHTML = '';
    const active = vehicles.filter(v => v.estado === 'activo');
    for (let i = 1; i <= settings.totalSlots; i++) {
        const slot = document.createElement('div');
        const v = active[i-1];
        slot.className = `slot ${v ? 'occupied' : 'free'}`;
        slot.innerHTML = v ? `<i class="fas fa-${v.tipo === 'Moto' ? 'motorcycle' : (v.tipo === 'Carro' ? 'car' : 'truck-pickup')}"></i><div style="font-size:0.6rem; font-weight:800;">${v.placa}</div>` : i;
        if (v) slot.onclick = () => openVehicleModal(v.id);
        map.appendChild(slot);
    }
}

function renderHistory() {
    const tbody = document.getElementById('historyList');
    tbody.innerHTML = '';
    vehicles.filter(v => v.estado === 'finalizado').forEach(v => {
        const tr = document.createElement('tr');
        const diff = Math.floor((new Date(v.hora_salida) - new Date(v.hora_ingreso)) / 60000);
        const timeStr = `${Math.floor(diff/60)}h ${diff%60}m`;
        tr.innerHTML = `<td><strong>${v.placa}</strong></td><td>${v.tipo}</td><td>${new Date(v.hora_ingreso).toLocaleTimeString()}</td><td>${new Date(v.hora_salida).toLocaleTimeString()}</td><td>${timeStr}</td><td style="color:var(--success); font-weight:800;">$${(settings.rates[v.tipo] || 5000).toLocaleString()}</td>`;
        tbody.appendChild(tr);
    });
}

function updateStats() {
    const activeCount = vehicles.filter(v => v.estado === 'activo').length;
    const finished = vehicles.filter(v => v.estado === 'finalizado');
    const totalRev = finished.reduce((acc, v) => acc + (settings.rates[v.tipo] || 5000), 0);
    
    document.getElementById('totalActive').textContent = activeCount;
    document.getElementById('availableSlots').textContent = settings.totalSlots - activeCount;
    document.getElementById('occupancyPercent').textContent = `${Math.round((activeCount/settings.totalSlots)*100)}%`;
    document.getElementById('dailyRevenue').textContent = `$${totalRev.toLocaleString()}`;
}

// --- Chart ---
function updateCharts() {
    const ctx = document.getElementById('typeChart').getContext('2d');
    const counts = { Carro: 0, Moto: 0, Camioneta: 0 };
    vehicles.filter(v => v.estado === 'activo').forEach(v => counts[v.tipo]++);
    
    if (typeChart) typeChart.destroy();
    typeChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Carros', 'Motos', 'Camionetas'],
            datasets: [{
                data: [counts.Carro, counts.Moto, counts.Camioneta],
                backgroundColor: ['#4f46e5', '#fbbf24', '#10b981'],
                borderWidth: 0
            }]
        },
        options: { plugins: { legend: { position: 'bottom' } }, cutout: '75%' }
    });
}

// --- Settings Actions ---
function saveGeneralSettings() {
    settings.name = document.getElementById('setParkingName').value.toUpperCase();
    settings.totalSlots = parseInt(document.getElementById('setTotalSlots').value);
    localStorage.setItem('parking_settings', JSON.stringify(settings));
    document.getElementById('parkingNameDisplay').textContent = settings.name;
    showToast('Configuración guardada', 'success');
    loadData();
}

function saveRates() {
    settings.rates.Carro = parseInt(document.getElementById('rateCarro').value);
    settings.rates.Moto = parseInt(document.getElementById('rateMoto').value);
    settings.rates.Camioneta = parseInt(document.getElementById('rateCamioneta').value);
    localStorage.setItem('parking_settings', JSON.stringify(settings));
    showToast('Tarifas actualizadas', 'success');
    loadData();
}

function exportToCSV() {
    const finished = vehicles.filter(v => v.estado === 'finalizado');
    let csv = 'Placa,Tipo,Entrada,Salida,Pago\n';
    finished.forEach(v => {
        csv += `${v.placa},${v.tipo},${new Date(v.hora_ingreso).toLocaleString()},${new Date(v.hora_salida).toLocaleString()},${settings.rates[v.tipo]}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `reporte_parking_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// --- Modals ---
function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModals() { document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none'); }

function printReceipt() {
    const plate = document.getElementById('vDetailPlate').textContent;
    const v = vehicles.find(veh => veh.placa === plate && veh.estado === 'activo');
    const bill = calculateBill(v);
    
    document.getElementById('printHeader').textContent = settings.name;
    document.getElementById('printPlate').textContent = plate;
    document.getElementById('printType').textContent = v.tipo;
    document.getElementById('printIn').textContent = new Date(v.hora_ingreso).toLocaleString();
    document.getElementById('printOut').textContent = new Date().toLocaleString();
    document.getElementById('printTime').textContent = `${bill.hours}h ${bill.minutes}m`;
    document.getElementById('printTotal').textContent = `$${bill.amount.toLocaleString()}`;
    
    const printArea = document.getElementById('printableReceipt');
    printArea.style.display = 'block';
    window.print();
    printArea.style.display = 'none';
}

// --- Events ---
document.getElementById('vehicleForm').onsubmit = async (e) => {
    e.preventDefault();
    const placa = document.getElementById('placa').value.toUpperCase();
    const tipo = document.getElementById('tipo').value;
    const res = await fetch(`${API_BASE}/vehiculos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placa, tipo, usuario_id: user.id })
    });
    if (res.ok) {
        showToast(`Ingreso: ${placa}`, 'success');
        e.target.reset();
        loadData();
    }
};

function showToast(msg, type) {
    const c = document.getElementById('toast-container');
    const t = document.createElement('div');
    t.className = 'toast';
    t.style.borderLeftColor = `var(--${type})`;
    t.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}" style="color:var(--${type})"></i> <span>${msg}</span>`;
    c.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(20px)'; setTimeout(() => t.remove(), 400); }, 3000);
}

document.getElementById('themeToggle').onclick = () => {
    const h = document.documentElement;
    const isDark = h.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    h.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    document.getElementById('themeToggle').innerHTML = next === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
};

function updateClock() { document.getElementById('realTimeClock').textContent = new Date().toLocaleTimeString(); }
setInterval(updateClock, 1000);
updateClock();
initUI();
loadData();
setInterval(loadData, 10000);
