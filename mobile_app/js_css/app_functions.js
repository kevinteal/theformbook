// JavaScript Document
$(document).ready(function(e) {
    
	var premier_table = league_table_json('premier');
	var champ_table = league_table_json('champ');
	var league1_table = league_table_json('league1');
	var league2_table = league_table_json('league2');
	var conference_table = league_table_json('conference');
	
	var premier_fixtures = fixtures_json('premier');
	var champ_fixtures = fixtures_json('champ');
	var league1_fixtures = fixtures_json('league1');
	var league2_fixtures = fixtures_json('league2');
	var conference_fixtures = fixtures_json('conference');
	
	var premier_season = season_json('premier');
	var champ_season = season_json('champ');
	var league1_season = season_json('league1');
	var league2_season = season_json('league2');
	var conference_season = season_json('conference');
	
});



function fixture_list_mainpage(league){
	document.getElementById('fixtures_list_heading').innerHTML=league;
	$( "#popup_leagues" ).popup( "close" )
}