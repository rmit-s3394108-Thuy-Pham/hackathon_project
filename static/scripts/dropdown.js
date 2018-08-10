$(document).ready(function(){
// https://notifyjs.com/
  // $.notify(
  //       "Welcome to the Quantum Walker\n A Quantum walk simulator.",
  //       {
  //         position:"top",
  //         className: "info",
  //         autoHide: "false"
  //       }
  //     );
  // alert("Select which waveguides have photons! (checkboxes)");
});

function wg_num_select() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function clear_dropdown(){
  var dropdowns = document.getElementsByClassName("dropdown-content");
  var i;
  for (i = 0; i < dropdowns.length; i++) {
    var openDropdown = dropdowns[i];
    if (openDropdown.classList.contains('show')) {
      var txt = document.getElementById("wg_text");
      // openDropdown.removeChild(txt);
      openDropdown.classList.remove('show');
    }
  }
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementById("myDropdown")
    var openDropdown = dropdowns[i];
    var txt = document.getElementById("wg_text");

    if (txt != null){
      openDropdown.removeChild(txt);
    }

    var textfield = document.createElement("input");
    textfield.setAttribute("value", "other");
    textfield.setAttribute('id', 'wg_text');

    textfield.addEventListener('change', function(){
      if (this.value != "other"){
        clear_dropdown();
        load_num_wgs(this.value);
      }
    })
    dropdowns.appendChild(textfield);
  }

  // If the user clicked on the 'other' field, cleaer the 'other' text
  else if (event.target.matches('#wg_text')) {
    var textfield = document.getElementById("wg_text");
    textfield.setAttribute('value', '');
  }

  // Hide drop button elements when clicking elsewhere
  else if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        var txt = document.getElementById("wg_text");
        openDropdown.removeChild(txt);
        openDropdown.classList.remove('show');
      }
    }
  }


  if (event.target.matches(".p_cell")){
    // console.log("here");
    console.log(event);
  }

  // Clear value of waveguide length input on click
  if (event.target.matches('#wg_len')){
    var el = document.getElementById('wg_len');
    el.setAttribute('value', '');
    el.value = "";
  }

  // Clear value of all coupling input on click
  if (event.target.matches('#all_cpl')){
    var el = document.getElementById('all_cpl');
    el.setAttribute('value', '');
    el.value = "";
  }

  // Clear value of equalize propagaion input on click
  if (event.target.matches('#all_beta')){
    var el = document.getElementById('all_beta');
    el.setAttribute('value', '');
    el.value = "";
  }


  // When user clicks to update the coupling value
  if (event.target.matches('.couple_label')){
    var para = document.getElementsByClassName("cpl_para");
    var el = event.path[0];

    var el_id = event.path[0].id;

    // Ascertain which coupling was clicked
    var i = 1;
    while(el_id[el_id.length - i] != "l"){
      i++;
    }
    i--;

    var id_no = el_id.substr(el_id.length - i, el_id.length);

    // Grab respective text box
    var couple_txt = document.getElementById("couple_txt" + id_no);

    var i = parseInt(id_no);

    // Update the label content
    el.innerHTML = "C(" + i + "," + (i + 1) + ") = ";

    if (el.style.visibility != 'hidden'){
      couple_txt.style.visibility = 'visible';
      couple_txt.focus();
    }

    // Reset value of all coupling input such that labels will update correctly
    el = document.getElementById("all_cpl");
    el.value = "";

  }
}
