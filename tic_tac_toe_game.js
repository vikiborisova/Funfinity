function myfunc() {

	var c1, c2, c3, c4, c5, c6, c7, c8, c9;
	c1 = document.getElementById("c1").value;
	c2 = document.getElementById("c2").value;
	c3 = document.getElementById("c3").value;

	c4 = document.getElementById("c4").value;
	c5 = document.getElementById("c5").value;
	c6 = document.getElementById("c6").value;

	c7 = document.getElementById("c7").value;
	c8 = document.getElementById("c8").value;
	c9 = document.getElementById("c9").value;

	var c1btn, c2btn, c3btn, c4btn, c5btn, c6btn, c7btn, c7btn, c8btn, c9btn;

	c1btn = document.getElementById("c1");
	c2btn = document.getElementById("c2");
	c3btn = document.getElementById("c3");

	c4btn = document.getElementById("c4");
	c5btn = document.getElementById("c5");
	c6btn = document.getElementById("c6");

	c7btn = document.getElementById("c7");
	c8btn = document.getElementById("c8");
	c9btn = document.getElementById("c9");

	//ako X pecheli, pravi drugite poleta disabled
	if ((c1 == 'x' || c1 == 'X') && (c2 == 'x' || c2 == 'X') && (c3 == 'x' || c3 == 'X')) {
		document.getElementById('print').innerHTML = "Player X won";
		c4btn.disabled = true;
		c5btn.disabled = true;
		c6btn.disabled = true;
		c7btn.disabled = true;
		c8btn.disabled = true;
		c9btn.disabled = true;

		c1btn.style.color = "red";
		c2btn.style.color = "red";
		c3btn.style.color = "red";
	}

	else if ((c4 == 'x' || c4 == 'X') && (c5 == 'x' || c5 == 'X') && (c6 == 'x' || c6 == 'X')) {
		document.getElementById('print').innerHTML = "Player X won";
		c1btn.disabled = true;
		c2btn.disabled = true;
		c3btn.disabled = true;
		c7btn.disabled = true;
		c8btn.disabled = true;
		c9btn.disabled = true;

		c3btn.style.color = "red";
		c4btn.style.color = "red";
		c5btn.style.color = "red";
	}

	else if ((c7 == 'x' || c7 == 'X') && (c8 == 'x' || c8 == 'X') && (c9 == 'x' || c9 == 'X')) {
		document.getElementById('print').innerHTML = "Player X won";
		c4btn.disabled = true;
		c5btn.disabled = true;
		c6btn.disabled = true;
		c1btn.disabled = true;
		c2btn.disabled = true;
		c3btn.disabled = true;

		c7btn.style.color = "red";
		c8btn.style.color = "red";
		c9btn.style.color = "red";
	}

	else if ((c1 == 'x' || c1 == 'X') && (c4 == 'x' || c4 == 'X') && (c7 == 'x' || c7 == 'X')) {
		document.getElementById('print').innerHTML = "Player X won";
		c2btn.disabled = true;
		c3btn.disabled = true;
		c5btn.disabled = true;
		c6btn.disabled = true;
		c8btn.disabled = true;
		c9btn.disabled = true;

		c1btn.style.color = "red";
		c4btn.style.color = "red";
		c7btn.style.color = "red";
	}

	else if ((c2 == 'x' || c2 == 'X') && (c5 == 'x' || c5 == 'X') && (c8 == 'x' || c8 == 'X')) {
		document.getElementById('print').innerHTML = "Player X won";
		c1btn.disabled = true;
		c3btn.disabled = true;
		c4btn.disabled = true;
		c6btn.disabled = true;
		c7btn.disabled = true;
		c9btn.disabled = true;

		c2btn.style.color = "red";
		c5btn.style.color = "red";
		c8btn.style.color = "red";
	}

	else if ((c3 == 'x' || c3 == 'X') && (c6 == 'x' || c6 == 'X') && (c9 == 'x' || c9 == 'X')) {
		document.getElementById('print').innerHTML = "Player X won";
		c1btn.disabled = true;
		c2btn.disabled = true;
		c4btn.disabled = true;
		c5btn.disabled = true;
		c7btn.disabled = true;
		c8btn.disabled = true;

		c3btn.style.color = "red";
		c6btn.style.color = "red";
		c9btn.style.color = "red";
	}

	else if ((c1 == 'x' || c1 == 'X') && (c5 == 'x' || c5 == 'X') && (c9 == 'x' || c9 == 'X')) {
		document.getElementById('print').innerHTML = "Player X won";
		c2btn.disabled = true;
		c3btn.disabled = true;
		c4btn.disabled = true;
		c6btn.disabled = true;
		c7btn.disabled = true;
		c8btn.disabled = true;

		c1btn.style.color = "red";
		c5btn.style.color = "red";
		c9btn.style.color = "red";
	}

	else if ((c3 == 'x' || c3 == 'X') && (c5 == 'x' || c5 == 'X') && (c7 == 'x' || c7 == 'X')) {
		document.getElementById('print').innerHTML = "Player X won";
		c1btn.disabled = true;
		c2btn.disabled = true;
		c4btn.disabled = true;
		c6btn.disabled = true;
		c8btn.disabled = true;
		c9btn.disabled = true;

		c3btn.style.color = "red";
		c5btn.style.color = "red";
		c7btn.style.color = "red";
	}


	//proverqva za ravenstvo
	else if ((b1 == 'X' || b1 == '0') && (b2 == 'X'
		|| b2 == '0') && (b3 == 'X' || b3 == '0') &&
		(b4 == 'X' || b4 == '0') && (b5 == 'X' ||
			b5 == '0') && (b6 == 'X' || b6 == '0') &&
		(b7 == 'X' || b7 == '0') && (b8 == 'X' ||
			b8 == '0') && (b9 == 'X' || b9 == '0')) {
		document.getElementById('print')
			.innerHTML = "Match Tie";
	}
	else {
		if (flag == 1) {
			document.getElementById('print')
				.innerHTML = "Player X Turn";
		}
		else {
			document.getElementById('print')
				.innerHTML = "Player 0 Turn";
		}
	}
}

