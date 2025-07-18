document.addEventListener('DOMContentLoaded', function () {
    const mapCenter = [-7.75, 112.9];
    const map = L.map('map').setView(mapCenter, 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const sekolahData = [
        { npsn: '20519123', nama: 'SMPN 1 Grati', jenis: 'SMP', status: 'Negeri', jumlahGuru: 50, jumlahSiswa: 800, persentaseKerusakan: 10, kekuranganGuru: 'Matematika', akanPensiun: false, lat: -7.7234, lng: 113.0055 },
        { npsn: '20518661', nama: 'SDN 1 Pandaan', jenis: 'SD', status: 'Negeri', jumlahGuru: 25, jumlahSiswa: 450, persentaseKerusakan: 5, kekuranganGuru: null, akanPensiun: true, lat: -7.6500, lng: 112.7050 },
        { npsn: '20519000', nama: 'SMPN 1 Bangil', jenis: 'SMP', status: 'Negeri', jumlahGuru: 60, jumlahSiswa: 950, persentaseKerusakan: 0, kekuranganGuru: 'Bahasa Inggris', akanPensiun: true, lat: -7.5981, lng: 112.8200 },
        { npsn: '20519999', nama: 'SDN 2 Rejoso', jenis: 'SD', status: 'Negeri', jumlahGuru: 15, jumlahSiswa: 200, persentaseKerusakan: 30, kekuranganGuru: null, akanPensiun: false, lat: -7.68, lng: 112.95 }
    ];

    function displayKPIs() {
        const totalLembaga = sekolahData.length;
        const totalGuru = sekolahData.reduce((sum, s) => sum + s.jumlahGuru, 0);
        const totalSiswa = sekolahData.reduce((sum, s) => sum + s.jumlahSiswa, 0);
        const sekolahRusakBerat = sekolahData.filter(s => s.persentaseKerusakan > 20).length;
        const guruAkanPensiun = sekolahData.filter(s => s.akanPensiun).length;

        const kpiContainer = document.getElementById('kpi-dashboard');
        kpiContainer.innerHTML = `
            <div class="kpi-card"><div class="value">${totalLembaga}</div><div class="label">Total Lembaga</div></div>
            <div class="kpi-card"><div class="value">${totalGuru}</div><div class="label">Total Guru</div></div>
            <div class="kpi-card"><div class="value">${totalSiswa}</div><div class="label">Total Siswa</div></div>
            <div class="kpi-card"><div class="value">${sekolahRusakBerat}</div><div class="label">Sekolah Rusak</div></div>
            <div class="kpi-card"><div class="value">${guruAkanPensiun}</div><div class="label">Guru Akan Pensiun</div></div>
        `;
    }

    const markerLayers = {};
    sekolahData.forEach(sekolah => {
        const marker = L.marker([sekolah.lat, sekolah.lng]);
        // Perbarui popup untuk menyertakan tombol detail yang benar
        const popupContent = `
            <b>${sekolah.nama}</b><br>
            NPSN: ${sekolah.npsn}<br>
            Status: ${sekolah.status}<br>
            <a href="profil-sekolah.html?npsn=${sekolah.npsn}" target="_blank" class="detail-button">Lihat Detail Lengkap</a>
        `;
        marker.bindPopup(popupContent);
        markerLayers[sekolah.npsn] = marker;
    });

    function applyAllFilters() {
        const kondisiFilter = document.getElementById('filter-kondisi').value;
        const guruFilter = document.getElementById('filter-guru').value;
        const pensiunFilter = document.getElementById('filter-pensiun').value;

        sekolahData.forEach(sekolah => {
            const marker = markerLayers[sekolah.npsn];
            if (!marker) return;

            let show = true;
            if (kondisiFilter === 'rusak-berat' && sekolah.persentaseKerusakan <= 20) show = false;
            if (guruFilter !== 'semua' && sekolah.kekuranganGuru !== guruFilter) show = false;
            if (pensiunFilter === 'ya' && !sekolah.akanPensiun) show = false;

            if (show) {
                marker.addTo(map);
            } else {
                marker.removeFrom(map);
            }
        });
    }

    document.getElementById('filter-kondisi').addEventListener('change', applyAllFilters);
    document.getElementById('filter-guru').addEventListener('change', applyAllFilters);
    document.getElementById('filter-pensiun').addEventListener('change', applyAllFilters);
    
    document.getElementById('btn-prediksi-kursi').addEventListener('click', () => alert("ANALISIS PREDIKTIF (Contoh)..."));
    document.getElementById('btn-simulasi-regrouping').addEventListener('click', () => alert("ANALISIS SIMULASI (Contoh)..."));

    displayKPIs();
    applyAllFilters();
});
