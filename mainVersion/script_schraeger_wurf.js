//Konstanten
var g;
var cw ;
var luftdichte;

//Berechnete Werte
var meter;
var konstante;

// Werte für Berechnungen in der Schleife
var vx;
var vy;
var x;
var y;
var vx_1;
var vy_1;
var x_1;
var y_1;
var laufvariable = 0;
var maxHeight;

// Werte des vorhergehenden Intervalls
var prev_x;
var prev_y;

//Eingaben
var winkel;
var masse;
var radius;
var hoehe;
var geschwindigkeit;
var graph;
var ball;
var punkte;
var graphPunkte;
var dt;
var maxMeter = 100;

//Objekte
var canvas;
var ctx;
var winkel_feld;
var hoehe_feld;
var geschwindigkeit_feld;
var masse_feld;
var radius_feld;
var cw_feld;
var dichte_feld;
var fall_feld;
var slider;
var sliderSize;
var start;	// Start Knopf
var reset;	// Reset Knopf
var random_btn;
var expert_btn;
var interval;
var hidden;
var width_value_label;
var height_value_label;
var time_value_label;
var winkel_preview;
var masse_preview;
var geschwindigkeit_preview;
var hoehe_preview;
var radius_preview;

var first_preview = true;

var expert = false;

var easterMode = false;

// ERSTE function, die beim Seiten laden aufgerufen wird
function load() {
    // browser-detect
    checkBrowser();
	// canvas initialisieren
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	meter = canvas.width / maxMeter;
	// html-felder initialisieren
	winkel_feld = document.getElementById("winkel_feld");
	hoehe_feld = document.getElementById("hoehe_feld");
	geschwindigkeit_feld = document.getElementById("geschwindigkeit_feld");
	radius_feld = document.getElementById("radius_feld");
	masse_feld = document.getElementById("masse_feld");
	cw_feld = document.getElementById("cw_feld");
	dichte_feld = document.getElementById("dichte_feld");
	fall_feld = document.getElementById("fall_feld");
	// Knöpfe initialisieren
	start = document.getElementById("start");
	reset = document.getElementById("reset");
	slider = document.getElementById("slider");
	sliderSize = document.getElementById("slider_size");
	width_value_label = document.getElementById("width_value_label");
	height_value_label = document.getElementById("height_value_label");
	time_value_label = document.getElementById("time_value_label");
	winkel_preview = document.getElementById("winkel_preview");
	masse_preview = document.getElementById("masse_preview");
	geschwindigkeit_preview = document.getElementById("gesch_preview");
	hoehe_preview = document.getElementById("hoehe_preview");
	radius_preview = document.getElementById("radius_preview");
	random_btn = document.getElementById("random_btn");
	expert_btn = document.getElementById("expert_btn");
	start.disabled = false;
	reset.disabled = false;
	random_btn.disabled = false;
	expert_btn.disabled = false;
	updateIntervallSlider();
	updateSizeSlider();
	inputChanged();
	expertInputsOff();
	// Koordinatensystem zeichnen
	zeichneKoordinatenSystem();
}

// Drücke "Starte" Knopf
function starte() {
	if(checkInput()) {
		zurueckSetzen();		// resette Canvas und ein paar Variablen
		werteEinlesen();		// lese Nutzereingaben ein
		berechneStartWerte();	// berechne x, y und x-/y-Geschwindigkeitsvektor
		berechneKonstante();	// berechne feste Konstante
		knopfAus();				// deaktiviere "Start" und "Reset" Knopf
		showThrowtype();		// zeige Wurf-Typ an
		schliessen();			// schliesse Dropdown-Menü	
		
		interval = setInterval(whileSchleife, dt*1000);		// starte whileSchleife() im Intervall alle dt*1000 Millisekunden 
	}
}

