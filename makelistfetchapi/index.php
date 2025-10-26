<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  http_response_code(200);
  exit();
}

$conn = new mysqli("localhost", "root", "", "api_data");

if ($conn->connect_error) {
  die(json_encode(["error" => "Database connection failed"]));
}

$method = $_SERVER['REQUEST_METHOD'];

// GET
if ($method == "GET") {
  $result = $conn->query("SELECT * FROM data");
  $data = [];
  while ($row = $result->fetch_assoc()) {
    $data[] = $row;
  }
  echo json_encode($data);
}

// POST
elseif ($method == "POST") {
  $input = json_decode(file_get_contents("php://input"), true);
  $name = $input['name'];
  $email = $input['email'];
  $salary = $input['salary'];
  $date = $input['date'];

  $sql = "INSERT INTO data (name, email, salary, date) VALUES ('$name','$email','$salary','$date')";
  if ($conn->query($sql)) {
    echo json_encode(["status" => true, "message" => "Added successfully"]);
  } else {
    echo json_encode(["status" => false, "message" => "Failed to add user: " . $conn->error]);
  }
}

// PUT
elseif ($method == "PUT") {
  $input = json_decode(file_get_contents("php://input"), true);
  $name = $input['name'];
  $email = $input['email'];
  $salary = $input['salary'];
  $date = $input['date'];

  $sql = "UPDATE data SET name='$name', salary='$salary', date='$date' WHERE email='$email'";
  if ($conn->query($sql)) {
    echo json_encode(["status" => true, "message" => "User updated"]);
  } else {
    echo json_encode(["status" => false, "message" => "Failed to update"]);
  }
}

// DELETE
elseif ($method == "DELETE") {
  parse_str($_SERVER['QUERY_STRING'], $params);
  $email = $params['email'];

  $sql = "DELETE FROM data WHERE email='$email'";
  if ($conn->query($sql)) {
    echo json_encode(["status" => true, "message" => "User deleted"]);
  } else {
    echo json_encode(["status" => false, "message" => "Failed to delete"]);
  }
}

$conn->close();
?>
