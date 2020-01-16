//Konstanten
var g = 9.81;
var cw = 0.45;			// gilt für Kugel
var luftdichte = 1.2;	// Luftdichte auf der Erde
var dt = 0.1;			// Intervall (Genauigkeit)	

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

//Objekte
var canvas;
var ctx;
var start;	// Start Knopf
var reset;	// Reset Knopf
var interval;

// ERSTE function, die beim Seiten laden aufgerufen wird
function load() {
	// canvas initialisieren
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	meter = canvas.width / 100;		// 200 Meter auf der x Achse festlegen (meter = 1 Meter in Pixel)

	// Knöpfe initialisieren
	start = document.getElementById("start");
	reset = document.getElementById("reset");
	start.disabled = false;
	reset.disabled = false;
	
	// Koordinatensystem zeichnen
	zeichneKoordinatenSystem();
}

// Drücke "Starte" Knopf
function starte() {
	canvasZurueckSetzen();	// resette Canvas
	werteEinlesen();		// lese Nutzereingaben ein
	berechneStartWerte();	// berechne x, y und x-/y-Geschwindigkeitsvektor
	
	// deaktiviere "Start" und "Reset" Knopf	
	start.disabled = true;
	reset.disabled = true;
	
	interval = setInterval(whileSchleife, dt*1000);		// starte whileSchleife() im Intervall alle dt*1000 Millisekunden 
}

function canvasZurueckSetzen(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);	// canvas resetten
	zeichneKoordinatenSystem(); 						// Koordinatensystem neu zeichnen
}

function werteEinlesen() {
	winkel = parseFloat(document.getElementById("winkel_feld").value);
	masse = parseFloat(document.getElementById("masse_feld").value);
	radius = parseFloat(document.getElementById("radius_feld").value);
	hoehe = parseFloat(document.getElementById("hoehe_feld").value);
	geschwindigkeit = parseFloat(document.getElementById("geschwindigkeit_feld").value);
}

function berechneStartWerte() {
	// Startwerte
	x = 0;
	y = hoehe;	
	prev_x = 0;
	prev_y = canvas.height - zuPixel(hoehe);
	vx = Math.cos(winkel*Math.PI/180)*geschwindigkeit;	
	vy = Math.sin(winkel*Math.PI/180)*geschwindigkeit;
	
	// berechne feste Konstante
	konstante = 0.5 * Math.PI * radius * radius * cw * luftdichte;
}

//
//	HAUPT function, hier wird der Graph/Ball gezeichnet
//
function whileSchleife() {
    if(y >= 0){	// zeichne nur solange, wie Ball auch über 0 (=Boden) ist
       
        vx_1 = vx + ((-1)*konstante/masse) * Math.sqrt(vx*vx + vy*vy) * vx * dt;			// neue x-Geschwindigkeit (vx)
        vy_1 = vy + ((-1)*konstante/masse * Math.sqrt(vx*vx + vy*vy) * vy - g) * dt;   		// neue y-Geschwindigkeit (vy)
       
        x_1 = x + (vx * dt);	// neue x-Koordinate
        y_1 = y + (vy * dt);  	// neue y-Koordinate
		
		// ZEICHNE den Punkt!
		drawGraph(zuPixel(x_1), canvas.height - zuPixel(y_1));
		
		// wenn aktuelle y größer als vorheriges y --> dann maximale Höhe erreicht
        if(y_1 >= y){
           maxHeight = (y_1).toFixed(2); // Höhe auf 2 Nachkommastellen runden
        }
		
        vx = vx_1;		// speichere aktuelle vx in vorhergehender vx
        vy = vy_1;		// speichere aktuelle vy in vorhergehender vy
       
        x = x_1;		// speichere aktuelle x-Pos in vorhergehender x-Pos
        y = y_1;		// speichere aktuelle <-Pos in vorhergehender y-Pos
		
    } else {	// Boden erreicht, stoppen
        
		clearInterval(interval);	// stoppe Intervall
        start.disabled = false;	
		reset.disabled = false;		// aktiviere wieder beide Knöpfe
		
		alert("\n\nmaximale Höhe: " + maxHeight + " Meter\n\nWurfweite: " + x.toFixed(2) + " Meter\n\n");	// Höhe und Weite ausgeben
    }
}

// Ball/Graph zeichnen (wird von "whileSchleife()" aufgerufen)
function drawGraph(x_pixel, y_pixel) {

	ctx.beginPath();
	ctx.fillStyle = "red";
	ctx.arc(x_pixel,y_pixel,3,0,2*Math.PI);	// zeichne Kreis bei x und y mit radius 10
	ctx.fill();
	
	ctx.strokeStyle = "red";
	ctx.moveTo(prev_x, prev_y);		// zu vorhergehender Position bewegen...
	ctx.lineTo(x_pixel, y_pixel);	// ... und einen Strich zu aktueller Position ziehen
	ctx.stroke();
	
	ctx.closePath();
	prev_x = x_pixel;
	prev_y = y_pixel;	// aktuelle Position speichern
}


// Drücke "RESET" Knopf
function resetFields() {
	
	canvasZurueckSetzen();
	
	// alle Eingaben löschen
	document.getElementById("radius_feld").value = "";	
	document.getElementById("masse_feld").value = "";
	document.getElementById("hoehe_feld").value = ""; 
	document.getElementById("geschwindigkeit_feld").value = "";
	document.getElementById("winkel_feld").value = "";	
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
	ctx.strokeStyle = "black";
	ctx.fillStyle = "black";
	
	//0 zeichnen
	ctx.beginPath();
	ctx.moveTo(0, canvas.height);				// unten links
	ctx.lineTo(10, canvas.height - 10);			// schräge Linie --> 10px in X; 10px in Y
	ctx.stroke();								// zeichnen
	ctx.fillText("0", 15, canvas.height - 15);	// Text 0 (Null) schreiben
	
	//maximalWert
	ctx.beginPath();
	ctx.moveTo(canvas.width, canvas.height);						// unten rechts
	ctx.lineTo(canvas.width - 10, canvas.height - 10);				// schräge Linie --> -10px in X; -10px in Y
	ctx.stroke();							// zeichne
	ctx.textAlign = "right";										// zeichnen
	ctx.fillText("100", canvas.width - 10, canvas.height - 15);		// Text 200 schreiben
	
	//X-Achse beschriften
	// zeichnet 10 - 190 Meter in 10er-Schritten
	for(var a = 1; a < 10; a++) {	
		ctx.beginPath();
		ctx.moveTo(a*meter*10, canvas.height);			// gehe zu Vielfachen von 10 (Einheit) bzw 10*meter (Pixel)
		ctx.lineTo(a*meter*10, canvas.height - 10);		// zeichne Linie
		ctx.stroke();									// zeichne
		ctx.textAlign = "center";
		ctx.fillText(a*10, a*meter*10, canvas.height - 15);	// 	schreibe Zahlen auf Striche
	}
	//Y-Achse
	for(var i = 1; i < 10; i++) {
		ctx.beginPath();
		ctx.moveTo(0, canvas.height - i*meter*10);
		ctx.lineTo(10, canvas.height - i*meter*10);
		ctx.stroke();
		ctx.textAlign = "left";
		ctx.textBaseline = "middle"
		ctx.fillText(i*10, 15, canvas.height - i*10*meter);
		ctx.textBaseline = "alphabetic";
	}
}