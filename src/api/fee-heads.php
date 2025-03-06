
<?php
require_once 'config.php';

// Handle different HTTP methods
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        // Get all fee heads
        try {
            $stmt = $conn->prepare("SELECT * FROM fee_heads");
            $stmt->execute();
            $feeHeads = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // For each fee head, get the class mappings
            foreach($feeHeads as $key => $feeHead) {
                $mappingStmt = $conn->prepare("
                    SELECT classId FROM fee_class_mapping 
                    WHERE feeHeadId = :feeHeadId
                ");
                $mappingStmt->bindParam(':feeHeadId', $feeHead['id']);
                $mappingStmt->execute();
                $classMappings = $mappingStmt->fetchAll(PDO::FETCH_COLUMN);
                
                $feeHeads[$key]['classIds'] = $classMappings;
            }
            
            echo json_encode($feeHeads);
        } catch(PDOException $e) {
            echo json_encode(array("error" => $e->getMessage()));
        }
        break;
        
    case 'POST':
        // Add a new fee head
        $data = json_decode(file_get_contents("php://input"));
        
        if(
            !empty($data->name) &&
            isset($data->amount) &&
            isset($data->isOneTime)
        ) {
            try {
                // Start transaction
                $conn->beginTransaction();
                
                // Insert into fee_heads table
                $query = "INSERT INTO fee_heads
                          (name, description, amount, isOneTime, isActive)
                          VALUES (:name, :description, :amount, :isOneTime, :isActive)";
                
                $stmt = $conn->prepare($query);
                
                // Bind parameters
                $stmt->bindParam(':name', $data->name);
                $stmt->bindParam(':description', $data->description ?? null);
                $stmt->bindParam(':amount', $data->amount);
                $stmt->bindParam(':isOneTime', $data->isOneTime, PDO::PARAM_BOOL);
                $isActive = $data->isActive ?? true;
                $stmt->bindParam(':isActive', $isActive, PDO::PARAM_BOOL);
                
                $stmt->execute();
                $feeHeadId = $conn->lastInsertId();
                
                // Insert class mappings if provided
                if(!empty($data->classIds) && is_array($data->classIds)) {
                    $mappingQuery = "INSERT INTO fee_class_mapping (feeHeadId, classId) VALUES (:feeHeadId, :classId)";
                    $mappingStmt = $conn->prepare($mappingQuery);
                    
                    foreach($data->classIds as $classId) {
                        $mappingStmt->bindParam(':feeHeadId', $feeHeadId);
                        $mappingStmt->bindParam(':classId', $classId);
                        $mappingStmt->execute();
                    }
                }
                
                // Commit transaction
                $conn->commit();
                
                echo json_encode(array(
                    "id" => $feeHeadId, 
                    "message" => "Fee head created successfully"
                ));
            } catch(PDOException $e) {
                // Rollback transaction on error
                $conn->rollBack();
                echo json_encode(array("error" => $e->getMessage()));
            }
        } else {
            echo json_encode(array("error" => "Incomplete data. Please provide all required fields"));
        }
        break;
        
    case 'PUT':
        // Update a fee head
        $data = json_decode(file_get_contents("php://input"));
        
        if(!empty($data->id)) {
            try {
                // Start transaction
                $conn->beginTransaction();
                
                // Update fee_heads table
                $query = "UPDATE fee_heads SET 
                         name = :name,
                         description = :description,
                         amount = :amount,
                         isOneTime = :isOneTime,
                         isActive = :isActive
                         WHERE id = :id";
                
                $stmt = $conn->prepare($query);
                
                // Bind parameters
                $stmt->bindParam(':id', $data->id);
                $stmt->bindParam(':name', $data->name);
                $stmt->bindParam(':description', $data->description ?? null);
                $stmt->bindParam(':amount', $data->amount);
                $stmt->bindParam(':isOneTime', $data->isOneTime, PDO::PARAM_BOOL);
                $stmt->bindParam(':isActive', $data->isActive, PDO::PARAM_BOOL);
                
                $stmt->execute();
                
                // Update class mappings if provided
                if(isset($data->classIds) && is_array($data->classIds)) {
                    // Delete existing mappings
                    $deleteStmt = $conn->prepare("DELETE FROM fee_class_mapping WHERE feeHeadId = :feeHeadId");
                    $deleteStmt->bindParam(':feeHeadId', $data->id);
                    $deleteStmt->execute();
                    
                    // Insert new mappings
                    if(!empty($data->classIds)) {
                        $mappingQuery = "INSERT INTO fee_class_mapping (feeHeadId, classId) VALUES (:feeHeadId, :classId)";
                        $mappingStmt = $conn->prepare($mappingQuery);
                        
                        foreach($data->classIds as $classId) {
                            $mappingStmt->bindParam(':feeHeadId', $data->id);
                            $mappingStmt->bindParam(':classId', $classId);
                            $mappingStmt->execute();
                        }
                    }
                }
                
                // Commit transaction
                $conn->commit();
                
                echo json_encode(array("message" => "Fee head updated successfully"));
            } catch(PDOException $e) {
                // Rollback transaction on error
                $conn->rollBack();
                echo json_encode(array("error" => $e->getMessage()));
            }
        } else {
            echo json_encode(array("error" => "Fee head ID is required"));
        }
        break;
}
?>
