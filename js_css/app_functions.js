// JavaScript Document
var date_options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
var curr_league=0;
var leagues_title = ["premier league","championship","league 1","league 2","conference"];
	var leagues = ["premier","champ","league1","league2","conference"];
$(document).ready(function(e) {
   $("#ajax_loading_screen").css("display","block");
    $("#main_loading_screen").css("display","block");
   
	var mytime = check_time_log();//loading app only get fixtures. //will get tables+season when clicking on them 
	//page dates .toLocaleDateString('en-US', date_options);
	var mydate_header = new Date();
	var mydates = document.getElementsByClassName("mydate_head");
		for (var i = 0; i < mydates.length; i++) {
			mydates[i].innerHTML=mydate_header.toLocaleDateString('en-US', date_options).toUpperCase();
		}
		
	
});

function updated_text_notify(time){
	var updated_text = document.getElementsByClassName("updated_text");
		for (var i = 0; i < updated_text.length; i++) {
			updated_text[i].innerHTML="UPDATED AT: "+time.toString().toUpperCase();
		}
}

function load_in_data_main(league){
	$("#main_loading_screen").css("display","block");
	//document.getElementById("_fixture_data").innerHTML="Loading Fixtures";

	var today = get_today();
	var data_in=document.getElementById("_fixture_data").innerHTML;
	//if equal to p tags then nothing loaded so load in, else already loaded it
	if(data_in=="<p></p>"){
	db.transaction(function (tx) {	
	tx.executeSql(' SELECT * FROM '+league+'_fixtures where Match_Date>"'+today+'" order by Match_Date, Kickoff asc ', [], function(tx, results){
			var len = results.rows.length, i;
			var fixture_date_heading = 0;
			var content = " ";
			for(i=0;i<len;i++){	
				var fixture = results.rows.item(i);
				//console.log(fixture.Match_Date+" "+fixture.Home_Team+" "+fixture.Away_Team+" "+fixture.Kickoff);
				
				
				if(fixture_date_heading!=fixture.Match_Date){
					//output a new heading for date
					var fix_date = new Date(fixture.Match_Date);
					fix_date = fix_date.toLocaleDateString('en-US', date_options);
					content+="<div class='new_date'>"+fix_date.toUpperCase()+"</div>";
					fixture_date_heading = fixture.Match_Date;
				}
					//group all fixtures with same date under one heading
					content+="<span class='fixture'><div class='fixture_home_team'>"+fixture.Home_Team.toUpperCase()+"</div><div class='fixture_time'>"+fixture.Kickoff.substring(0,5)+"</div><div class='fixture_away_team'>"+fixture.Away_Team.toUpperCase()+"</div></span>";
				
			
				
												
			}
			document.getElementById("_fixture_data").innerHTML = content;
			$("#main_loading_screen").css("display","none");
	});
	});
	}else{
		//keep current info on screen.
		//loaded show close loading
		console.log("loaded fixtures already");
		$("#main_loading_screen").css("display","none");
	}
	
		
}


function fixture_list_mainpage(league){
	$( "#fixtures_popup_leagues" ).popup( "close" );
	var show_league=league;
	
	if(show_league == "premier") show_league="PREMIER LEAGUE";
	if(show_league == "champ") show_league="CHAMPIONSHIP";
	if(show_league == "league1") show_league="LEAGUE 1";
	if(show_league == "league2") show_league="LEAGUE 2";
	if(show_league == "conference") show_league="CONFERENCE";
	
	
	
	document.getElementById('fixtures_list_heading').setAttribute("data-leaguename",league);
	document.getElementById('fixtures_list_heading').innerHTML=show_league;
	document.getElementById("_fixture_data").innerHTML="<p></p>";
	load_in_data_main(league);
	
}

