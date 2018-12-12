
var root_url = 'http://comp426.cs.unc.edu:3001';
var sel_airline = '';
var sel_id = 0;
var flight_id = 0;
var revenue = 0;
var cost = 0;
var profit = 0;
var rpf = 0;
var cpf = 0;
var tot_inst = 0;


function build_homepage() {
	let body = $('body');
	body.empty();
	let homeBody = $('<div id = "homeDiv">' + sel_airline + ' Cashflow Projection</div>');
	homeBody.append('<button id = "choose_new_al"> Choose a New Airline </button>');
	homeBody.append('<br>');
	homeBody.append('<button id = "hp_flights">' + sel_airline + ' Flight Information</button>');
	homeBody.append('<div class = "a_div"><br><button id = "hp_an">' + sel_airline + ' Analytics / Cash Flow Metrics</button></div>');
	body.append(homeBody);
}

function build_flight_interface(){
	let body = $('body');
	body.empty();
	body.append('<button id = "home_button"> Home </button>');
	let listDiv = $('<div id = "flightsDiv">Flights</div>');
	let ct = $('<p>Number of Optional Flights: </p>');
	console.log(sel_id);
	
	$.ajax(root_url + '/flights?filter[airline_id]=' + sel_id,
	       {
		   type: 'GET',
		   xhrFields: {withCredentials: true},
		   success: (response) => {
		   		let count = 0;
			   	response.forEach(function(object) { 
			   	var fl_num = object.number;
			   	var dept_id = object.departure_id;
			   	var arr_id = object.arrival_id;
			   	var dep_tim = object.departs_at;
			   	var dep_code = '';
		   		var arr_code = '';
		   		let but = $('<button class="in_flight" id=' + fl_num + '>' + '</button>');

			   		$.ajax(root_url + '/airports/' + dept_id,
			   		{
			   		type: 'GET',
			   		xhrFields: {withCredentials: true},
			   		success: (response) => {
			   			but.append(response.code + ' to '); 


			   			$.ajax(root_url + '/airports/' + arr_id,
			   			{
			   			type: 'GET',
			   			xhrFields: {withCredentials: true},
			   			success: (response) => {
			   			but.append(response.code); 
			   			but.append(' Departing at ' + dep_tim.substring(11,16));
			   			},
			   			error: () => {
		       			alert('error with arrival ID');
		   				}

			   			});




			   			},
			   			error: () => {
		       			alert('error with departure ID');
		   				}

			   		});

			   		


			   	count++;
			   listDiv.append(but);
			   });	
			   ct.append(count);
		   },
		   error: () => {
		       alert('error with airline ID');
		   }
	       });

	body.append(ct);
	body.append(listDiv);
}

function build_analytics_interface()	{
	// let head = $('head');
	// head.empty();
	// head.append('<title>' + sel_airline + ' Cash Flow Statistics</title>');
	// head.append('<script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="crossorigin="anonymous"></script>');
	// head.append('<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>');
	// head.append('<script src = "script.js"> </script>');
	// head.append('<script src = "google.js"> </script>');
	let body = $('body');
	body.empty();
	body.append('<button id = "home_button"> Home </button><br>');
	let topDiv = $('<div></div>');
	topDiv.append('Revenue Per Flight:<br>');
	topDiv.append('<input type = "text" id = "rev_per_flight"><br>');
	topDiv.append('Cost Per Flight:<br>');
	topDiv.append('<input type = "text" id = "cost_per_flight">');
	topDiv.append('<button id = update_CF>Compute</button>');
	body.append(topDiv);
	let bottomDiv = $('<div></div>');
	bottomDiv.append('Total Revenue: ' + revenue + '<br>');
	bottomDiv.append('Total Costs: ' + cost+ '<br>');
	bottomDiv.append('Profit: ' + profit);
	body.append(bottomDiv);

}


function build_instance_interface()	{
	let body = $('body');
	body.empty();
	body.append('<button class= back_to_flights>Return to All Flights</button>')
	let new_inst_div = $('<div id = "instance_div"></div>');
	new_inst_div.append('Date: (YYYY-MM-DD)');
	new_inst_div.append('<input type = "text" id = "date_input">');
	body.append(new_inst_div);
	body.append('<button class = "createInstance" id = > Create New Instance of this Flight </button>');
	let listDiv = $('<div id = "inst_list">Instances</div>');

	$.ajax(root_url + '/instances?filter[flight_id]=' + flight_id,
	       {
		   type: 'GET',
		   xhrFields: {withCredentials: true},
		   dataType: 'json',
		   success: (response) => {
		   		console.log(response);
			   response.forEach(function(object) {listDiv.append('<p>' + object.date + '</p>' + '<br>')});
		   },
		   error: () => {
		   		console.log('error');
		       alert('error');
		   }
	       });
	body.append(listDiv);

}


