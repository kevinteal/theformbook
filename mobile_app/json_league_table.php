<?php

$conn=mysqli_connect("198.71.225.51","kt22","Fatfish22","kevinteal22_WolfStudioApps");

// Check connection
if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

//output league table
$league_table = $_GET["league"];
$array_league = array();
$league_table = $league_table."_leaguetable";
//echo $league_table;
$sql = "SELECT * FROM $league_table order by Position ASC";
$result = $conn->query($sql);
while($row = $result->fetch_assoc()) {
	$arr = array('Team' => $row["Team"], 'Position' => $row["Position"],'Played'=>$row["Played"],'Won'=>$row["Won"],'Drawn'=>$row["Drawn"],'Lost'=>$row["Lost"],'Points'=>$row["Points"]);
	array_push($array_league,$arr);
}

echo json_encode($array_league);

?>