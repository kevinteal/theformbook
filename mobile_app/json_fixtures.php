<?php

$conn=mysqli_connect("198.71.225.51","kt22","Fatfish22","kevinteal22_WolfStudioApps");

// Check connection
if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

//output league table
$league_table = $_GET["league"];
$array_league = array();
$league_table = $league_table."_fixtures";
//echo $league_table;
$sql = "SELECT * FROM $league_table order by date ASC, Kickoff ASC";
$result = $conn->query($sql);
while($row = $result->fetch_assoc()) {	
	$arr = array('date' => $row["Date"], 'Home_Team' => $row["Home_Team"], 'Away_Team'=>$row["Away_Team"], 'Kickoff'=>$row["Kickoff"], 'p_h_goals'=>$row["p_h_goals"], 'p_a_goals'=>$row["p_a_goals"]);
	array_push($array_league,$arr);
}

echo json_encode($array_league);

?>