function checkInput() {

	// einige Werte müssen schon jetzt eingelesen werden, denn sie werden hier gebraucht
	radius_feld.value = radius_feld.value.replace(/,/g , ".");
	masse_feld.value = masse_feld.value.replace(/,/g , ".");
	hoehe_feld.value = hoehe_feld.value.replace(/,/g , ".");
	geschwindigkeit_feld.value = geschwindigkeit_feld.value.replace(/,/g , ".");
	winkel_feld.value = winkel_feld.value.replace(/,/g , ".");
	
	if(expert) {
		cw_feld.value = cw_feld.value.replace(/,/g , ".");
		dichte_feld.value = dichte_feld.value.replace(/,/g , ".");
		fall_feld.value = fall_feld.value.replace(/,/g , ".");
	}
	
	graph = document.getElementById("chk_graph").checked;
	ball = document.getElementById("chk_ball").checked;
	punkte = document.getElementById("chk_points").checked;
	graphPunkte = document.getElementById("chk_graph_points").checked;
	if(graphPunkte) { // graphPunkte ist das selbe wie graph + punkte
		graph = true;
		punkte = true;
	}

	// hϱhϱhϱhϱhϱhϱhϱhϱhϱ
	if(winkel_feld.value == 666 && 						
					(hoehe_feld.value == 666) &&		
					(geschwindigkeit_feld.value == 666)	&&
					(masse_feld.value == 666) &&
					(radius_feld.value == 666))			
					{	
		klickStart();
		easterMode = true;
		return false;
	}
	
	//Prüfen ob Felder leer sind
	if(winkel_feld.value.trim() == "" || masse_feld.value.trim() == "" || radius_feld.value.trim() == "" || hoehe_feld.value.trim() == "" || geschwindigkeit_feld.value.trim() == "") {
		alert("Füllen Sie alle Felder aus!");
		return false;
	}
	//Prüfen ob Buchstabe eingegeben wurden
	if((winkel_feld.value.search(/[a-z]/i) != -1) || 						// Winkelfeld enthält Buchstaben
					(hoehe_feld.value.search(/[a-z]/i) != -1) || 			// Höhefeld enthält Buchstaben
					(geschwindigkeit_feld.value.search(/[a-z]/i) != -1)	|| 	// Geschwindigkeitfeld enthält Buchstaben
					(masse_feld.value.search(/[a-z]/i) != -1) || 			// Massefeld enthält Buchstaben
					(radius_feld.value.search(/[a-z]/i) != -1)) 			// Radiusfeld enthält Buchstaben
					{	
		alert("Mindestens ein Feld enth\u00e4lt einen Buchstaben!");
		return false;
	}
	// Prüfen ob Felder nicht im richtigen Datenbereich
	if(winkel_feld.value < 0) {
		alert("Der Winkel darf nicht negativ sein.");
		return false;
	}
	if(winkel_feld.value > 90) {
		alert("Der Winkel darf höchstens 90° betragen.");
		return false;
	}
	if(radius_feld.value <= 0) {
		alert("Der Radius darf nicht negativ sein oder 0 betragen.");
		return false;
	}
	if(radius_feld.value > 0.5) {
		alert("Der Radius darf höchstens einen halben Meter betragen.");
		return false;
	}
	if(masse_feld.value < 0) {
		alert("Die Masse der Kugel kann nicht negativ sein!");
		return false;
	}
	if(geschwindigkeit_feld.value <= 0) {
		alert("Die Geschwindigkeit kann nicht 0 m/s oder kleiner sein.");
		return false;
	}
	if(hoehe_feld.value < 0) {
		alert("Die Abwurfhöhe darf nicht negativ sein!");
		return false;
	}
	
	// Expertenmodus-Checks
	if(expert) {
		//Prüfen ob Felder leer sind
		if(cw_feld.value.trim() == "" || dichte_feld.value.trim() == "" || fall_feld.value.trim() == "") {
			alert("Füllen Sie alle Felder aus!");
			return false;
		}
		//Prüfen ob Buchstabe eingegeben wurden
		if((cw_feld.value.search(/[a-z]/i) != -1) || 						// CW enthält Buchstaben
						(dichte_feld.value.search(/[a-z]/i) != -1) || 		// Dichte enthält Buchstaben
						(fall_feld.value.search(/[a-z]/i) != -1))			// Fallbeschleunigung enthält Buchstaben
						{	
			alert("Mindestens ein Feld enth\u00e4lt einen Buchstaben!");
			return false;
		}
		//richtiger Datenbereich ?
		if(cw_feld.value <= 0) {
			alert("Der CW-Wert darf nicht Null oder kleiner sein!");
			return false;
		}
		if(dichte_feld.value < 0) {
			alert("Die Luftdichte darf nicht negativ sein!");
			return false;
		}
		if(fall_feld.value <= 0) {
			alert("Die Fallbeschleunigung darf nicht negativ sein!");
			return false;
		}
	}
	
	return true;
}

