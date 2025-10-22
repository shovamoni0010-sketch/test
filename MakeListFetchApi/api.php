<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

$con = mysqli_connect("localhost", "root", "", "api_data");
$response = array();

if ($con) {
    $sql = "SELECT * FROM data";
    $result = mysqli_query($con,$sql);

    if ($result) {
        header("Content-Type: application/JSON");
        $i = 0;
        while ($row = mysqli_fetch_assoc($result)) {    
            $response[$i]['name'] = $row['name'];
            $response[$i]['email'] = $row['email'];
            $response[$i]['id'] = $row['id'];
            $response[$i]['salary'] = $row['salary'];
            $response[$i]['date'] = $row['date'];
            $i++;
        }
        echo json_encode($response, JSON_PRETTY_PRINT);
    } else {
        echo "Query failed: " . mysqli_error($con);
    }
} else {
    echo "Database connection failed: " . mysqli_connect_error();
}
?>