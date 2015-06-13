<?php

$conn=mysqli_connect("198.71.225.51","kt22","Fatfish22","kevinteal22_WolfStudioApps");

// Check connection
if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

//output league table
$league_table = $_GET["league"];
$array_league = array();
$league_table = $league_table."_season2014";
//echo $league_table;
$sql = "SELECT * FROM $league_table order by date DESC";
$result = $conn->query($sql);
while($row = $result->fetch_assoc()) {	
	$arr = array('Home_Team' => $row["Home_Team"], 'Away_Team'=>$row["Away_Team"], 'Home_Goals'=>$row["Home_Goals"],'Away_Goals'=>$row["Away_Goals"],'date'=>$row["Date"]);
	array_push($array_league,$arr);
}

echo json_encode($array_league);

?>