function zurueckSetzen(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);	// canvas resetten
	zeichneKoordinatenSystem(); 						// Koordinatensystem neu zeichnen
	laufvariable = 0;
	maxHeight = 0;
}

function werteEinlesen() {
	if(expert) {
		cw = parseFloat(cw_feld.value);
		luftdichte = parseFloat(dichte_feld.value);
		g = parseFloat(fall_feld.value);
	} else {
		g = 9.81;
		cw = 0.45;
		luftdichte = 1.2;
	}
	winkel = parseFloat(winkel_feld.value);
	masse = parseFloat(masse_feld.value);
	radius = parseFloat(radius_feld.value);
	hoehe = parseFloat(hoehe_feld.value);
	geschwindigkeit = parseFloat(geschwindigkeit_feld.value);
	dt = slider.value;
	maxMeter = sliderSize.value;
}

function randomValues() {
	var random_winkel = Math.floor(Math.random() * (90 - 0 + 1)) + 0;
	var random_hoehe = Math.floor(Math.random() * (100 - 0 + 1)) + 0;
	var random_gesch = Math.floor(Math.random() * (50 - 1 + 1)) + 1;
	var random_masse = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
	var random_radius = (Math.floor(Math.random() * (50 - 1 + 1)) + 1) / 100;
	winkel_feld.value = random_winkel;
	hoehe_feld.value = random_hoehe;
	geschwindigkeit_feld.value = random_gesch;
	masse_feld.value = random_masse;
	radius_feld.value = random_radius;
	inputChanged();
}

function changeMode() {
	if(!expert) {
		expert = true;
		expert_btn.style.borderColor = "#8BC34A";
		expertInputsOn();
	} else {
		expert = false;
		expert_btn.style.borderColor = "#3f51b5";		
		expertInputsOff();
	}
}

function expertInputsOn() {
	var table_expert = document.getElementById("table_expert");
	table_expert.style.opacity = "1";
	
	cw_feld.disabled = false;
	dichte_feld.disabled = false;
	fall_feld.disabled = false;
}

function expertInputsOff() {
	var table_expert = document.getElementById("table_expert");
	table_expert.style.opacity = "0.4";
	
	cw_feld.disabled = true;
	dichte_feld.disabled = true;
	fall_feld.disabled = true;
	
	fall_feld.value = "9.81";
	dichte_feld.value = "1.2";
	cw_feld.value = "0.45";
	
}

function berechneStartWerte() {
	// Startwerte
	x = 0;
	y = hoehe;	
	prev_x = 0;
	prev_y = canvas.height - zuPixel(hoehe);
	vx = Math.cos(winkel*Math.PI/180)*geschwindigkeit;	
	vy = Math.sin(winkel*Math.PI/180)*geschwindigkeit;
}

function berechneKonstante() {
	konstante = 0.5 * Math.PI * radius * radius * cw * luftdichte;
}

function inputChanged(){
	if(!first_preview) {
		document.getElementById("radius_preview").innerHTML = radius_feld.value + " m";	
		document.getElementById("masse_preview").innerHTML = masse_feld.value + " kg";
		document.getElementById("hoehe_preview").innerHTML = hoehe_feld.value + " m";
		document.getElementById("gesch_preview").innerHTML = geschwindigkeit_feld.value + " m/s";
		document.getElementById("winkel_preview").innerHTML = winkel_feld.value + " °";
	} else {
		first_preview = false;
	}
}

function knopfAus() {
	start.style.backgroundColor = "#3F51B5";
	reset.style.backgroundColor = "#3F51B5";
	start.innerHTML = "Läuft...";
	reset.innerHTML = "Läuft...";
	random_btn.innerHTML = "Läuft...";
	expert_btn.innerHTML = "Läuft...";
	start.disabled = true;
	reset.disabled = true;
	random_btn.disabled = true;
	expert_btn.disabled = true;
	hideScaleBox();
	showDatafield();
}

