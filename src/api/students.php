<?php
require_once 'config.php';

// Handle different HTTP methods
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        // Get all students
        try {
            $stmt = $conn->prepare("SELECT * FROM students");
            $stmt->execute();
            $students = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode($students);
        } catch(PDOException $e) {
            echo json_encode(array("error" => $e->getMessage()));
        }
        break;
        
    case 'POST':
        // Add a new student
        $data = $_POST;
        $image = $_FILES['image'] ?? null;

        if(
            !empty($data['studentId']) &&
            !empty($data['name']) &&
            !empty($data['class']) &&
            !empty($data['section']) &&
            !empty($data['rollNumber']) &&
            !empty($data['parentName']) &&
            !empty($data['contactNumber'])
        ) {
            try {
                // Check if studentId already exists
                $checkQuery = "SELECT COUNT(*) FROM students WHERE studentId = :studentId";
                $checkStmt = $conn->prepare($checkQuery);
                $checkStmt->bindParam(':studentId', $data['studentId']);
                $checkStmt->execute();
                if($checkStmt->fetchColumn() > 0) {
                    echo json_encode(array("error" => "Student ID already exists"));
                    break;
                }

                $query = "INSERT INTO students
                          (studentId, name, class, section, rollNumber, parentName, contactNumber, email, address, dateOfBirth, joinDate, image)
                          VALUES (:studentId, :name, :class, :section, :rollNumber, :parentName, :contactNumber, :email, :address, :dateOfBirth, :joinDate, :image)";
                
                $stmt = $conn->prepare($query);
                
                // Bind parameters
                $stmt->bindParam(':studentId', $data['studentId']);
                $stmt->bindParam(':name', $data['name']);
                $stmt->bindParam(':class', $data['class']);
                $stmt->bindParam(':section', $data['section']);
                $stmt->bindParam(':rollNumber', $data['rollNumber']);
                $stmt->bindParam(':parentName', $data['parentName']);
                $stmt->bindParam(':contactNumber', $data['contactNumber']);
                $stmt->bindParam(':email', $data['email'] ?? null);
                $stmt->bindParam(':address', $data['address'] ?? null);
                $stmt->bindParam(':dateOfBirth', $data['dateOfBirth'] ?? null);
                $stmt->bindParam(':joinDate', $data['joinDate'] ?? date('Y-m-d'));
                
                // Handle image upload
                if ($image) {
                    $imagePath = 'uploads/' . basename($image['name']);
                    move_uploaded_file($image['tmp_name'], $imagePath);
                    $stmt->bindParam(':image', $imagePath);
                } else {
                    $stmt->bindParam(':image', $data['image'] ?? null);
                }
                
                if($stmt->execute()) {
                    echo json_encode(array("id" => $conn->lastInsertId(), "message" => "Student created successfully"));
                } else {
                    echo json_encode(array("error" => "Unable to create student"));
                }
            } catch(PDOException $e) {
                echo json_encode(array("error" => $e->getMessage()));
            }
        } else {
            echo json_encode(array("error" => "Incomplete data. Please provide all required fields"));
        }
        break;
        
    case 'PUT':
        // Update a student
        parse_str(file_get_contents("php://input"), $data);
        $image = $_FILES['image'] ?? null;

        if(!empty($data['id'])) {
            try {
                $query = "UPDATE students SET 
                         name = :name,
                         class = :class,
                         section = :section,
                         rollNumber = :rollNumber,
                         parentName = :parentName,
                         contactNumber = :contactNumber,
                         email = :email,
                         address = :address,
                         dateOfBirth = :dateOfBirth,
                         joinDate = :joinDate,
                         image = :image
                         WHERE id = :id";
                
                $stmt = $conn->prepare($query);
                
                // Bind parameters
                $stmt->bindParam(':id', $data['id']);
                $stmt->bindParam(':name', $data['name']);
                $stmt->bindParam(':class', $data['class']);
                $stmt->bindParam(':section', $data['section']);
                $stmt->bindParam(':rollNumber', $data['rollNumber']);
                $stmt->bindParam(':parentName', $data['parentName']);
                $stmt->bindParam(':contactNumber', $data['contactNumber']);
                $stmt->bindParam(':email', $data['email'] ?? null);
                $stmt->bindParam(':address', $data['address'] ?? null);
                $stmt->bindParam(':dateOfBirth', $data['dateOfBirth'] ?? null);
                $stmt->bindParam(':joinDate', $data['joinDate'] ?? date('Y-m-d'));
                
                // Handle image upload
                if ($image) {
                    $imagePath = 'uploads/' . basename($image['name']);
                    move_uploaded_file($image['tmp_name'], $imagePath);
                    $stmt->bindParam(':image', $imagePath);
                } else {
                    $stmt->bindParam(':image', $data['image'] ?? null);
                }
                
                if($stmt->execute()) {
                    echo json_encode(array("message" => "Student updated successfully"));
                } else {
                    echo json_encode(array("error" => "Unable to update student"));
                }
            } catch(PDOException $e) {
                echo json_encode(array("error" => $e->getMessage()));
            }
        } else {
            echo json_encode(array("error" => "Student ID is required"));
        }
        break;
        
    case 'DELETE':
        // Delete a student
        $data = json_decode(file_get_contents("php://input"));
        
        if(!empty($data->studentId)) {
            try {
                $query = "DELETE FROM students WHERE studentId = :studentId";
                
                $stmt = $conn->prepare($query);
                $stmt->bindParam(':studentId', $data->studentId);
                
                if($stmt->execute()) {
                    echo json_encode(array("message" => "Student deleted successfully"));
                } else {
                    echo json_encode(array("error" => "Unable to delete student"));
                }
            } catch(PDOException $e) {
                echo json_encode(array("error" => $e->getMessage()));
            }
        } else {
            echo json_encode(array("error" => "Student ID is required for deletion"));
        }
        break;
}
?>
