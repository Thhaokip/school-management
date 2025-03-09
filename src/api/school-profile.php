
<?php
require_once 'config.php';

// Set content type to JSON
header('Content-Type: application/json');

// Handle different HTTP methods
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        // Get school profile
        try {
            $stmt = $conn->prepare("SELECT * FROM school_profile LIMIT 1");
            $stmt->execute();
            $profile = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if($profile) {
                echo json_encode($profile);
            } else {
                echo json_encode(array("message" => "No school profile found"));
            }
        } catch(PDOException $e) {
            echo json_encode(array("error" => $e->getMessage()));
        }
        break;
        
    case 'POST':
        // Create or update school profile
        $data = json_decode(file_get_contents("php://input"), true);
        
        if(
            !empty($data['name']) &&
            !empty($data['address']) &&
            !empty($data['city']) &&
            !empty($data['state']) &&
            !empty($data['zipCode']) &&
            !empty($data['phone']) &&
            !empty($data['email'])
        ) {
            try {
                // Check if profile exists
                $checkStmt = $conn->prepare("SELECT COUNT(*) FROM school_profile");
                $checkStmt->execute();
                $count = $checkStmt->fetchColumn();
                
                if($count > 0) {
                    // Update existing profile
                    $query = "UPDATE school_profile SET 
                             name = :name,
                             address = :address,
                             city = :city,
                             state = :state,
                             zipCode = :zipCode,
                             phone = :phone,
                             email = :email,
                             website = :website,
                             logo = :logo,
                             established = :established,
                             description = :description";
                } else {
                    // Create new profile
                    $query = "INSERT INTO school_profile
                             (name, address, city, state, zipCode, phone, email, website, logo, established, description)
                             VALUES
                             (:name, :address, :city, :state, :zipCode, :phone, :email, :website, :logo, :established, :description)";
                }
                
                $stmt = $conn->prepare($query);
                
                // Using bindValue instead of bindParam to avoid passing by reference issues
                $stmt->bindValue(':name', $data['name']);
                $stmt->bindValue(':address', $data['address']);
                $stmt->bindValue(':city', $data['city']);
                $stmt->bindValue(':state', $data['state']);
                $stmt->bindValue(':zipCode', $data['zipCode']);
                $stmt->bindValue(':phone', $data['phone']);
                $stmt->bindValue(':email', $data['email']);
                $stmt->bindValue(':website', isset($data['website']) ? $data['website'] : null);
                $stmt->bindValue(':logo', isset($data['logo']) ? $data['logo'] : null);
                $stmt->bindValue(':established', isset($data['established']) ? $data['established'] : null);
                $stmt->bindValue(':description', isset($data['description']) ? $data['description'] : null);
                
                if($stmt->execute()) {
                    echo json_encode(array("message" => "School profile saved successfully"));
                } else {
                    echo json_encode(array("error" => "Unable to save school profile"));
                }
            } catch(PDOException $e) {
                echo json_encode(array("error" => $e->getMessage()));
            }
        } else {
            echo json_encode(array("error" => "Incomplete data. Please provide all required fields"));
        }
        break;
    default:
        echo json_encode(array("error" => "Method not allowed"));
        break;
}
?>
