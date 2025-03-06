
<?php
require_once 'config.php';

// Handle different HTTP methods
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        // Get all academic sessions
        try {
            $stmt = $conn->prepare("SELECT * FROM academic_sessions");
            $stmt->execute();
            $sessions = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode($sessions);
        } catch(PDOException $e) {
            echo json_encode(array("error" => $e->getMessage()));
        }
        break;
        
    case 'POST':
        // Add a new academic session
        $data = json_decode(file_get_contents("php://input"));
        
        if(
            !empty($data->name) &&
            !empty($data->startDate) &&
            !empty($data->endDate)
        ) {
            try {
                // If this session is active, deactivate all others
                if(!empty($data->isActive) && $data->isActive) {
                    $update = $conn->prepare("UPDATE academic_sessions SET isActive = 0");
                    $update->execute();
                }
                
                $query = "INSERT INTO academic_sessions
                          (name, startDate, endDate, isActive)
                          VALUES (:name, :startDate, :endDate, :isActive)";
                
                $stmt = $conn->prepare($query);
                
                // Bind parameters
                $stmt->bindParam(':name', $data->name);
                $stmt->bindParam(':startDate', $data->startDate);
                $stmt->bindParam(':endDate', $data->endDate);
                $isActive = $data->isActive ?? false;
                $stmt->bindParam(':isActive', $isActive, PDO::PARAM_BOOL);
                
                if($stmt->execute()) {
                    echo json_encode(array("id" => $conn->lastInsertId(), "message" => "Academic session created successfully"));
                } else {
                    echo json_encode(array("error" => "Unable to create academic session"));
                }
            } catch(PDOException $e) {
                echo json_encode(array("error" => $e->getMessage()));
            }
        } else {
            echo json_encode(array("error" => "Incomplete data. Please provide all required fields"));
        }
        break;
        
    case 'PUT':
        // Update an academic session
        $data = json_decode(file_get_contents("php://input"));
        
        if(!empty($data->id)) {
            try {
                // If this session is active, deactivate all others
                if(!empty($data->isActive) && $data->isActive) {
                    $update = $conn->prepare("UPDATE academic_sessions SET isActive = 0");
                    $update->execute();
                }
                
                $query = "UPDATE academic_sessions SET 
                         name = :name,
                         startDate = :startDate,
                         endDate = :endDate,
                         isActive = :isActive
                         WHERE id = :id";
                
                $stmt = $conn->prepare($query);
                
                // Bind parameters
                $stmt->bindParam(':id', $data->id);
                $stmt->bindParam(':name', $data->name);
                $stmt->bindParam(':startDate', $data->startDate);
                $stmt->bindParam(':endDate', $data->endDate);
                $isActive = $data->isActive ?? false;
                $stmt->bindParam(':isActive', $isActive, PDO::PARAM_BOOL);
                
                if($stmt->execute()) {
                    echo json_encode(array("message" => "Academic session updated successfully"));
                } else {
                    echo json_encode(array("error" => "Unable to update academic session"));
                }
            } catch(PDOException $e) {
                echo json_encode(array("error" => $e->getMessage()));
            }
        } else {
            echo json_encode(array("error" => "Academic session ID is required"));
        }
        break;
}
?>