function build_sel_page()	{
	revenue = 0;
	cost = 0;
	profit = 0;

	let body = $('body');
	body.empty();
	body.append('<button id = "logout"> Logout </button>');
	body.append('<div class = "chooseDiv"> Please Select an Airline to View / Modify Financial Projections</div>');
	let dropdown = $('<div class="dropdown"></div>');
	dropdown.append('<button onclick="dropdown()" class="dropbtn">Airlines</button>');
	let myDD = $('<div id="myDropdown" class="dropdown-content">');
	myDD.append('<input type="text" placeholder="Search.." id="myInput" onkeyup="filterFunction()">');

	$.ajax(root_url + '/airlines',
	       {
		   type: 'GET',
		   xhrFields: {withCredentials: true},
		   dataType: 'json',
		   success: (response) => {
			   response.forEach(function(object) {myDD.append('<p class = "al" id =' + object.id +'>' + object.name + '</p>')});
		   },
		   error: () => {
		   		console.log('error');
		       alert('error');
		   }
	       });
	dropdown.append(myDD);
	body.append(dropdown);
}

function build_login_page()	{
	let body = $('body');
	body.empty();
	body.append('<h1>Cash Flow Simulator Login</h1>');
	let li = $('<div id = "login"></div>');
		li.append('User:');
		li.append('<input type = "text" id = "login_user"><br>');
		li.append('Password:');
		li.append('<input type = "text" id = "login_pass"><br>');
		li.append('<button id = "login_btn">Login</button>');
	body.append(li);
}


function dropdown() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function filterFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("myDropdown");
  a = div.getElementsByTagName("p");
  for (i = 0; i < a.length; i++) {
    if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}




$(document).ready(() => {

    $('body').on('click', '#login_btn', function()  {
	
	let user = $('#login_user').val();
	let pass = $('#login_pass').val();

	$.ajax(root_url + "/sessions",
	       {
		   type: 'POST',
		   xhrFields: {withCredentials: true},
		   dataType: 'json',
		   data: {
		   		"user": {
		       		"username": user,
		       		"password": pass
		   				}
			},	
		   success: (response) => {
			   build_sel_page();
		   },
		   error: () => {
		       alert('Wrong Username or Password, try again');
		   }
	       });
    });

$('body').on('click', '#logout', function()	{
	$.ajax(root_url + "/sessions",
	       {
		   type: 'DELETE',
		   xhrFields: {withCredentials: true},
		   success: (response) => {
			   build_login_page();
		   },
		   error: () => {
		       alert('Something is Wrong with Logout');
		   }
	       });
    });




$('body').on('click', '.al', function()	{
	sel_airline = this.innerText;
	sel_id = parseInt($(this).attr('id'));
	console.log(sel_airline);
	console.log(sel_id);
	build_homepage();
});


$('body').on('click', '#choose_new_al', function()	{
	sel_airline = '';
	sel_id = 0;
	build_sel_page();
});


$('body').on('click', '#hp', function()	{
	build_homepage();
});

$('body').on('click', '#home_button', function()	{
	build_homepage();
});

$('body').on('click', '#hp_flights', function()	{
	build_flight_interface();
});

$('body').on('click', '#hp_an', function()	{
	build_analytics_interface();
});

$('body').on('click', '.in_flight', function()	{
	flight_id = parseInt($(this).attr('id'));
	build_instance_interface();
});

$('body').on('click', '.back_to_flights', function()	{
	build_flight_interface();
});

$('body').on('click', '#update_CF', function()	{
	let rpf = $('#rev_per_flight').val();
	let cpf = $('#cost_per_flight').val();
	let cCount = 0;
	$.ajax(root_url + '/flights?filter[airline_id]=' + sel_id,
	       {
		   type: 'GET',
		   xhrFields: {withCredentials: true},
		   dataType: 'json',
		   success: (response) => {
			 	response.forEach(function(object) {
			 		flight_id = object.number;

			 		$.ajax(root_url + '/instances?filter[flight_id]=' + flight_id,
	       			{
		   			type: 'GET',
				   	xhrFields: {withCredentials: true},
				   	dataType: 'json',
				   	success: (response) => {
					   	response.forEach(function(object) {tot_inst++});
				   	},
				   	error: () => {
				       alert('error');
				   	}
	       		   	});




			 	});






		   },
		   error: () => {
		       alert('error');
		   }
	       });

	revenue = tot_inst*rpf;
	cost = tot_inst*cpf;
	profit = revenue - cost;
	build_analytics_interface();

});






$('body').on('click', '.createInstance', function()	{
	// Read date from input
	let in_date = $('#date_input').val();
	$.ajax(root_url + '/instances',
	       {
		   type: 'POST',
		   xhrFields: {withCredentials: true},
		   dataType: 'json',
		   data: {
		   		"instance": {
		       		"flight_id": flight_id,
		       		"date": in_date
		   				}
			},	
		   success: (response) => {
			  console.log('New Instance Posted');
		   },
		   error: () => {
		       alert('error');
		   }
	       });

	build_instance_interface();
});



});