//Reset funkciq
function resetFunc() {
	location.reload();
	b1 = b2 = b3 = b4 = b5 = b6 = b7 = b8 = b9 = '';
}

// Here onwards, functions check turn of the player 
// and put accordingly value X or 0 
flag = 1;
function myfunc_3() {
	if (flag == 1) {
		document.getElementById("b1").value = "X";
		document.getElementById("b1").disabled = true;
		flag = 0;
	}
	else {
		document.getElementById("b1").value = "0";
		document.getElementById("b1").disabled = true;
		flag = 1;
	}
}

function myfunc_4() {
	if (flag == 1) {
		document.getElementById("b2").value = "X";
		document.getElementById("b2").disabled = true;
		flag = 0;
	}
	else {
		document.getElementById("b2").value = "0";
		document.getElementById("b2").disabled = true;
		flag = 1;
	}
}

function myfunc_5() {
	if (flag == 1) {
		document.getElementById("b3").value = "X";
		document.getElementById("b3").disabled = true;
		flag = 0;
	}
	else {
		document.getElementById("b3").value = "0";
		document.getElementById("b3").disabled = true;
		flag = 1;
	}
}

function myfunc_6() {
	if (flag == 1) {
		document.getElementById("b4").value = "X";
		document.getElementById("b4").disabled = true;
		flag = 0;
	}
	else {
		document.getElementById("b4").value = "0";
		document.getElementById("b4").disabled = true;
		flag = 1;
	}
}

function myfunc_7() {
	if (flag == 1) {
		document.getElementById("b5").value = "X";
		document.getElementById("b5").disabled = true;
		flag = 0;
	}
	else {
		document.getElementById("b5").value = "0";
		document.getElementById("b5").disabled = true;
		flag = 1;
	}
}

function myfunc_8() {
	if (flag == 1) {
		document.getElementById("b6").value = "X";
		document.getElementById("b6").disabled = true;
		flag = 0;
	}
	else {
		document.getElementById("b6").value = "0";
		document.getElementById("b6").disabled = true;
		flag = 1;
	}
}

function myfunc_9() {
	if (flag == 1) {
		document.getElementById("b7").value = "X";
		document.getElementById("b7").disabled = true;
		flag = 0;
	}
	else {
		document.getElementById("b7").value = "0";
		document.getElementById("b7").disabled = true;
		flag = 1;
	}
}

function myfunc_10() {
	if (flag == 1) {
		document.getElementById("b8").value = "X";
		document.getElementById("b8").disabled = true;
		flag = 0;
	}
	else {
		document.getElementById("b8").value = "0";
		document.getElementById("b8").disabled = true;
		flag = 1;
	}
}

function myfunc_11() {
	if (flag == 1) {
		document.getElementById("b9").value = "X";
		document.getElementById("b9").disabled = true;
		flag = 0;
	}
	else {
		document.getElementById("b9").value = "0";
		document.getElementById("b9").disabled = true;
		flag = 1;
	}
} 