function showThrowtype(){
	var throwtypeLabel = document.getElementById("label_throw");
	
	throwtypeLabel.innerHTML = "";
	
	if(throwtypeLabel.style.height == "40px") {
		throwtypeLabel.style.animation = "";
		setTimeout(function (){
			throwtypeLabel.style.animation = "slideOutInThrowtype 0.5s";
		}, 10);
	} else {
		throwtypeLabel.style.animation = "slideInThrowtype 0.5s";
		throwtypeLabel.style.height = "40px";
	}
	
	setTimeout(function (){
		var throwType;
		if(winkel == 0 && luftdichte != 0){
			throwType = "waagrechter Wurf mit Luftwiderstand";
		}
		if(winkel == 0 && luftdichte == 0){
			throwType = "waagrechter Wurf ohne Luftwiderstand";
		}
		if(winkel != 0 && luftdichte != 0){
			throwType = "schräger Wurf mit Luftwiderstand";
		}
		if(winkel != 0 && luftdichte == 0){
			throwType = "schräger Wurf ohne Luftwiderstand";
		}
		if(easterMode) {
			throwType = "**** EASTEREGG ENABLED ****";
			throwtypeLabel.style.backgroundColor= "#F50057";
		}
		throwtypeLabel.innerHTML = throwType;
	}, 500);
}

function hideThrowtype(){
	var throwtypeLabel = document.getElementById("label_throw")
	throwtypeLabel.innerHTML = "";
	throwtypeLabel.style.animation = "slideOutThrowtype 0.5s";
	throwtypeLabel.style.height = "0px";
}


function knopfEin() {
	reset.style.backgroundColor = "#FF1744";
	start.style.backgroundColor = "#8BC34A";
	start.innerHTML = "Start";
	reset.innerHTML = "Reset";
	random_btn.innerHTML = "Zufallswerte";
	expert_btn.innerHTML = "Expertenmodus";
	start.disabled = false;
	reset.disabled = false;
	random_btn.disabled = false;
	expert_btn.disabled = false;
	sliderSize.disabled = false;
	
	showScaleBox();
}

function updateIntervallSlider() {
	document.getElementById("deltatime").innerHTML = parseFloat(slider.value).toFixed(2) + "s";
}

function updateSizeSlider() {
	maxMeter = sliderSize.value;
	meter = canvas.width / maxMeter;
	ctx.clearRect(0,0, canvas.width, canvas.height);
	zeichneKoordinatenSystem();
}

//
//	HAUPT function, hier wird der Graph/Ball gezeichnet
//
function whileSchleife() {
    if(y >= 0){
	
		drawBall(zuPixel(x), canvas.height - zuPixel(y));		// 0er Stelle
       
        vx_1 = vx + ((-1)*konstante/masse) * Math.sqrt(vx*vx + vy*vy) * vx * dt;
        vy_1 = vy + ((-1)*konstante/masse * Math.sqrt(vx*vx + vy*vy) * vy - g) * dt;   
       
        x_1 = x + (vx * dt);
        y_1 = y + (vy * dt);  
       
        if(ball) {     
            ctx.clearRect(0, 0, canvas.width, canvas.height);   // canvas resetten
            zeichneKoordinatenSystem();                         // Koordinatensystem neu zeichnen
            //displayData(x_1, laufvariable*dt);                  // weite, Zeit usw LIVE anzeigen (nur im "ball" Modus möglich)
        }
		
		displayData(x_1, laufvariable*dt); // ALLE MODI MÖGLICH DA AUSLAGERUNG IN DIV BOX
		
		if(ball && y_1 < 0) {
			drawBall(zuPixel(x_1), canvas.height - 10);
		} else {
			drawBall(zuPixel(x_1), canvas.height - zuPixel(y_1));
		}
       
        // wenn aktuelle y größer als vorheriges y --> dann maximale Höhe erreicht
        if(y_1 >= y){
            maxHeight = (y_1).toFixed(2); // Höhe auf 2 Nachkommastellen runden
        }
       
        vx = vx_1;
        vy = vy_1;
       
        x = x_1;
        y = y_1;
        laufvariable++;
       
    } else {
        stop();
		displayData(x, laufvariable*dt);
        knopfEin();
    }
}

