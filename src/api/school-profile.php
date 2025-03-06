
<?php
require_once 'config.php';

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
        // Create school profile
        $data = json_decode(file_get_contents("php://input"));
        
        if(
            !empty($data->name) &&
            !empty($data->address) &&
            !empty($data->city) &&
            !empty($data->state) &&
            !empty($data->zipCode) &&
            !empty($data->phone) &&
            !empty($data->email)
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
                
                // Bind parameters
                $stmt->bindParam(':name', $data->name);
                $stmt->bindParam(':address', $data->address);
                $stmt->bindParam(':city', $data->city);
                $stmt->bindParam(':state', $data->state);
                $stmt->bindParam(':zipCode', $data->zipCode);
                $stmt->bindParam(':phone', $data->phone);
                $stmt->bindParam(':email', $data->email);
                $stmt->bindParam(':website', $data->website ?? null);
                $stmt->bindParam(':logo', $data->logo ?? null);
                $stmt->bindParam(':established', $data->established ?? null);
                $stmt->bindParam(':description', $data->description ?? null);
                
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
}
?>