function results_setup(league){
	$("#results_loading_screen").css("display","block");
	var data_in = document.getElementById("_results_data").innerHTML;
	
	
	if(data_in=="<p></p>"){
		//load in results for prem
		db.transaction(function (tx) {	
			tx.executeSql(' SELECT * FROM '+league+'_season2015 order by Match_Date asc ', [], function(tx, results){
			var len = results.rows.length, i;
			var fixture_date_heading = 0;
			var content = "";
			for(i=0;i<len;i++){	
				var fixture = results.rows.item(i);
				//console.log(fixture.Match_Date+" "+fixture.Home_Team+" "+fixture.Away_Team+" "+fixture.Kickoff);
				if(fixture_date_heading!=fixture.Match_Date){
					//output a new heading for date
					var fix_date = new Date(fixture.Match_Date);
					fix_date = fix_date.toLocaleDateString('en-US', date_options);
					content+="<div class='new_date'>"+fix_date.toUpperCase()+"</div>";
					fixture_date_heading = fixture.Match_Date;
				}
					//group all fixtures with same date under one heading
					content+="<span class='fixture'><div class='fixture_home_team'>"+fixture.Home_Team.toUpperCase()+"</div><div class='fixture_time'>"+fixture.Home_Goals+" - "+fixture.Away_Goals+"</div><div class='fixture_away_team'>"+fixture.Away_Team.toUpperCase()+"</div></span>";
										
			}
			//add all content to screen
			if(content==""){
				content="<p>No Results Found</p>"
			}
			document.getElementById("_results_data").innerHTML = content;
			$("#results_loading_screen").css("display","none");
	});
	});
	}else{
		//keep data already loaded
		
		$("#results_loading_screen").css("display","none");
	}
	
}



function results_list_mainpage(league){
	
	$( "#results_popup_leagues" ).popup( "close" );
	var show_league=league;
	var sql_league = "premier";
	
	if(show_league == "PREMIER LEAGUE") sql_league="premier";
	if(show_league == "CHAMPIONSHIP") sql_league="champ";
	if(show_league == "LEAGUE 1") sql_league="league1";
	if(show_league == "LEAGUE 2") sql_league="league2";
	if(show_league == "CONFERENCE") sql_league="conference";
	
	
	document.getElementById('results_list_heading').innerHTML=show_league;
	//reset the data
	document.getElementById("_results_data").innerHTML="<p></p>";
	 results_setup(sql_league);
	
}


function load_league_table(league){
	$("#tables_loading_screen").css("display","block");
	var data_in = document.getElementById("_tables_data").innerHTML;
	
	if(data_in=="<p></p>"){
		//load league table
		//table headers
		var content = "<div class='clear_line'> <div class='_table_header_l'>POINTS</div><div class='_table_header'>GD</div><div class='_table_header'>L</div><div class='_table_header'>D</div><div class='_table_header'>W</div> <div class='_table_header'>P</div></div>";
		
		db.transaction(function (tx) {	
			tx.executeSql(' SELECT * FROM '+league+'_leaguetable order by Position asc ', [], function(tx, results){
			var len = results.rows.length, i;
			var fixture_date_heading = 0;
			for(i=0;i<len;i++){	
				var fixture = results.rows.item(i);
				//console.log(fixture.Match_Date+" "+fixture.Home_Team+" "+fixture.Away_Team+" "+fixture.Kickoff);
				//group all fixtures with same date under one heading
				content+="<div class='table_row_team'>"+
      			"<div class='table_team_pos'>"+fixture.Position+"</div>"+
	  			"<div class='table_team_name'>"+fixture.Team.toUpperCase()+"</div>"+
				"<div class='table_team_played'>"+fixture.Played+"</div>"+
				"<div class='table_team_won'>"+fixture.Won+"</div>"+
   				"<div class='table_team_drawn'>"+fixture.Drawn+"</div>"+
    			"<div class='table_team_lost'>"+fixture.Lost+"</div>"+
				"<div class='table_team_GD'>"+fixture.GD+"</div>"+
	 			"<div class='table_team_points'>"+fixture.Points+"</div>"+
      			"</div>";
				
										
			}
			//add all content to screen
			document.getElementById("_tables_data").innerHTML = content;
			$("#tables_loading_screen").css("display","none");
	});
	});
	}else{
		//already loaded	
		$("#tables_loading_screen").css("display","none");
	}
	
}

