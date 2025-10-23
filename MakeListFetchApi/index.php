
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


// get

if ($method == "GET") {
    $result = $conn->query("SELECT * FROM users");
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
}

// post 

elseif ($method == "POST") {

    $input = json_decode(file_get_contents("php://input"), true);
    $name = $input['name'];
    $email = $input['email'];
    $id = $input['id'];
    $salary = $input['salary'];
    $date = $input['date'];

    $sql = "INSERT INTO users (id, name, email, salary, date) VALUES ('$id','$name','$email','$salary','$date')";
    if ($conn->query($sql)) {
        echo json_encode(["status" => true, "message" => "User added successfully"]);
    } else {
        echo json_encode(["status" => false, "message" => "Failed to add user: " . $conn->error]);
    }
}


// put

elseif ($method == "PUT") {
    $input = json_decode(file_get_contents("php://input"), true);
    $id = $input['id'];
    $name = $input['name'];
    $email = $input['email'];
    $salary = $input['salary'];
    $date = $input['date'];

    $sql = "UPDATE users SET name='$name', email='$email', salary='$salary', date='$date' WHERE id='$id'";
    if ($conn->query($sql)) {
        echo json_encode(["status" => true, "message" => "User updated"]);
    } else {
        echo json_encode(["status" => false, "message" => "Failed to update"]);
    }
}

// detele

elseif ($method == "DELETE") {
    parse_str($_SERVER['QUERY_STRING'], $params);
    $id = $params['id'];

    $sql = "DELETE FROM users WHERE id='$id'";
    if ($conn->query($sql)) {
        echo json_encode(["status" => true, "message" => "User deleted"]);
    } else {
        echo json_encode(["status" => false, "message" => "Failed to delete"]);
    }
}

$conn->close();


if ($method == "TEST") {
    $sql = "INSERT INTO users (id, name, email, salary, `date`) VALUES (999, 'TestUser', 'test@mail.com', 50000, '2025-10-23')";
    if ($conn->query($sql)) {
        echo "Manual insert success!";
    } else {
        echo "Manual insert failed: " . $conn->error;
    }
}


