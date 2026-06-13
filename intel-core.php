<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['access_key']) && $_POST['access_key'] === 'Zandev!') {
        $_SESSION['zandev_intel'] = true;
    } else {
        echo "<script>alert('ACCESS DENIED.'); window.location.href='index.html';</script>";
        exit;
    }
}

if (!isset($_SESSION['zandev_intel']) || $_SESSION['zandev_intel'] !== true) {
    header('Location: index.html');
    exit;
}

// Fetch DB
$dbFile = __DIR__ . '/api/intel_zandev.db';
$visitors = [];
$totalVisits = 0;
$uniqueVisitors = 0;
$osStats = [];
$deviceStats = [];

try {
    if (file_exists($dbFile)) {
        $db = new PDO('sqlite:' . $dbFile);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $stmt = $db->query('SELECT * FROM visitors ORDER BY last_seen DESC LIMIT 100');
        $visitors = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Stats
        $stmt = $db->query('SELECT COUNT(id) as unique_v, SUM(visit_count) as total_v FROM visitors');
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $uniqueVisitors = $row['unique_v'] ?? 0;
        $totalVisits = $row['total_v'] ?? 0;
        
        // OS Stats
        $stmt = $db->query('SELECT os, COUNT(id) as count FROM visitors GROUP BY os');
        $osData = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach($osData as $d) {
            $osStats[$d['os']] = $d['count'];
        }
        
        // Device Stats
        $stmt = $db->query('SELECT device_type, COUNT(id) as count FROM visitors GROUP BY device_type');
        $deviceData = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach($deviceData as $d) {
            $deviceStats[$d['device_type']] = $d['count'];
        }
    }
} catch (Exception $e) {
    // Ignore if not created yet
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Zandev.id - Intel Core</title>
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Outfit:wght@400;600;800&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/@phosphor-icons/web"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        :root {
            --bg: #050a0e;
            --surface: #0a131a;
            --surface-2: #111e27;
            --primary: #00ff41;
            --primary-glow: rgba(0, 255, 65, 0.2);
            --text: #e0e0e0;
            --text-muted: #8a9ba8;
            --border: #1a2a36;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: var(--bg); color: var(--text); font-family: 'Outfit', sans-serif; line-height: 1.6; }
        .cyber-grid {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px);
            background-size: 40px 40px; opacity: 0.15; z-index: -1;
            pointer-events: none;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 1px solid var(--border); padding-bottom: 1rem; }
        .logo { display: flex; align-items: center; gap: 10px; font-family: 'Fira Code', monospace; color: var(--primary); font-size: 1.5rem; font-weight: 600; text-shadow: 0 0 10px var(--primary-glow); }
        .logo i { font-size: 2rem; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
        .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem; position: relative; overflow: hidden; }
        .stat-card::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--primary); box-shadow: 0 0 15px var(--primary); }
        .stat-title { color: var(--text-muted); font-size: 0.9rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; gap: 8px; margin-bottom: 0.5rem; }
        .stat-value { font-size: 2.5rem; font-weight: 800; color: #fff; font-family: 'Fira Code', monospace; }
        
        .charts-wrapper { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem; }
        .chart-container { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem; }
        .section-title { font-size: 1.2rem; font-weight: 600; margin-bottom: 1rem; color: var(--primary); display: flex; align-items: center; gap: 10px; }
        
        .table-container { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow-x: auto; }
        table { width: 100%; min-width: 800px; border-collapse: collapse; text-align: left; }
        th, td { padding: 1rem; border-bottom: 1px solid var(--border); }
        th { background: var(--surface-2); color: var(--text-muted); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
        td { font-size: 0.95rem; }
        tbody tr:hover { background: rgba(255,255,255,0.02); }
        .ip-badge { background: rgba(0,255,65,0.1); color: var(--primary); padding: 4px 8px; border-radius: 4px; font-family: 'Fira Code', monospace; font-size: 0.85rem; border: 1px solid rgba(0,255,65,0.2); display: inline-block; }
        .time-badge { color: var(--text-muted); font-size: 0.85rem; }
        .btn { background: transparent; color: var(--text); border: 1px solid var(--border); padding: 8px 16px; border-radius: 6px; cursor: pointer; font-family: 'Fira Code', monospace; display: flex; align-items: center; gap: 8px; transition: 0.3s; text-decoration: none; }
        .btn:hover { background: var(--surface-2); border-color: var(--primary); color: var(--primary); }

        @media (max-width: 768px) { 
            .charts-wrapper { grid-template-columns: 1fr; } 
            .stats-grid { grid-template-columns: 1fr 1fr; gap: 1rem; }
            .stat-card { padding: 1rem; }
            .stat-title { font-size: 0.75rem; }
            .stat-value { font-size: 1.8rem; }
            .container { padding: 1rem; }
            header { flex-direction: column; gap: 1rem; align-items: flex-start; }
            
            /* Responsive Hacker Table */
            table, thead, tbody, th, td, tr { display: block; min-width: auto; }
            thead tr { position: absolute; top: -9999px; left: -9999px; }
            tr { border: 1px solid var(--border); border-radius: 8px; margin-bottom: 1rem; padding: 0.5rem; background: var(--surface-2); }
            td { border: none; border-bottom: 1px solid rgba(255,255,255,0.05); position: relative; padding: 0.8rem; padding-left: 40%; display: flex; align-items: center; justify-content: flex-end; text-align: right; }
            td:last-child { border-bottom: 0; }
            td::before { content: attr(data-label); position: absolute; left: 0.8rem; width: 35%; padding-right: 10px; white-space: nowrap; text-align: left; font-size: 0.8rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; }
            .ip-badge { font-size: 0.75rem; }
            .table-container { background: transparent; border: none; overflow: visible; padding: 0; }
        }
    </style>
</head>
<body>
    <div class="cyber-grid"></div>
    <div class="container">
        <header>
            <div class="logo">
                <i class="ph-fill ph-cpu"></i> ZANDEV_INTEL_CORE
            </div>
            <a href="index.html" class="btn"><i class="ph ph-sign-out"></i> Logout</a>
        </header>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-title"><i class="ph ph-users"></i> Unique Visitors</div>
                <div class="stat-value"><?= $uniqueVisitors ?></div>
            </div>
            <div class="stat-card">
                <div class="stat-title"><i class="ph ph-eye"></i> Total Page Views</div>
                <div class="stat-value"><?= $totalVisits ?></div>
            </div>
            <div class="stat-card" style="grid-column: 1 / -1;">
                <div class="stat-title"><i class="ph ph-clock-counter-clockwise"></i> Latest Activity</div>
                <div class="stat-value" style="font-size: 1.5rem; margin-top: 5px;"><?= count($visitors) > 0 ? date('H:i:s', strtotime($visitors[0]['last_seen'])) : 'N/A' ?></div>
            </div>
        </div>

        <div class="charts-wrapper">
            <div class="chart-container">
                <h3 class="section-title"><i class="ph ph-monitor"></i> OS Distribution</h3>
                <canvas id="osChart" height="200"></canvas>
            </div>
            <div class="chart-container">
                <h3 class="section-title"><i class="ph ph-device-mobile"></i> Device Types</h3>
                <canvas id="deviceChart" height="200"></canvas>
            </div>
        </div>

        <div class="table-container">
            <h3 class="section-title" style="padding: 1.5rem 0rem 0.5rem;"><i class="ph ph-list-magnifying-glass"></i> Access Logs</h3>
            <table>
                <thead>
                    <tr>
                        <th>Time / IP</th>
                        <th>Location & ISP</th>
                        <th>System Info</th>
                        <th>Visits</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach($visitors as $v): ?>
                    <tr>
                        <td data-label="Time / IP">
                            <div style="text-align: right;">
                                <div class="ip-badge"><?= htmlspecialchars($v['ip']) ?></div>
                                <div class="time-badge" style="margin-top: 6px;"><?= $v['last_seen'] ?></div>
                            </div>
                        </td>
                        <td data-label="Location & ISP">
                            <div style="text-align: right;">
                                <div style="font-weight: 600; color: #fff; display:flex; align-items:center; justify-content: flex-end; gap:6px;">
                                    <?= htmlspecialchars($v['city']) ?> <i class="ph ph-map-pin"></i>
                                </div>
                                <div class="time-badge" style="display:flex; align-items:center; justify-content: flex-end; gap:6px; margin-top: 4px;">
                                    <?= htmlspecialchars($v['isp']) ?> <i class="ph ph-hard-drives"></i>
                                </div>
                            </div>
                        </td>
                        <td data-label="System Info">
                            <div style="display:flex; align-items:center; justify-content: flex-end; gap:15px;">
                                <span style="display:flex; align-items:center; gap:6px;" title="Browser">
                                    <i class="ph ph-globe"></i> <?= htmlspecialchars($v['browser']) ?>
                                </span>
                                <span style="display:flex; align-items:center; gap:6px;" title="OS">
                                    <i class="ph ph-windows-logo"></i> <?= htmlspecialchars($v['os']) ?>
                                </span>
                                <span style="display:flex; align-items:center; gap:6px;" title="Device">
                                    <i class="ph ph-device-mobile"></i> <?= htmlspecialchars($v['device_type']) ?>
                                </span>
                            </div>
                        </td>
                        <td data-label="Visits">
                            <span style="background: var(--surface-2); padding: 4px 10px; border-radius: 12px; font-size: 0.85rem; font-weight: bold; border: 1px solid var(--border);">
                                <?= $v['visit_count'] ?>x
                            </span>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                    <?php if(empty($visitors)): ?>
                    <tr><td colspan="4" style="text-align: center; padding: 3rem; color: var(--text-muted);">NO DATA DETECTED.</td></tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>

    <script>
        Chart.defaults.color = '#8a9ba8';
        Chart.defaults.font.family = "'Outfit', sans-serif";
        
        const osData = <?= json_encode($osStats) ?>;
        const deviceData = <?= json_encode($deviceStats) ?>;
        
        const osColors = ['#00ff41', '#ff5f56', '#ffbd2e', '#2196F3', '#9C27B0'];
        
        new Chart(document.getElementById('osChart'), {
            type: 'doughnut',
            data: {
                labels: Object.keys(osData),
                datasets: [{
                    data: Object.values(osData),
                    backgroundColor: osColors,
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } }, cutout: '75%' }
        });

        new Chart(document.getElementById('deviceChart'), {
            type: 'doughnut',
            data: {
                labels: Object.keys(deviceData),
                datasets: [{
                    data: Object.values(deviceData),
                    backgroundColor: ['#2196F3', '#ffbd2e', '#00ff41'],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } }, cutout: '75%' }
        });
    </script>
</body>
</html>