function tables_list_mainpage(league){
	
	var show_league=league;
	var sql_league = "premier";
	
	if(show_league == "PREMIER LEAGUE") sql_league="premier";
	if(show_league == "CHAMPIONSHIP") sql_league="champ";
	if(show_league == "LEAGUE 1") sql_league="league1";
	if(show_league == "LEAGUE 2") sql_league="league2";
	if(show_league == "CONFERENCE") sql_league="conference";
	
	
	
	document.getElementById('tables_list_heading').innerHTML=show_league;
	$( "#tables_popup_leagues" ).popup( "close" );
	document.getElementById("_tables_data").innerHTML="<p></p>";
	load_league_table(sql_league);
}



function teams_setup(){
	var data_in = document.getElementById("_teams_data").innerHTML;
	
	if(data_in==""){
		$("#teams_loading_screen").css("display","block");
		//no data get data

		var content="";
	
	db.transaction(function (tx) {	
	//reset curr league to 0
		curr_league=0;

		for(var x = 0; x<leagues.length; x++){
		
		tx.executeSql(' SELECT * FROM '+leagues[x]+'_leaguetable order by Team asc ', [], function(tx, results){
			var league_title = leagues_title[curr_league];
			var league_sql = leagues[curr_league];
			curr_league++;
			var len = results.rows.length, i;
			//console.log("len is: "+len);
			content+="<div class='prediction_box'><div class='prediction_heading'>"+league_title.toUpperCase()+"</div><div class='prediction_title'></div>";
			var half_mark = len/2;
			for(i=0;i<len;i++){	
				if(i==0){
					content+="<div class='team_side_left'>";
				}
				if(i==half_mark){
					content+="</div><div class='team_side_right'>";
				}
				
				var team = results.rows.item(i);
				var data="<div onClick=\"team_selected('"+team.Team+"','"+league_sql+"')\" class='team_name'>"+team.Team.toUpperCase()+"</div>";
				content+=data;
			}
			
			
			
			content+="</div></div>";//close prediction box and right side
			document.getElementById("_teams_data").innerHTML += content;
			content="";//reset content
		
		
		});
		}
		$("#teams_loading_screen").css("display","none");
		});

	}else{
		//already loaded leave as
	}
}

function backtoteams(){
	$( ":mobile-pagecontainer" ).pagecontainer( "change", "#teams_page", { transition: "slide" } );
}

function team_selected(team,league){
	console.log("selected "+team+" "+league);
	$( ":mobile-pagecontainer" ).pagecontainer( "change", "#stats_team", { transition: "slide" } );
	
	document.getElementById("_stats_data").innerHTML="";
	document.getElementById("team_name_heading").setAttribute("sqlteam",team);
	document.getElementById("team_name_heading").textContent=team.toUpperCase();
	$("#team_fixtures_head").addClass("underline_text");
	$("#team_results_head").removeClass("underline_text");
	
	document.getElementById("team_name_heading").setAttribute("sqlleague",league);
	
	$("#teamstats_loading_screen").css("display","block");
		//no data get data

		var content="";
	
	db.transaction(function (tx) {	

		tx.executeSql(' SELECT * FROM '+league+'_fixtures where Home_Team="'+team+'" or Away_Team="'+team+'" order by Match_Date asc ', [], function(tx, results){
			var len = results.rows.length, i;
			var hometeam_highlight = "highlight_team";
			var awayteam_highlight = "highlight_team";
			for(i=0;i<len;i++){	
				var fixture = results.rows.item(i);
				
				var fix_date = new Date(fixture.Match_Date);
				fix_date = fix_date.toLocaleDateString('en-US', date_options);
				
				if(fixture.Home_Team==team){
					hometeam_highlight = "highlight_team";
					awayteam_highlight = "";
				}
				if(fixture.Away_Team==team){
					awayteam_highlight = "highlight_team";
					hometeam_highlight = "";
				}
				
				var data="<div class='new_date'>"+fix_date.toUpperCase()+"</div>";
				data+="<span class='fixture'><div class='fixture_home_team "+hometeam_highlight+"'>"+fixture.Home_Team.toUpperCase()+"</div><div class='fixture_time'>"+fixture.Kickoff.substring(0,5)+"</div><div class='fixture_away_team "+awayteam_highlight+"'>"+fixture.Away_Team.toUpperCase()+"</div></span>";
				content+=data;
			}
			
			document.getElementById("_stats_data").innerHTML += content;
			content="";//reset content
		
		
		});
		
		$("#teamstats_loading_screen").css("display","none");
		});


}

