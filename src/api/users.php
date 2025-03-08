
<?php
// Include database connection
require_once 'config.php';

// Set response header to JSON
header('Content-Type: application/json');

// Handle login requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get data from request body
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['email']) || !isset($data['password'])) {
        echo json_encode(['success' => false, 'message' => 'Email and password are required']);
        exit;
    }
    
    $email = $data['email'];
    $password = $data['password'];
    
    try {
        // Prepare and execute query
        $stmt = $conn->prepare("SELECT id, name, email, role FROM users WHERE email = ? AND password = ?");
        $stmt->execute([$email, $password]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user) {
            // User found, return success
            echo json_encode([
                'success' => true,
                'user' => $user
            ]);
        } else {
            // No user found with those credentials
            echo json_encode([
                'success' => false,
                'message' => 'Invalid email or password'
            ]);
        }
    } catch (PDOException $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Database error: ' . $e->getMessage()
        ]);
    }
}
?>