// Ball/Graph zeichnen (wird von "whileSchleife()" aufgerufen)
function drawBall(x_pixel, y_pixel) {

	ctx.beginPath();
	if(ball || punkte){
		ctx.strokeStyle = "red";
		ctx.fillStyle = "#3F51B5";
		ctx.arc(x_pixel,y_pixel,10,0,2*Math.PI);
		ctx.fill();
	}
	if(graph){
		ctx.strokeStyle = "#3F51B5";
		ctx.moveTo(prev_x, prev_y);
		ctx.lineTo(x_pixel, y_pixel);
		ctx.stroke();
	}
	ctx.closePath();
	prev_x = x_pixel;
	prev_y = y_pixel;
}

// stoppe intervall, da Ball/Graph fertig gezeichnet
function stop() {
	clearInterval(interval);
}

function showDatafield() {
	var dataField = document.getElementById("datafield");
	dataField.style.animation = "slideInDatafield 1s";
	dataField.style.width = "250px";
}

function hideDatafield() {
	var dataField = document.getElementById("datafield");
	dataField.style.animation = "slideOutDatafield 1s";
	dataField.style.width = "20px";
}

function showScaleBox() {
	var scaleBox = document.getElementById("scale_box")
	scaleBox.style.animation = "slideInScalebox 0.5s";
	scaleBox.style.height = "50px";
}

function hideScaleBox() {
	var scaleBox = document.getElementById("scale_box")
	scaleBox.style.animation = "slideOutScalebox 0.5s";
	scaleBox.style.height = "0px";
}

// blende Werte Wurfweite, max.Höhe und Zeit ins canvas ein
function displayData(weite, zeit){
	weite = (weite).toFixed(2);
	zeit = (zeit).toFixed(2);
	width_value_label.innerHTML = weite + " m";
	height_value_label.innerHTML = maxHeight + " m";
	time_value_label.innerHTML = zeit + " s";
}

// "Dropdown" - Menü anzeigen und schließen (wird bei Klick auf "WERTE"-Knopf ausgeführt
function zeigeWerte(){
	var wertebox = document.getElementById("eingabefeld");
	
	if(hidden){
		wertebox.style.animation = "slide 1s";
		wertebox.style.height = "295px";
		hidden = false;
	} else {
		wertebox.style.animation = "slideBack 1s";
		wertebox.style.height = "0px";
		hidden = true;
	}
}
// "Dropdown" - Menü NUR öffnen
function öffnen() {
	var wertebox = document.getElementById("eingabefeld");
	wertebox.style.animation = "slide 1s";
	wertebox.style.height = "295px";
	hidden = false;
}
// "Dropdown" - Menü NUR schließen
function schliessen() {
	var wertebox = document.getElementById("eingabefeld");
	wertebox.style.animation = "slideBack 0.5s";
	wertebox.style.height = "0px";
	hidden = true;
}

// Drücke "RESET" Knopf
function resetFields() {
	öffnen();
	hideDatafield();
	hideThrowtype();
	zurueckSetzen();
	winkel_feld.value = "";
	hoehe_feld.value = "";
	geschwindigkeit_feld.value = "";
	masse_feld.value = "";
	radius_feld.value = "";
	slider.value = 0.01;
	sliderSize.value = 450;
	updateIntervallSlider();
	updateSizeSlider();
	
	// Experten Modus ausschalten
	expertInputsOff();
	expert = false;
	expert_btn.style.borderColor = "#3f51b5";

	document.getElementById("radius_preview").innerHTML = "";	
	document.getElementById("masse_preview").innerHTML = "";
	document.getElementById("hoehe_preview").innerHTML = ""; 
	document.getElementById("gesch_preview").innerHTML = "";
	document.getElementById("winkel_preview").innerHTML = "";	
}

// Berechnungen, um nicht in einzelne Pixel rechnen zu müssen
function zuPixel(m) {
return m * meter;
}
function zuMeter(pixel) {
return pixel / meter;
}


