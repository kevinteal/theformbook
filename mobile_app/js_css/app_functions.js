// JavaScript Document
var date_options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
$(document).ready(function(e) {
   $(".loading_the_data").css("display","block");
    $.ajaxSetup({
        async: false
    });
	var mytime = check_time_log();
	
	//page dates .toLocaleDateString('en-US', date_options);
	var mydate_header = new Date();
	document.getElementsByClassName("mydate_head").innerHTML="helo";
	var mydates = document.getElementsByClassName("mydate_head");
		for (var i = 0; i < mydates.length; i++) {
			mydates[i].innerHTML=mydate_header.toLocaleDateString('en-US', date_options).toUpperCase();
		}
	
});

function load_in_data_main(league){
	$(".loading_the_data").css("display","block");
	//document.getElementById("_fixture_data").innerHTML="Loading Fixtures";
	
	var d = new Date();
	var year = d.getFullYear();
	var month = d.getMonth();
	var day = d.getDate();
	if(month.toString().length==1){
		month = "0"+month;
	}
	if(day.toString().length==1){
		day = "0"+day;
	}
	var today = ""+year+"-"+month+"-"+day+"";
	console.log("today is "+today);
	
	db.transaction(function (tx) {	
	tx.executeSql(' SELECT * FROM '+league+'_fixtures where Match_Date>"'+today+'" order by Match_Date, Kickoff asc ', [], function(txs, results){
			var len = results.rows.length, i;
			var fixture_date_heading = 0;
			var content = "";
			for(i=0;i<len;i++){	
				var fixture = results.rows.item(i);
				console.log(fixture.Match_Date+" "+fixture.Home_Team+" "+fixture.Away_Team+" "+fixture.Kickoff);
				
				
				if(fixture_date_heading!=fixture.Match_Date){
					//output a new heading for date
					var fix_date = new Date(fixture.Match_Date);
					fix_date = fix_date.toLocaleDateString('en-US', date_options);
					content+="<div class='new_date'>"+fix_date.toUpperCase()+"</div>";
					fixture_date_heading = fixture.Match_Date;
				}
					//group all fixtures with same date under one heading
					content+="<span class='fixture'><div class='fixture_home_team'>"+fixture.Home_Team.toUpperCase()+"</div><div class='fixture_time'>"+fixture.Kickoff.substring(0,5)+"</div><div class='fixture_away_team'>"+fixture.Away_Team.toUpperCase()+"</div></span>";
				
				
				document.getElementById("_fixture_data").innerHTML = content;
												
			}
			$(".loading_the_data").css("display","none");
	});
	});

	
		
}


function fixture_list_mainpage(league){
	$( "#fixtures_popup_leagues" ).popup( "close" );
	var show_league=league;
	if(show_league == "premier") show_league="PREMIER LEAGUE";
	if(show_league == "champ") show_league="CHAMPIONSHIP";
	if(show_league == "league1") show_league="LEAGUE 1";
	if(show_league == "league2") show_league="LEAGUE 2";
	if(show_league == "conference") show_league="CONFERENCE";
	
	
	
	document.getElementById('fixtures_list_heading').innerHTML=show_league;
	load_in_data_main(league);
	
}
function results_list_mainpage(league){
	document.getElementById('results_list_heading').innerHTML=league;
	$( "#results_popup_leagues" ).popup( "close" );
}

function tables_list_mainpage(league){
	document.getElementById('tables_list_heading').innerHTML=league;
	$( "#tables_popup_leagues" ).popup( "close" );
}
function team_selected(team){
	console.log("selected "+team);
	$( ":mobile-pagecontainer" ).pagecontainer( "change", "#stats_team", { transition: "slide" } );
}
function show_results_team(){
	$("#team_results_head").addClass("underline_text");
	$("#team_fixtures_head").removeClass("underline_text");
	var team = document.getElementById("team_name_heading").textContent;
}
function show_fixtures_team(){
	$("#team_fixtures_head").addClass("underline_text");
	$("#team_results_head").removeClass("underline_text");
}




function panel_change_page(page){
	console.log("goto "+page);
	//$("#menu_panel").panel("close");
//	$.mobile.navigate( "#"+page+"_page" );
	$( ":mobile-pagecontainer" ).pagecontainer( "change", "#"+page+"_page", { transition: "slide" } );
}
