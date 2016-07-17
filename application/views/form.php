<?php

// Author - Neel Kirit
// 11 May 2016
// Zomato API System
// Code to post scores to Database

if (is_ajax())
	{
	$dec = json_decode(file_get_contents("php://input"));
	$category = $dec->
		{
		'cat'};
		switch ($category)
			{
		case "zomato":
			zomato_function();
			break;
			}
		}

	// Function to check if the request is an AJAX request
	function is_ajax()
		{
		return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
		}

	//	Function to insert values into Zomato Table
	function zomato_function()
		{
		$return = $_POST;
		$dec = json_decode(file_get_contents("php://input"));
		//	Assign Constants
		$host = "localhost";
		$user = "root";
		$password = "";
		$database = "zomato";
		$conn = mysqli_connect($host, $user, $password, $database);
		if (!$conn)
			{
			die("Connection failed: " . mysqli_connect_error());
			}
		else
			{
			echo "DB Connected";
			}
		//	Exract Values from JSON Object
		$res_name = $dec->{'res_name'};
		$food = $dec->{'food'};
		$service = $dec->{'service'};
		$ambience = $dec->{'ambience'};
		$infra = $dec->{'infra'};
		$drinks = $dec->{'drinks'};
		echo $res_name;
		//	Assign SQL query to variable
		$sql = "insert into zomato_scores(res_name,food,service,ambience,infra,drinks) values('$res_name','$food','$service','$ambience','$infra','$drinks')";
		//	Execute the query
		if (mysqli_query($conn, $sql))
		{
			error_log("New record created successfully");
		}
		else
		{
			error_log(mysqli_error($conn));;
		}
		//	IMPORTANT: Close DB Connection
		mysqli_close($conn);
		//	Return 200OK
		$return["json"] = json_encode($return);
		echo json_encode($dec);
	}

?>