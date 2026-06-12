<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

function getRealIpAddress() {
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
    if (strtolower($ip) === 'unknown' || empty($ip)) {
        if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
            return $_SERVER['HTTP_CF_CONNECTING_IP'];
        }
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            return $_SERVER['HTTP_CLIENT_IP'];
        }
        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ipList = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
            foreach ($ipList as $singleIp) {
                $singleIp = trim($singleIp);
                if (strtolower($singleIp) !== 'unknown' && filter_var($singleIp, FILTER_VALIDATE_IP)) {
                    return $singleIp;
                }
            }
        }
        return $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
    }
    return $ip;
}

$ip = getRealIpAddress();
if ($ip === '::1' || $ip === '127.0.0.1') {
    $ip = '8.8.8.8'; // mock for local testing
}

$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';

// Parse OS
$os = "Unknown OS";
$osArray = [
    '/windows nt 10/i'      =>  'Windows 10/11',
    '/windows nt 6.3/i'     =>  'Windows 8.1',
    '/windows nt 6.2/i'     =>  'Windows 8',
    '/windows nt 6.1/i'     =>  'Windows 7',
    '/macintosh|mac os x/i' =>  'Mac OS X',
    '/mac_powerpc/i'        =>  'Mac OS 9',
    '/linux/i'              =>  'Linux',
    '/ubuntu/i'             =>  'Ubuntu',
    '/iphone/i'             =>  'iPhone',
    '/ipod/i'               =>  'iPod',
    '/ipad/i'               =>  'iPad',
    '/android/i'            =>  'Android'
];
foreach ($osArray as $regex => $value) {
    if (preg_match($regex, $userAgent)) {
        $os = $value;
        break;
    }
}

// Parse Browser
$browser = "Unknown Browser";
$browserArray = [
    '/edge/i'      => 'Edge',
    '/msie/i'      => 'Internet Explorer',
    '/chrome/i'    => 'Chrome',
    '/safari/i'    => 'Safari',
    '/firefox/i'   => 'Firefox',
    '/opera/i'     => 'Opera',
    '/netscape/i'  => 'Netscape'
];
foreach ($browserArray as $regex => $value) {
    if (preg_match($regex, $userAgent)) {
        $browser = $value;
        break;
    }
}

// Parse Device Type
$deviceType = 'Desktop';
if (preg_match('/mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i', $userAgent)) {
    $deviceType = 'Mobile';
} elseif (preg_match('/ipad|tablet/i', $userAgent)) {
    $deviceType = 'Tablet';
}

// Get Location and ISP
$location = 'Unknown';
$isp = 'Unknown';
if (filter_var($ip, FILTER_VALIDATE_IP)) {
    $apiUrl = "http://ip-api.com/json/{$ip}?fields=status,country,city,isp";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_TIMEOUT, 3);
    $response = curl_exec($ch);
    curl_close($ch);
    
    if ($response) {
        $data = json_decode($response, true);
        if (isset($data['status']) && $data['status'] === 'success') {
            $location = $data['city'] . ', ' . $data['country'];
            $isp = $data['isp'];
        }
    }
}

try {
    $dbFile = __DIR__ . '/intel_zandev.db';
    $db = new PDO('sqlite:' . $dbFile);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->exec('CREATE TABLE IF NOT EXISTS visitors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip TEXT UNIQUE,
        user_agent TEXT,
        browser TEXT,
        os TEXT,
        device_type TEXT,
        city TEXT,
        isp TEXT,
        last_seen DATETIME,
        visit_count INTEGER DEFAULT 1
    )');

    $stmt = $db->prepare('SELECT id, visit_count FROM visitors WHERE ip = ?');
    $stmt->execute([$ip]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $now = date('Y-m-d H:i:s');
    
    if ($row) {
        $stmt = $db->prepare('UPDATE visitors SET last_seen = ?, user_agent = ?, browser = ?, os = ?, device_type = ?, city = ?, isp = ?, visit_count = visit_count + 1 WHERE id = ?');
        $stmt->execute([$now, $userAgent, $browser, $os, $deviceType, $location, $isp, $row['id']]);
    } else {
        $stmt = $db->prepare('INSERT INTO visitors (ip, user_agent, browser, os, device_type, city, isp, last_seen, visit_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)');
        $stmt->execute([$ip, $userAgent, $browser, $os, $deviceType, $location, $isp, $now]);
    }
    
    echo json_encode(['status' => 'success']);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
