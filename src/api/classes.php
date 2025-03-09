<?php
require_once 'config.php';

// Ensure correct content type header is set first
header('Content-Type: application/json');

// Allow requests from any origin
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Handle different HTTP methods
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        // Get all classes
        try {
            $stmt = $conn->prepare("SELECT * FROM classes");
            $stmt->execute();
            $classes = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Convert numeric strings to appropriate types
            foreach ($classes as &$class) {
                $class['id'] = (string)$class['id']; // Convert ID to string for frontend
                $class['isActive'] = (bool)$class['isActive']; // Convert isActive to boolean
            }
            
            echo json_encode($classes);
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(array("error" => $e->getMessage()));
        }
        break;
        
    case 'POST':
        // Add a new class
        $data = json_decode(file_get_contents("php://input"));
        
        if(!empty($data->name)) {
            try {
                $query = "INSERT INTO classes
                          (name, description, isActive, createdAt)
                          VALUES (:name, :description, :isActive, :createdAt)";
                
                $stmt = $conn->prepare($query);
                
                // Bind parameters
                $stmt->bindParam(':name', $data->name);
                $description = $data->description ?? null;
                $stmt->bindParam(':description', $description);
                $isActive = $data->isActive ?? true;
                $stmt->bindParam(':isActive', $isActive, PDO::PARAM_BOOL);
                $createdAt = date('Y-m-d H:i:s');
                $stmt->bindParam(':createdAt', $createdAt);
                
                if($stmt->execute()) {
                    // Return ID as string to match frontend expectations
                    $newId = (string)$conn->lastInsertId();
                    http_response_code(201);
                    echo json_encode(array(
                        "id" => $newId,
                        "message" => "Class created successfully"
                    ));
                } else {
                    http_response_code(500);
                    echo json_encode(array("error" => "Unable to create class"));
                }
            } catch(PDOException $e) {
                http_response_code(500);
                echo json_encode(array("error" => $e->getMessage()));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("error" => "Class name is required"));
        }
        break;
        
    case 'PUT':
        // Update a class
        $data = json_decode(file_get_contents("php://input"));
        
        if(!empty($data->id)) {
            try {
                $query = "UPDATE classes SET 
                         name = :name,
                         description = :description,
                         isActive = :isActive
                         WHERE id = :id";
                
                $stmt = $conn->prepare($query);
                
                // Bind parameters
                $stmt->bindParam(':id', $data->id);
                $stmt->bindParam(':name', $data->name);
                $stmt->bindParam(':description', $data->description ?? null);
                $isActive = $data->isActive ?? true;
                $stmt->bindParam(':isActive', $isActive, PDO::PARAM_BOOL);
                
                if($stmt->execute()) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Class updated successfully"));
                } else {
                    http_response_code(500);
                    echo json_encode(array("error" => "Unable to update class"));
                }
            } catch(PDOException $e) {
                http_response_code(500);
                echo json_encode(array("error" => $e->getMessage()));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("error" => "Class ID is required"));
        }
        break;
        
    case 'DELETE':
        // Delete a class
        $data = json_decode(file_get_contents("php://input"));
        
        if(!empty($data->id)) {
            try {
                $query = "DELETE FROM classes WHERE id = :id";
                
                $stmt = $conn->prepare($query);
                $stmt->bindParam(':id', $data->id);
                
                if($stmt->execute()) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Class deleted successfully"));
                } else {
                    http_response_code(500);
                    echo json_encode(array("error" => "Unable to delete class"));
                }
            } catch(PDOException $e) {
                http_response_code(500);
                echo json_encode(array("error" => $e->getMessage()));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("error" => "Class ID is required"));
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(array("error" => "Method not allowed"));
        break;
}
?>
