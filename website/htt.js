function date_mysql_en(datestr){
                  //converts a mysql date yyyy-mm-dd to a UK one dd/mm/yyyy
                  return datestr.substring(8, 10) + '/' + datestr.substring(5,7) + '/' + datestr.substring(0,4);
}

function date_en_mysql(datestr){
                  //converts a UK date dd*mm*yyyy to a mysql one yyyy-mm-dd
                  var str = datestr.substring(6, 10) + '-' + datestr.substring(3,5) + '-' + datestr.substring(0,2);
                  return str;
}

function trim(inputString) {
                  // Removes leading and trailing spaces from the passed string. Also removes
                  // consecutive spaces and replaces it with one space. If something besides
                  // a string is passed in (null, custom object, etc.) then return the input.
                  if (typeof inputString != "string") { return inputString; }
                  var retValue = inputString;
                  var ch = retValue.substring(0, 1);
                  while (ch == " ") // Check for spaces at the beginning of the string
                  {
                  	retValue = retValue.substring(1, retValue.length);
                  	ch = retValue.substring(0, 1);
                  }
                  ch = retValue.substring(retValue.length-1, retValue.length);
                  while (ch == " ")// Check for spaces at the end of the string
                  {
                  	retValue = retValue.substring(0, retValue.length-1);
                 	ch = retValue.substring(retValue.length-1, retValue.length);
                  }
                  return retValue; // Return the trimmed string back to the user
} // Ends the "trim" function

function add_diagnosis(select_obj, text_obj)
{
			var index = select_obj.selectedIndex;
			var selected_value = select_obj.options[index].value;
			var str = "";
			if(text_obj.value.indexOf(selected_value) != -1)
				return; //diagnosis already there
			//precede the diagnosis with a comma if not first in the list
			if(text_obj.value != "")
				str = ", ";
			str += selected_value;
			text_obj.value += str;
}

function del_diagnosis(select_obj, text_obj)
{
			if(text_obj.value == "")
				return; //cannot delete a diagnosis if there are none
			else
			{
				var index = select_obj.selectedIndex;
				var selected_value = select_obj.options[index].value;
				diagnosis_array = text_obj.value.split(", ");
				new_array = new Array();
				var j=0;
				for(i = 0; i < diagnosis_array.length; ++i)
				{
					if(diagnosis_array[i] != selected_value)
						new_array[j++] = diagnosis_array[i];
				}
				text_obj.value = new_array.join(", ");
			}
}

function validate_date(input){
	var regex_date=/^(\d{2}[/.\-_]){2}\d{4}$/;
	var today = new Date();
	if(!(input == ""
	|| (regex_date.test(input)
	&& (day = parseInt(input.substring(0,2),10)) >= 1 && day <= 31
	&& (month = parseInt(input.substring(3,5),10)) >= 1 && month <= 12
	&& (year = parseInt(input.substring(6,10),10)) <= today.getFullYear()
	&&  year > 1800
	&& (new Date(year, month-1, day)).getTime() < today.getTime()
	)))
		return false;
	else
		return true;
}


function validate_subject(form_obj){
	//validates add/update form for patient
	//i) checks dob is dd/mm/yyyy. RIght format, not in future.
	//ii) checks mehno, newgno and subjectid are all integers
	//iii) checks initials are 0-3 letters
	//iv) Checks that Year of birth is not future and agrees with dob if present.
	// v) Disallows unless at least surname, initial and yob are present.
	//here is the assumed names of the controls:
	//subjectid, forename, initial, surname, maiden, dob, yob, gender, mehno, status, newgc, comments, diagnosis.
	if(!validate_date(dob = trim(form_obj.dob.value)))
	{
		alert("Please enter a valid date of birth dd/mm/yyyy");
		return false;
	}
	if( ((meh = trim(form_obj.mehno.value)) != "" && isNaN(meh))
		||  ((newgc = trim(form_obj.newgc.value)) != "" && isNaN(newgc))
		||  ((subjectid = trim(form_obj.subjectid.value)) != "" && isNaN(subjectid))
		)
	{
		alert("Please enter valid numbers for 'Unique ID', 'MEH number' and 'Family Number' or leave blank");
		return false;
	}
	var regex_initial=/^[A-Za-z]{0,3}$/;
	if((ini = trim(form_obj.initial.value)) != "" && ! regex_initial.test(ini))
	{
		alert("Please just enter upto three letters for initials or leave blank");
		return false;
	}
	if(dob != "" && (yob=trim(form_obj.yob.value)) != "" && ( year != parseInt(yob)))
	{
		alert("There's something not right with the year of birth");
		return false;
	}
	surname = form_obj.surname.value; forename = form_obj.forename.value;
	if(surname == "" || (forename == "" && ini == "") || (dob == "" && yob == ""))
	{
	alert("Insufficient data to make a new entry");
	return false;
	}
	if(dob != "" && yob == "")
	{
		form_obj.yob.value = year;
	}
	return true;
}
function validate_sample(form_obj){
	if(!validate_date(trim(form_obj.bloodtaken.value)))
	{
		alert("Please enter a valid date dd/mm/yyyy");
		return false;
	}
	return true;
}
function validate_address(form_obj){
	if(!validate_date(trim(form_obj.extracted.value)))
	{
		alert("Please enter a valid date dd/mm/yyyy");
		return false;
	}
	if(form_obj.location.value == "")
	{
		alert("Please confirm location of eppendorf");
		return false;
	}
	return true;
}

function validate_id(id, maxlen){ //allows regular expression or blank
	//alert("validate_id("+id+","+maxlen+") called");
	var x = maxlen - 1;
	var regexstr = "^[1-9][0-9]{0," + x + "}$";
	var regex_id= new RegExp(regexstr);
	if(id == "" || regex_id.test(id))
		return true;
	else
		return false;
}

function validate_primer(str){
	//alert("In validate_primer()");
	var reg_primer = new RegExp("^[ACGTNacgtn]{15,40}$");
	if(str == "" || reg_primer.test(str))
		return true;
	else
		return false;
}


function validate_assay(form_obj){
	//alert("validate_assay() called");
	//check the date field is ok
	var maxlengthdnano = 5; //25772 on test database 20/8/2005
	var maxlengthsubjectid = 5; //13456 on test db 20/08/2005
	if(!validate_date(trim(form_obj.resultdate.value)))
	{
		alert("Please enter a valid date dd/mm/yyyy or leave blank");
		return false;
	}
	//check for at least one of subjectid and DNAnumber, and that they are digits
	var subid = form_obj.subjectid.value;
	var dna = form_obj.dnano.value;
	if(
		(subid == "" && dna == "")//must have one
		||
		!validate_id(subid, maxlengthdnano)
		||
		!validate_id(dna, maxlengthsubjectid)
		)
	{
		alert("Please enter either a valid subject ID number or valid DNA number")
		return false;
	}
	//check primers
	if(!validate_primer(form_obj.primerf.value) || !validate_primer(form_obj.primerr.value))
	{
		alert("Please input sensible primer sequences or leave blank");
		return false;
	}
	return true;
}

