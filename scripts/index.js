"use strict";
(function()
{
	var winter = [];
	var autumn = [];
	var majors = {};

	window.onload = function()
	{
	window.addEventListener("scroll",scrollChange);
	var graphs = document.getElementsByClassName("graphArea");
	for(var i=graphs.length-1; i>=0; i--){
		graphs[i].style.paddingTop=document.getElementsByTagName("header")[0].offsetHeight+"px";
	}
	setCanvasSizes();
	getJsonAut();

	}
	 
function setCanvasSizes(){
	var canvases = document.getElementsByTagName("canvas");
	var xy = Math.min(window.innerHeight,window.innerWidth);
	for(var i=canvases.length-1; i>=0; i--){
		canvases[i].height = xy-document.getElementsByTagName("header")[0].offsetHeight-50;
		canvases[i].width = canvases[i].height;
	}
	//radar needs more room
	canvases[0].height +=100;
	canvases[0].width = canvases[0].height;

}

function getJsonAut(){
//		loading(document.getElementById("imageSpace"));
		var aj = new XMLHttpRequest();
		aj.onload = function(){	var jsn = JSON.parse(this.responseText);
						autumn = jsn["people"];
						getJsonWin();};
		aj.open("GET", "http://students.washington.edu/icburns/FloorData/floorDataI.json", true);
		aj.send();
	}

function getJsonWin(){		
	var aj = new XMLHttpRequest();
	aj.onload = function(){	var jsn = JSON.parse(this.responseText);
						winter = jsn["people"];
						displayGraphs();};
	aj.open("GET", "http://students.washington.edu/icburns/FloorData/floorDataII.json", true);
	aj.send();
}

function displayGraphs(){
	setMajors();
	var colors = getColors();
	colorGraph(colors);
	var majorsAu = getMajors(autumn);
	var majorsWin = getMajors(winter);
	majorsGraph(majorsAu,majorsWin);
	sureGraph();
}

function setMajors(){

	for(var i=autumn.length-1; i>=0; i--){
		var currentMajor = autumn[i]["major"];
		if (currentMajor!=""){
			for(var j=currentMajor.length-1; j>=0; j--){
				majors[currentMajor[j]] = 0;
			}
		}
	}
	for(var i=winter.length-1; i>=0; i--){
		var currentMajor = winter[i]["major"];
		if (currentMajor!=""){
			for(var j=currentMajor.length-1; j>=0; j--){
				majors[currentMajor[j]] = 0;
			}
		}
	}

}


function getMajors(qtr){
	var qtrMajors = Object.create(majors);
	for(var i=0; i<qtr.length; i++){
		var currentMajor = qtr[i]["major"];
		if (currentMajor!=""){
			for(var j=currentMajor.length-1; j>=0; j--){
				qtrMajors[currentMajor[j]] = qtrMajors[currentMajor[j]] + 1;
			}
		}
	}

	return qtrMajors;
}

function majorsGraph(majorsAu,majorsWin){
	var dataWin = [];
	var dataAu = [];
	var labels = [];
	for(var m in majors){
		labels.push(m);
		dataAu.push(majorsAu[m]);
		dataWin.push(majorsWin[m]);
	}

var data = {
	labels : labels,
	datasets : [
		{
			fillColor: "rgba(200,100,50,.5)",
			strokeColor: "rgba(200,100,50,.8)",
			pointColor : "rgba(200,100,50,1)",
			pointStrokeColor : "rgba(200,100,50,.8)",
			data : dataAu
		},
		{
			fillColor: "rgba(50,100,200,.5)",
			strokeColor: "rgba(50,100,200,.8)",
			pointColor : "rgba(50,100,200,1)",
			pointStrokeColor : "rgba(50,100,200,.8)",
			data : dataWin
		}
	]
}
	var options = {
		scaleOverride : true,
		scaleSteps : 5,
		scaleStepWidth : 1,
		scaleStartValue : 0,
		scaleShowLabels : true,
		scaleShowLabelBackdrop : false,
		animation: (typeof window.orientation == 'undefined'), //false for most mobile
		scaleLineColor : "rgba(200,200,200,.1)",
		angleLineColor : "rgba(200,200,200,.1)",	
		scaleFontColor : "rgba(200,200,200,.8"
	};


	var ctx = document.getElementById("majorsGraph").getContext("2d");
	var myNewChart = new Chart(ctx).Radar(data,options);

}



function sureGraph(){
	var sureAu = [0,0,0,0,0,0];
	var sureWin = [0,0,0,0,0,0];
	for(var i=winter.length-1; i>=0; i--){
		sureWin[winter[i]["sure"]]++;
	}
	for(var i=autumn.length-1; i>=0; i--){
		sureAu[autumn[i]["sure"]]++;
	}
	var labels = ["0","1","2","3","4","5"];

	var data = {
		labels : labels,
		datasets : [
			{
				fillColor : "rgba(200,100,50,.75)",
				strokeColor : "rgba(100,100,100,1)",
				data : sureAu
			},
			{
				fillColor : "rgba(50,100,200,.75)",
				strokeColor : "rgba(100,100,100,1)",
				data : sureWin
			}
		]
	}

	var options = {
		scaleOverride : true,
		scaleSteps : 20,
		scaleStepWidth : 1,
		scaleStartValue : 0,
		scaleShowLabels : false,
		scaleFontColor : "rgba(200,200,200,.8",
		scaleLineColor : "rgba(200,200,200,.1)",
		animation: (typeof window.orientation == 'undefined'), //false for most mobile
		scaleGridLineColor : "rgba(200,200,200,.05)"
	};


	var ctx = document.getElementById("sureGraph").getContext("2d");
	var myNewChart = new Chart(ctx).Bar(data,options);

}

function getColors(){
	var colors = {};
	for(var i=0; i<winter.length; i++){
		var currentColor = winter[i]["color"];
		if (currentColor!=""){
			currentColor = currentColor.split(" ");
				var str = currentColor.pop().toLowerCase();
				var s = str.substring(0,1);
				s=s.toUpperCase();
				var str = str.substring(1,str.length);
				currentColor = s+str;
			if (!colors[currentColor]) {
				colors[currentColor] = 0;
			}
			colors[currentColor] = colors[currentColor] + 1;
		}
	}

	return colors;
}

function colorGraph(colors){
	var datasets = [];
	for(var c in colors){
		if(c=="Light"){
			colors["Lime"]=colors["Light"];
			c="Lime";
		}
		var dataset = {
			fillColor: c,
			strokeColor: "rgba(20,20,20,.5)",
			data: [colors[c]]
		}
		datasets.push(dataset);
	}

	var data = {
		labels : ["colors"],
		datasets : datasets
	}

	var options = {
		scaleOverride : true,
		scaleSteps : 8,
		scaleStepWidth : 1,
		scaleStartValue : 0,
		scaleShowLabels : false,
		scaleFontColor : "rgba(200,200,200,.8",
		scaleLineColor : "rgba(200,200,200,.1)",
		animation: (typeof window.orientation == 'undefined'), //false for most mobile		
		scaleGridLineColor : "rgba(200,200,200,.05)"
	};


	var ctx = document.getElementById("colorGraph").getContext("2d");
	var myNewChart = new Chart(ctx).Bar(data,options);

}

function scrollChange(e){
	//do something
}


})();