<?php
// Mencegah akses langsung ke file ini jika bukan dari form (POST)
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Konfigurasi Email Anda di Hostinger
    $to = "devone@zandev.id"; 
    $subject = "Pesan Baru dari Website Zandev.id";
    
    // Mengambil dan membersihkan input data dari form
    $name = strip_tags(trim($_POST["name"]));
    $name = str_replace(array("\r","\n"),array(" "," "),$name);
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $message = trim($_POST["message"]);
    
    // Validasi data
    if ( empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Redirect kembali dengan pesan error (jika validasi PHP gagal)
        echo "<script>alert('Gagal mengirim: Mohon isi semua bidang dengan format yang benar.'); window.history.back();</script>";
        exit;
    }
    
    // Menyiapkan isi email
    $email_content = "ID_NAME: $name\n";
    $email_content .= "PROTOCOL_EMAIL: $email\n\n";
    $email_content .= "DATA_PAYLOAD:\n$message\n";
    
    // Menyiapkan Header Email
    $email_headers = "From: $name <$email>\r\n";
    $email_headers .= "Reply-To: $email\r\n";
    $email_headers .= "X-Mailer: PHP/" . phpversion();
    
    // Mengirim email dengan fungsi mail() PHP
    if (mail($to, $subject, $email_content, $email_headers)) {
        // Jika sukses, tampilkan alert dan redirect ke halaman depan
        echo "<script>alert('TRANSMISSION SUCCESS: Pesan Anda berhasil dikirim ke server.'); window.location.href = 'index.html';</script>";
    } else {
        // Jika gagal mengirim (masalah server)
        echo "<script>alert('TRANSMISSION ERROR: Gagal mengirim pesan. Silakan coba lagi nanti.'); window.history.back();</script>";
    }
    
} else {
    // Redirect ke halaman depan jika diakses secara langsung
    header("Location: index.html");
    exit;
}
?>
