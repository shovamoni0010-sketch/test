
<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$connection = new mysqli("localhost", "root", "", "demo_project");

$method = $_SERVER['REQUEST_METHOD'];

if($method == 'GET'){
    $sql = "SELECT * FROM users";
    $result = $connection->query($sql);

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode($data);
}elseif($method == 'POST'){
    $input = json_decode(file_get_contents("php://input"), true);
    $name = $input['name'];
    $email = $input['email'];
    $id = $input['id'];
    $salary = $input['salary'];
    $date = $input['date'];

    $sql = "INSERT INTO users (name,email,id,salary,date) VALUES ('$name', '$email', '$id', '$salary', '$date')";
    $result = $connection->query($sql);
    if($result){
        echo json_encode(['status' => true]);
    }else{
        echo json_encode(['status' => false]);
    }
    
}