function zeichneKoordinatenSystem() {
	
	ctx.font="15px Verdana";
	ctx.strokeStyle = "#3F51B5";
	ctx.fillStyle = "#3F51B5";
	
	//0
	ctx.beginPath();
	ctx.moveTo(0, canvas.height);
	ctx.lineTo(10, canvas.height - 10);
	ctx.stroke();
	ctx.textAlign = "left";
	ctx.fillText("0", 15, canvas.height - 15);
	ctx.textAlign = "initial";
	
	//maximalWert
	ctx.beginPath();
	ctx.moveTo(canvas.width, canvas.height);
	ctx.lineTo(canvas.width - 10, canvas.height - 10);
	ctx.stroke();	
	ctx.textAlign = "right";
	ctx.fillText(maxMeter, canvas.width - 10, canvas.height - 15);
	ctx.textAlign = "initial";

	//X-Achse
	var schrittIntervall
	if(maxMeter <= 400) {
		schrittIntervall = 10;		// bis 400 Meter noch lesbar alle 10m auf x-Achse
	} else{
		schrittIntervall = 100;		// ab 450 Meter nur noch alle 100 Meter zeichnen -> bessere Lesbarkeit
	}
	for(var a = 1; a < (maxMeter/schrittIntervall); a++) {
		ctx.beginPath();
		ctx.moveTo(a*meter*schrittIntervall, canvas.height);
		ctx.lineTo(a*meter*schrittIntervall, canvas.height - 10);
		ctx.stroke();
		ctx.textAlign = "center";
		ctx.fillText(a*schrittIntervall, a*meter*schrittIntervall, canvas.height - 15);		
		ctx.textAlign = "initial";
	}
	//Y-Achse
	for(var i = 1; i < (maxMeter/schrittIntervall); i++) {
		ctx.beginPath();
		ctx.moveTo(0, canvas.height - i*meter*schrittIntervall);
		ctx.lineTo(10, canvas.height - i*meter*schrittIntervall);
		ctx.stroke();
		ctx.textAlign = "left";
		ctx.textBaseline = "middle"
		ctx.fillText(i*schrittIntervall, 15, canvas.height - i*schrittIntervall*meter);
		ctx.textAlign = "initial";
		ctx.textBaseline = "alphabetic";
	}

}

var rintervall = 0;
var interval_id;

function easterEgg() {
	schliessen();
	var img = new Image();
	img.src = "https://i.ebayimg.com/images/g/ONAAAOSwLVZVukVM/s-l1600.jpg";
	if(rintervall > 50) {
		clearInterval(interval_id);
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
		return;
	} 
	//ctx.clearRect(0,0, canvas.width, canvas.height);
	var x = Math.floor((Math.random() * canvas.width) + 0); 
	var y = Math.floor((Math.random() * canvas.height) + 0);
	var ratio = Math.random() * (2-0) + 0;
	ctx.drawImage(img, x, y, img.width * ratio, img.height * ratio);
	rintervall++;
}

function klickStart() {
	showThrowtype();
	interval_id = setInterval("easterEgg()", 100);
}

function get_browser_info(){
    var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []; 
    if(/trident/i.test(M[1])){
        tem=/\brv[ :]+(\d+)/g.exec(ua) || []; 
        return {name:'IE',version:(tem[1]||'')};
        }   
    if(M[1]==='Chrome'){
        tem=ua.match(/\bOPR\/(\d+)/)
        if(tem!=null)   {return {name:'Opera', version:tem[1]};}
        }   
    M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
    return {
      name: M[0],
      version: M[1]
    };
 }

function checkBrowser(){
    var browser = get_browser_info();
    console.log(browser.name);
    console.log(browser.version);
    if (browser.name == "Firefox" && browser.version < 44){
        alert("Sie benutzen nicht die aktuellste Version des Firefox! \n\nBitte bedenken Sie, dass einige Elemente deshalb falsch werden können. \nInstallieren Sie die aktuelle Version von hier: https://www.mozilla.org/de/firefox/new/");
    }
    if (browser.name == "Chrome" && browser.version < 48){
        alert("Sie benutzen nicht die aktuellste Version von Google Chrome! \n\nBitte bedenken Sie, dass einige Elemente deshalb falsch werden können. \nInstallieren Sie die aktuelle Version von hier: https://www.google.de/chrome/browser/desktop/");
    }
}
