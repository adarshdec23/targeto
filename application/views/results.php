
<?php
// Author - Neel Kirit
// 11 May 2016
// Zomato API System
// Code to post scores to Database


if (is_ajax()) {
  if (isset($_POST["action"]) && !empty($_POST["action"])) { //Checks if action value exists
  
    $action = $_POST["action"];
 
    switch($action) { //Switch case for value of action
     case "zomato": test_function(); break;
     case "trip": trip_function(); break;
    }
  }
}
//Function to check if the request is an AJAX request
function is_ajax() {
  return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
}
function test_function(){
  $return = $_POST;
  $q1=0;
  $host="localhost";
  $user="root";
  $password="";
  $database="zomato";
  $conn=mysqli_connect($host,$user,$password,$database);
  if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
  }
  else{
    // echo "DB Connected";
  }

  $sql = "SELECT distinct res_name FROM zomato_final where id<1800";

  $result = $conn->query($sql);
  if (mysqli_num_rows($result) > 0) {
      $temp = array();
      $i=0;
      while ($row = $result->fetch_assoc()) {
        $temp[$i]=$row;
        $i = $i + 1;
      }
      echo json_encode($temp);
  } else {
      echo "0 results";
  }

}
?>