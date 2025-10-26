<?php

// 00000000000000 MySQL. 000000000

// header("Access-Control-Allow-Origin: *");
// header("Content-Type: application/json; charset=UTF-8");
// header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
//   http_response_code(200);
//   exit();
// }

// $conn = new mysqli("localhost", "root", "", "api_data");

// if ($conn->connect_error) {
//   die(json_encode(["error" => "Database connection failed"]));
// }

// $method = $_SERVER['REQUEST_METHOD'];

// // GET
// if ($method == "GET") {
//   $result = $conn->query("SELECT * FROM data");
//   $data = [];
//   while ($row = $result->fetch_assoc()) {
//     $data[] = $row;
//   }
//   echo json_encode($data);
// }

// // POST
// elseif ($method == "POST") {
//   $input = json_decode(file_get_contents("php://input"), true);
//   $name = $input['name'];
//   $email = $input['email'];
//   $salary = $input['salary'];
//   $date = $input['date'];

//   $sql = "INSERT INTO data (name, email, salary, date) VALUES ('$name','$email','$salary','$date')";
//   if ($conn->query($sql)) {
//     echo json_encode(["status" => true, "message" => "Added successfully"]);
//   } else {
//     echo json_encode(["status" => false, "message" => "Failed to add user: " . $conn->error]);
//   }
// }

// // PUT
// elseif ($method == "PUT") {
//   $input = json_decode(file_get_contents("php://input"), true);
//   $name = $input['name'];
//   $email = $input['email'];
//   $salary = $input['salary'];
//   $date = $input['date'];

//   $sql = "UPDATE data SET name='$name', salary='$salary', date='$date' WHERE email='$email'";
//   if ($conn->query($sql)) {
//     echo json_encode(["status" => true, "message" => "User updated"]);
//   } else {
//     echo json_encode(["status" => false, "message" => "Failed to update"]);
//   }
// }

// // DELETE
// elseif ($method == "DELETE") {
//   parse_str($_SERVER['QUERY_STRING'], $params);
//   $email = $params['email'];

//   $sql = "DELETE FROM data WHERE email='$email'";
//   if ($conn->query($sql)) {
//     echo json_encode(["status" => true, "message" => "User deleted"]);
//   } else {
//     echo json_encode(["status" => false, "message" => "Failed to delete"]);
//   }
// }

// $conn->close();








// 23456783456789 ((((    PDO    ))))  **************



header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  http_response_code(200);
  exit();
}

// PDO connection

try {
  $pdo = new PDO("mysql:host=localhost;dbname=api_data;charset=utf8mb4", "root", "");
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}
catch (PDOException $e) {
  die(json_encode(["error" => "Database connection failed: " . $e->getMessage()]));
}

$method = $_SERVER['REQUEST_METHOD'];



// get

if ($method == "GET") {
    $stmt = $pdo->query("SELECT * FROM data");
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);
}

// post

elseif ($method == "POST") {
    $input = json_decode(file_get_contents("php://input"), true);

    $stmt = $pdo->prepare("INSERT INTO data (name, email, salary, date) VALUES (:name, :email, :salary, :date)");
    $result = $stmt->execute([
        ':name' => $input['name'],
        ':email' => $input['email'],
        ':salary' => $input['salary'],
        ':date' => $input['date']
    ]);

    echo json_encode(["status" => $result, "message" => $result ? "Added successfully" : "Failed to add user"]);
}


// put

elseif ($method == "PUT") {
    $input = json_decode(file_get_contents("php://input"), true);

    $stmt = $pdo->prepare("UPDATE data SET name=:name, salary=:salary, date=:date WHERE email=:email");
    $result = $stmt->execute([
        ':name' => $input['name'],
        ':salary' => $input['salary'],
        ':date' => $input['date'],
        ':email' => $input['email']
    ]);

    echo json_encode(["status" => $result, "message" => $result ? "User updated" : "Failed to update"]);
}

// delete

elseif ($method == "DELETE") {
    parse_str($_SERVER['QUERY_STRING'], $params);

    $stmt = $pdo->prepare("DELETE FROM data WHERE email=:email");
    $result = $stmt->execute([':email' => $params['email']]);

    echo json_encode(["status" => $result, "message" => $result ? "User deleted" : "Failed to delete"]);
}
?>