function team_selected_get_results(team, league){

	console.log("selected "+team+" "+league);
	
	document.getElementById("_stats_data").innerHTML="";
	
	$("#teamstats_loading_screen").css("display","block");
		//no data get data

		var content="";
	
	db.transaction(function (tx) {	

		tx.executeSql(' SELECT * FROM '+league+'_season2015 where Home_Team="'+team+'" or Away_Team="'+team+'" order by Match_Date asc ', [], function(tx, results){
			
			var len = results.rows.length, i;
			var hometeam_highlight = "highlight_team";
			var awayteam_highlight = "highlight_team";
			var highlight_fixture = "highlight_loss";
			
			for(i=0;i<len;i++){	
				var fixture = results.rows.item(i);
				
				var fix_date = new Date(fixture.Match_Date);
				fix_date = fix_date.toLocaleDateString('en-US', date_options);
				
				if(fixture.Home_Team==team){
					hometeam_highlight = "highlight_team";
					awayteam_highlight = "";
					if(fixture.Home_Goals>fixture.Away_Goals){
						 highlight_fixture = "highlight_win";
					}
					if(fixture.Home_Goals==fixture.Away_Goals){
						highlight_fixture = "";//no css class
					}
					if(fixture.Home_Goals<fixture.Away_Goals){
						 highlight_fixture = "highlight_loss";
					}
				}
				if(fixture.Away_Team==team){
					awayteam_highlight = "highlight_team";
					hometeam_highlight = "";
					if(fixture.Away_Goals>fixture.Home_Goals){
						 highlight_fixture = "highlight_win";
					}
					if(fixture.Away_Goals==fixture.Home_Goals){
						highlight_fixture = "";//no css class
					}
					if(fixture.Away_Goals<fixture.Home_Goals){
						 highlight_fixture = "highlight_loss";
					}
				}
				
				var data="<div class='new_date'>"+fix_date.toUpperCase()+"</div>";
				data+="<span class='fixture'><div class='fixture_home_team "+hometeam_highlight+"'>"+fixture.Home_Team.toUpperCase()+"</div><div class='fixture_time "+highlight_fixture+"'>"+fixture.Home_Goals+" - "+fixture.Away_Goals+"</div><div class='fixture_away_team "+awayteam_highlight+"'>"+fixture.Away_Team.toUpperCase()+"</div></span>";
				content+=data;
			}
			
			document.getElementById("_stats_data").innerHTML += content;
			content="";//reset content
		
		
		});
		
		$("#teamstats_loading_screen").css("display","none");
		});

	
	
	
}


function show_results_team(){
	
	if($("#team_results_head").hasClass("underline_text")){
		console.log("already have that class");
	}else{
		console.log("load in results now");
		$("#team_results_head").addClass("underline_text");
		$("#team_fixtures_head").removeClass("underline_text");
		var league = document.getElementById("team_name_heading").getAttribute("sqlleague");
		var team = document.getElementById("team_name_heading").getAttribute("sqlteam");
		team_selected_get_results(team,league);
	}
	
	
	var team = document.getElementById("team_name_heading").textContent;
}
function show_fixtures_team(){
	if($("#team_fixtures_head").hasClass("underline_text")){
		console.log("already have that class");
	}else{
		console.log("load in fixtures now");
		$("#team_fixtures_head").addClass("underline_text");
		$("#team_results_head").removeClass("underline_text");
		var league = document.getElementById("team_name_heading").getAttribute("sqlleague");
		var team = document.getElementById("team_name_heading").getAttribute("sqlteam");
		team_selected(team,league);
	}

}

