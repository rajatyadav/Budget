function init() {
	
}

function resetUrl(){
	var uri = window.location.toString();
	if (uri.indexOf("?") > 0) {
	    var clean_uri = uri.substring(0, uri.indexOf("?"));
	    window.history.replaceState({}, document.title, clean_uri);
	}
}

function loadFirst(){
	// load first element of user list
	$firstElm = $("._memberList > a:first");
	$firstElm.addClass("active");
	$.getJSON( "getMember.jsp",{m_id : $firstElm.attr("id")}, displayResult);
	$('.memberExpence').load("memberExpences.jsp", {memberId:$firstElm.attr("id")});
	$('.editUser, .delUser').attr("value", $firstElm.attr("id"));
//-------
}
function displayResult(data) {
	if ( data.error){
		$("._m_name").html("Not available");
		$("._m_cont").html("Not available");
		$("._m_add").html("Not available");
	      	alert( data.error);
	}
	else{      
		$("._m_name").html( data.f_name+" "+data.l_name);
  	   	$("._m_cont").html( data.contact);
  	 	$("._m_add").html( data.address);
	}
}

function loadMemberList(){
	$('._memberList').load("memberNameList.jsp").fadeIn("slow");
}

function clearMemberForm(){
	$("input[name='f_name']").val("");
	$("input[name='l_name']").val("");
	$("input[name='contact']").val("");
	$("._address").val("");
	$('.errorMsg, .successMsg').html("");
}


function clickEvents() {
		
}


$(document).ready(function(){
	init();
	clickEvents();
});