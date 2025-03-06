
<?php
require_once 'config.php';

// Handle different HTTP methods
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        // Get all payments
        try {
            $stmt = $conn->prepare("
                SELECT p.*, s.name as studentName, s.studentId as studentCode,
                       f.name as feeHeadName, a.name as accountantName
                FROM fee_payments p
                LEFT JOIN students s ON p.studentId = s.id
                LEFT JOIN fee_heads f ON p.feeHeadId = f.id
                LEFT JOIN accountants a ON p.accountantId = a.id
                ORDER BY p.paidDate DESC
            ");
            $stmt->execute();
            $payments = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode($payments);
        } catch(PDOException $e) {
            echo json_encode(array("error" => $e->getMessage()));
        }
        break;
        
    case 'POST':
        // Add a new payment
        $data = json_decode(file_get_contents("php://input"));
        
        if(
            !empty($data->studentId) &&
            !empty($data->feeHeadId) &&
            !empty($data->amount) &&
            !empty($data->academicSessionId) &&
            !empty($data->paymentMethod)
        ) {
            try {
                // Generate receipt number
                $yearPrefix = date('y');
                
                // Get the last receipt number to increment
                $lastReceiptStmt = $conn->prepare("
                    SELECT receiptNumber FROM fee_payments 
                    WHERE receiptNumber LIKE 'RCPT-$yearPrefix-%' 
                    ORDER BY id DESC LIMIT 1
                ");
                $lastReceiptStmt->execute();
                $lastReceipt = $lastReceiptStmt->fetch(PDO::FETCH_ASSOC);
                
                if ($lastReceipt) {
                    $lastNumber = intval(substr($lastReceipt['receiptNumber'], -4));
                    $nextNumber = $lastNumber + 1;
                } else {
                    $nextNumber = 1;
                }
                
                $receiptNumber = 'RCPT-' . $yearPrefix . '-' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
                
                // Insert the payment
                $query = "INSERT INTO fee_payments
                          (studentId, feeHeadId, amount, paidDate, academicSessionId, 
                           month, receiptNumber, paymentMethod, accountantId, status)
                          VALUES (:studentId, :feeHeadId, :amount, NOW(), :academicSessionId, 
                                 :month, :receiptNumber, :paymentMethod, :accountantId, :status)";
                
                $stmt = $conn->prepare($query);
                
                // Bind parameters
                $stmt->bindParam(':studentId', $data->studentId);
                $stmt->bindParam(':feeHeadId', $data->feeHeadId);
                $stmt->bindParam(':amount', $data->amount);
                $stmt->bindParam(':academicSessionId', $data->academicSessionId);
                $stmt->bindParam(':month', $data->month ?? null);
                $stmt->bindParam(':receiptNumber', $receiptNumber);
                $stmt->bindParam(':paymentMethod', $data->paymentMethod);
                $stmt->bindParam(':accountantId', $data->accountantId);
                $status = $data->status ?? 'paid';
                $stmt->bindParam(':status', $status);
                
                if($stmt->execute()) {
                    // Get the payment with related data for the response
                    $paymentId = $conn->lastInsertId();
                    $getPaymentStmt = $conn->prepare("
                        SELECT p.*, s.name as studentName, s.studentId as studentCode,
                               f.name as feeHeadName, a.name as accountantName
                        FROM fee_payments p
                        LEFT JOIN students s ON p.studentId = s.id
                        LEFT JOIN fee_heads f ON p.feeHeadId = f.id
                        LEFT JOIN accountants a ON p.accountantId = a.id
                        WHERE p.id = :id
                    ");
                    $getPaymentStmt->bindParam(':id', $paymentId);
                    $getPaymentStmt->execute();
                    $payment = $getPaymentStmt->fetch(PDO::FETCH_ASSOC);
                    
                    echo json_encode(array(
                        "payment" => $payment,
                        "message" => "Payment recorded successfully"
                    ));
                } else {
                    echo json_encode(array("error" => "Unable to record payment"));
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
