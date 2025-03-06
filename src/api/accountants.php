
<?php
require_once 'config.php';

// Handle different HTTP methods
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        // Get all accountants
        try {
            $stmt = $conn->prepare("SELECT * FROM accountants");
            $stmt->execute();
            $accountants = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode($accountants);
        } catch(PDOException $e) {
            echo json_encode(array("error" => $e->getMessage()));
        }
        break;
        
    case 'POST':
        // Add a new accountant
        $data = json_decode(file_get_contents("php://input"));
        
        if(
            !empty($data->name) &&
            !empty($data->email) &&
            !empty($data->phone)
        ) {
            try {
                $query = "INSERT INTO accountants
                          (name, email, phone, address, joinDate, isActive)
                          VALUES (:name, :email, :phone, :address, :joinDate, :isActive)";
                
                $stmt = $conn->prepare($query);
                
                // Bind parameters
                $stmt->bindParam(':name', $data->name);
                $stmt->bindParam(':email', $data->email);
                $stmt->bindParam(':phone', $data->phone);
                $stmt->bindParam(':address', $data->address ?? null);
                $stmt->bindParam(':joinDate', $data->joinDate ?? date('Y-m-d'));
                $isActive = $data->isActive ?? true;
                $stmt->bindParam(':isActive', $isActive, PDO::PARAM_BOOL);
                
                if($stmt->execute()) {
                    echo json_encode(array("id" => $conn->lastInsertId(), "message" => "Accountant created successfully"));
                } else {
                    echo json_encode(array("error" => "Unable to create accountant"));
                }
            } catch(PDOException $e) {
                echo json_encode(array("error" => $e->getMessage()));
            }
        } else {
            echo json_encode(array("error" => "Incomplete data. Please provide all required fields"));
        }
        break;
        
    case 'PUT':
        // Update an accountant
        $data = json_decode(file_get_contents("php://input"));
        
        if(!empty($data->id)) {
            try {
                $query = "UPDATE accountants SET 
                         name = :name,
                         email = :email,
                         phone = :phone,
                         address = :address,
                         joinDate = :joinDate,
                         isActive = :isActive
                         WHERE id = :id";
                
                $stmt = $conn->prepare($query);
                
                // Bind parameters
                $stmt->bindParam(':id', $data->id);
                $stmt->bindParam(':name', $data->name);
                $stmt->bindParam(':email', $data->email);
                $stmt->bindParam(':phone', $data->phone);
                $stmt->bindParam(':address', $data->address ?? null);
                $stmt->bindParam(':joinDate', $data->joinDate ?? date('Y-m-d'));
                $isActive = $data->isActive ?? true;
                $stmt->bindParam(':isActive', $isActive, PDO::PARAM_BOOL);
                
                if($stmt->execute()) {
                    echo json_encode(array("message" => "Accountant updated successfully"));
                } else {
                    echo json_encode(array("error" => "Unable to update accountant"));
                }
            } catch(PDOException $e) {
                echo json_encode(array("error" => $e->getMessage()));
            }
        } else {
            echo json_encode(array("error" => "Accountant ID is required"));
        }
        break;
}
?>
