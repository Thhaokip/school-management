
<?php
// Include database connection
require_once 'config.php';

// Set response header to JSON
header('Content-Type: application/json');

// Handle login requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get data from request body
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Check if this is a password change request
    if (isset($data['action']) && $data['action'] === 'changePassword') {
        if (!isset($data['userId']) || !isset($data['currentPassword']) || !isset($data['newPassword'])) {
            echo json_encode(['success' => false, 'message' => 'Missing required fields']);
            exit;
        }
        
        $userId = $data['userId'];
        $currentPassword = $data['currentPassword'];
        $newPassword = $data['newPassword'];
        
        try {
            // First verify the current password
            $stmt = $conn->prepare("SELECT id FROM users WHERE id = ? AND password = ?");
            $stmt->execute([$userId, $currentPassword]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$user) {
                echo json_encode([
                    'success' => false,
                    'message' => 'Current password is incorrect'
                ]);
                exit;
            }
            
            // Update with new password
            $updateStmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
            $updateResult = $updateStmt->execute([$newPassword, $userId]);
            
            if ($updateResult) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Password updated successfully'
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to update password'
                ]);
            }
        } catch (PDOException $e) {
            echo json_encode([
                'success' => false,
                'message' => 'Database error: ' . $e->getMessage()
            ]);
        }
    } else {
        // Handle regular login
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
}
?>
