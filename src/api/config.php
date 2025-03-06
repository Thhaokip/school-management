
<?php
// Enable CORS to allow your React app to make requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Content-Type: application/json");

// Database configuration
$host = "localhost";
$db_name = "school_management";
$username = "root";
$password = "";

// Create database connection
$conn = null;
try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(array("error" => "Connection failed: " . $e->getMessage()));
    die();
}
?>