function prediction_setup(){
	var data_in = document.getElementById("_prediction_data").innerHTML;
	//console.log(data_in);
	if(data_in==""){
	document.getElementById("_prediction_data").innerHTML= "";
	$("#prediction_loading_screen").css("display","block");
	
	var content="";
	
	db.transaction(function (tx) {	
	
		curr_league=0;
		
		
		var today = get_today();
		
		for(var x = 0; x<leagues.length; x++){
		
		tx.executeSql(' SELECT * FROM '+leagues[x]+'_fixtures where Match_Date="'+today+'" order by Kickoff asc ', [], function(tx, results){
			var league_title = leagues_title[curr_league];
			curr_league++;
			var len = results.rows.length, i;
			
			if(len>0){
				content += "<div class='prediction_box'><div class='prediction_heading'>"+league_title.toUpperCase()+"</div><div class='prediction_title'>PREDICTION</div>";
			}
			
			for(i=0;i<len;i++){	
				var fixture = results.rows.item(i);
				if(fixture.p_h_goals===null) fixture.p_h_goals = " ";
				if(fixture.p_a_goals===null) fixture.p_a_goals = " ";
				var data = "<span class='fixture'><div class='fixture_home_team'>"+fixture.Home_Team+"</div><div class='fixture_time'>"+fixture.p_h_goals+" - "+fixture.p_a_goals+"</div><div class='fixture_away_team'>"+fixture.Away_Team+"</div></span>";
				content+=data;
			}
			
			
			
			content+="</div>";//close prediction box.
		document.getElementById("_prediction_data").innerHTML += content;
		content="";//reset content
		
		if(curr_league==5){
			// counter gets +1 after conference above
			//console.log(league_title);
			//if been thru all leagues and no data on screen no fixtures
			if(document.getElementById("_prediction_data").innerHTML==""){
				document.getElementById("_prediction_data").innerHTML="No Fixtures Today. Predictions Are Available After 9am On Match Days.";
			}
		}
			
		});
		
		
		}
		
		
		$("#prediction_loading_screen").css("display","none");
	});
			
	
	
	}//else already have processed the page
	
	
	
}

function get_today(){
	var d = new Date();
	var year = d.getFullYear();
	var month = d.getMonth()+1;
	var day = d.getDate();
	if(month.toString().length==1){
		month = "0"+month;
	}
	if(day.toString().length==1){
		day = "0"+day;
	}
	var today = ""+year+"-"+month+"-"+day+"";
	//console.log("today is "+today);
	return today;
}

function refresh_data(){
	//send user back to home page for clean reload of app data
	$( ":mobile-pagecontainer" ).pagecontainer( "change", "#fixtures_page", { transition: "slide" } );
	$("#fixture_menu_panel").panel("close");
	$("#main_loading_screen").css("display","block");
	$("#ajax_loading_screen").css("display","block");
	setTimeout(function(){ 
	document.getElementById("_prediction_data").innerHTML="";
	document.getElementById("_fixture_data").innerHTML="<p></p>";
	document.getElementById("_results_data").innerHTML="<p></p>";
	document.getElementById("_tables_data").innerHTML="<p></p>";
	document.getElementById('tables_list_heading').innerHTML="PREMIER LEAGUE";
	document.getElementById("results_list_heading").innerHTML="PREMIER LEAGUE";
	db.transaction(function (tx) {	
			tx.executeSql('UPDATE time_log SET data_time="Sat Jul 04 2015 15:27:31 GMT+0100 (GMT Daylight Time)" WHERE tid=1');
			var mytime = check_time_log();
	});
	}, 1500);
	//also make predictions page blank
	
}

function panel_change_page(page){
	console.log("goto "+page);
	//$("#menu_panel").panel("close");
//	$.mobile.navigate( "#"+page+"_page" );
	$( ":mobile-pagecontainer" ).pagecontainer( "change", "#"+page+"_page", { transition: "slide" } );
	if(page=="prediction"){
		prediction_setup();
	}
	if(page=="fixtures"){
		//fixtures page is only page loaded on app start so no need to reload it.
	}
	if(page=="teams"){
		teams_setup();
	}
	if(page=="results"){
		//send over prem for initial load
		results_setup('premier');
	}
	if(page=="tables"){
		//send over for inital load
		load_league_table('premier');
	}
	
}
