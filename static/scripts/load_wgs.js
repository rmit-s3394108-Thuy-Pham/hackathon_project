function load_num_wgs(wg_num){
  // Update button with number of waveguides selected.
  var drop_box = document.getElementById('dropbtn');
  drop_box.innerHTML= "Number of waveguides: " + wg_num;

  var div_to_fill = document.getElementById('waveguides');
  // Remove any existing waveguides
  clear_div(div_to_fill);

  var i;
  div_to_fill.appendChild(document.createElement("br"));
  // div_to_fill.appendChild(document.createElement("hr"));

  // Generate the waveguide sliders, and respective elements.
  for(i = 0; i < wg_num; i++){
    var para = document.createElement("p");
    var label = document.createElement("label");
    label.setAttribute("id", "wg_num_label");
    label.innerHTML = "" + i + "     ";
    para.appendChild(label);

    chk_box = document.createElement("input");
    chk_box.setAttribute('id', 'checkbox' + i);
    chk_box.setAttribute('type', 'checkbox');
    chk_box.setAttribute("class", "photon_checkbox");
    chk_box.setAttribute('name', 'photon_checkbox');
    chk_box.addEventListener('click', function(){_process_from_checkbox()});
    para.appendChild(chk_box);

    var pad_label = document.createElement("label");
    pad_label.setAttribute("id", "pad_label");
    para.appendChild(pad_label);

    var beta_slider = document.createElement("input");
    beta_slider.setAttribute('id', 'wg_slider' + i, 'type', 'text', 'data-slider-id', 'ex1Slider', 'data-slider-min', '0', 'data-slider-value', '14');
    beta_slider.setAttribute('data-slider-max', '50');
    beta_slider.setAttribute('data-slider-step', '1');
    beta_slider.setAttribute('data-slider-value', '0');
    beta_slider.setAttribute('class', 'wg_slider');

    para.setAttribute('class', 'comb_input');
    para.appendChild(beta_slider);

    var pad_label = document.createElement("label");
    pad_label.setAttribute("id", "beta_label" + i);
    pad_label.setAttribute("class", "beta_label");
    pad_label.innerHTML = "B(" + i + ") = 0"

    para.appendChild(pad_label);

    div_to_fill.appendChild(para);

    if (i != wg_num - 1){
      div_to_fill.appendChild(document.createElement("br"));
      div_to_fill.appendChild(document.createElement("br"));
      div_to_fill.appendChild(document.createElement("br"));
    }

  }

  // Formatting sliders
  for(i = 0; i < wg_num; i++){
    var para = document.createElement("p");
    var slider = new Slider('#wg_slider'+i, {
      formatter: function(value) {
        return 'Beta = ' + value;
      }
    });

    // Perform a simulation when the value changes on the slider.
    var originalVal;
    var newVal;
    slider.on("slideStop", function(value){
      newVal = value;
      if (originalVal != newVal){
        get_input_data(wg_num)};
      });

    slider.on("change", function(event){
      var txt = document.getElementsByClassName("couple_txt");
      // console.log('txt', txt.length);
      for (var i = 0; i < txt.length; i++){
        txt[i].style.visibility = "hidden"
      }

      // if (txt.id != none){
        // txt.style.visibility = 'hidden';
      // }

      if (event.newValue != document.getElementById("all_beta")){
        document.getElementById("all_beta").value = "";
      }

      if (event.oldValue != event.newValue && event.newValue == newVal){
        get_input_data(wg_num);
      }
    });
  };

  div_to_fill = document.getElementById('coupling');
  clear_div(div_to_fill);

  // Orinigal Sliders
  for(i = 0; i < wg_num - 1; i++){
    para = document.createElement("p");

    var coupling_slider = document.createElement("input");
    coupling_slider.setAttribute("id", "coupling" + i, 'type', 'text', 'data-slider-step', '4');
    coupling_slider.setAttribute('data-slider-orientation', 'vertical');
    // coupling_slider.setAttribute('data-slider-step', '4');
    coupling_slider.setAttribute('data-slider-min', '0');
    coupling_slider.setAttribute('data-slider-max', '20');
    coupling_slider.setAttribute('data-slider-value', '10');
    coupling_slider.setAttribute('class', 'cpl_slider');

    para.setAttribute('class', 'cpl_para');
    para.appendChild(coupling_slider);

    var couple_label = document.createElement("label");
    couple_label.setAttribute("id", "couple_label" + i);
    couple_label.setAttribute("class", "couple_label");
    couple_label.innerHTML = "C(" + (i) + "," + (i + 1) + ") = 10";
    para.appendChild(couple_label);


    var couple_txt = document.createElement("input");
    couple_txt.setAttribute("id", "couple_txt" + i);
    couple_txt.setAttribute("class", "couple_txt");
    couple_txt.style.visibility = 'hidden';

    couple_txt.addEventListener('change', function(){
      var index_str = this.id;
      var i = 1;
      while(this.id[this.id.length - i] != "t"){
        i++;
      }
      i--;

      var index = this.id.substr(this.id.length - i, this.id.length);
      // console.log('index', index);

      var couple_slider = document.getElementById("coupling" + index);
      var couple_label = document.getElementById("couple_label" + index);

      couple_slider.value = this.value;

      couple_label.innerHTML = "C(" + (index) + "," + (index + 1) + ") = " + couple_slider.value;

      this.style.visibility = "hidden";
      couple_label.style.visibility = "visible";

      _process_from_checkbox();

    })
    couple_txt.addEventListener('blur', function(){
      var index_str = this.id;
      var i = 1;
      while(this.id[this.id.length - i] != "t"){
        i++;
      }
      i--;

      var index = this.id.substr(this.id.length - i, this.id.length);

      var couple_slider = document.getElementById("coupling" + index);
      var couple_label = document.getElementById("couple_label" + index);

      if (this.value == null){
        this.value = 0;
        couple_slider.value = this.value;
      }

      index = parseInt(index);
      couple_label.innerHTML = "C(" + (index) + "," + (index + 1) + ") = " + couple_slider.value;

      this.style.visibility = "hidden";
      couple_label.style.visibility = "visible";

    })

    para.appendChild(couple_txt)
    div_to_fill.appendChild(para);
  }

  for(i = 0; i < wg_num - 1; i++){
    var para = document.createElement("p");
    var slider = new Slider('#coupling'+i, {
      reversed : true,
    })

    // Detect any time this slider is changed
    var originalVal;
    var newVal;
    slider.on("slideStop", function(value){
      newVal = value;
      if (originalVal != newVal){
        get_input_data(wg_num)};
      });

    slider.on("change", function(event){
      var txt = document.getElementsByClassName("couple_txt");
      // console.log('txt', txt.length);
      for (var i = 0; i < txt.length; i++){
        txt[i].style.visibility = "hidden"
      }

      // if (event.newValue != document.getElementById("all_cpl").value){
       document.getElementById("all_cpl").value = "";
       document.getElementById("all_cpl_label").innerHTML = "Set All Coupling (per mm)";
      // }

      if (event.oldValue != event.newValue && event.newValue == newVal){
        get_input_data(wg_num);
      }
    });
  };


  // Set the visibility of unique parameter settings/setters
  var all = document.getElementById("wg_len_label");
  all.style.visibility = "visible";

  // var all = document.getElementById("wg_len")
  // all.style.visibility = "visible";

  all = document.getElementById("all_cpl_label");
  all.style.visibility = "visible";

  all = document.getElementById("all_beta_label");
  all.style.visibility = "visible";
}


function _reset_input(obj){
  if (obj.value == null || obj.value == ""){
    if (obj.id == "all_cpl"){
      obj.style.visibility = "hidden";
      obj.value = "";
      document.getElementById("all_cpl_label").innerHTML = "Set All Coupling (per mm)";
      obj.style.visibility = "hidden";
    }
    else if (obj.id == "all_beta"){
      document.getElementById("all_beta_label").innerHTML = "Reset Propagations Constants";
      obj.value = "";
      obj.style.visibility = "hidden";
    }
    else if (obj.id == "wg_len"){
      document.getElementById("wg_len_label").innerHTML = "Length of Waveguides (mm) = 2.1"
      obj.value = "";
      obj.style.visibility = "hidden";
    }

  }
  else{
    obj.value = obj.value;
  }
}


function clear_div(div_to_clear){
  while(div_to_clear.firstChild){
    div_to_clear.removeChild(div_to_clear.firstChild);
  }
}
