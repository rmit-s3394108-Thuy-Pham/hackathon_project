
// User set simulation parameter via one of the 'set all' methods
function _update_all(obj){
  var droptext = document.getElementById("dropbtn").innerHTML;

  var i = 1;
  while (droptext[droptext.length - i] != " "){
    i++;
  }

  var index = droptext.substr(droptext.length - i, droptext.length);

  // When user sets all coupling values


  if (obj.matches("#all_cpl_label")){
    var cpl_txt = document.getElementById("all_cpl");
    obj.innerHTML = "Coupling = "
    cpl_txt.style.visibility = "visible";
    cpl_txt.focus();
    // obj.style.visibility = "hidden"
  }

  else if (obj.matches("#all_cpl")){
    if (obj.value == ""){
      obj.value = 0;
    }
    else{
      for (i = 0; i < index - 1; i++){
        var el = document.getElementById("couple_label" + i);
        el.innerHTML = "C(" + i + "," + (i + 1) + ") = " + obj.value;
      }

      var cpl_txt_label = document.getElementById("all_cpl_label");
      cpl_txt_label.innerHTML = "Coupling between waveguides: " + obj.value + " (per mm)";
      cpl_txt_label.style.visible = "visible";
      obj.style.visibility = "hidden";

      _process_from_checkbox();
    }
  }

  // When user equalizes the beta.

  else if (obj.matches("#all_beta_label")) {
    obj.innerHTML = "All propagation constants set to: ";

    var beta_txt = document.getElementById("all_beta");
    beta_txt.style.visibility = "visible";
    beta_txt.focus();
  }

  else if (obj.matches("#all_beta")){
    for (i = 0; i < index; i++){
      var el = document.getElementById("beta_label" + i);
      el.innerHTML = "B(" + i + ") = " + obj.value;
    }

    document.getElementById("all_beta_label").innerHTML = document.getElementById("all_beta_label").innerHTML + obj.value;
    obj.style.visibility = "hidden";

    _process_from_checkbox()

  }

  else if (obj.matches("#wg_len_label")){
    obj.innerHTML = "Length of Waveguides (mm): ";
    document.getElementById("wg_len").style.visibility = "visible";
    document.getElementById("wg_len").focus();
  }

  else if (obj.matches("#wg_len")){
    document.getElementById("wg_len_label").innerHTML = document.getElementById("wg_len_label").innerHTML + obj.value;
    obj.style.visibility = "hidden";

    _process_from_checkbox();

  }
}

// User pressed a photon (unknown number of waveguides).
  //  This function determines number of waveguides then calls get_input_data
function _process_from_checkbox(){
  var done = 0;
  var i = 0;
  while (done == 0){
    if (document.getElementById('coupling' + i) == null){
        done = i + 1;
    }
    i++;
  }
  get_input_data(done);
}


// Collects all the user variables and passes to server for simulation.
  // Also handles some of the contents of variable displays
function get_input_data(wg_num){
  // console.log(wg_num);
  var beta = new Array(wg_num);
  var coupling = new Array(wg_num - 1);
  var photons = new Array(wg_num);

  var length = document.getElementById("wg_len");
  if (length.value.length == 0){
    var struct_length = 30;
  }
  else {
    var struct_length = length.value;
  }

  var num_photons = 0;
  for (var i = 0; i < wg_num; i++){

    if (document.getElementById("all_beta").value.length > 0) {
      beta[i] = document.getElementById("all_beta").value;

      var element = document.getElementById('wg_slider' + i);
      element.value = beta[i];

      var label = document.getElementById("beta_label" + i);
      label.innerHTML = "B(" + (i) + ") = " + beta[i];


    }
    else{
      var element = document.getElementById('wg_slider' + i);
      beta[i] = element.value;

      var label = document.getElementById("beta_label" + i);
      label.innerHTML = "B(" + (i) + ") = " + beta[i];
    }

    if (i < wg_num - 1 && (document.getElementById("all_cpl").value.length > 0)) {
      if (document.getElementById("all_cpl").value == "" || document.getElementById("all_cpl").value == null){
        document.getElementById("all_cpl").value = 0;
      }
      coupling[i] = document.getElementById("all_cpl").value;

      el = document.getElementById("coupling" + i);
      el.value = coupling[i];

      var label = document.getElementById("couple_label" + i);
      label.innerHTML = "C(" + (i) + "," + (i + 1) + ") = " + document.getElementById("all_cpl").value;
    }
    else if (i < wg_num - 1){
      element = document.getElementById('coupling' + i);
      coupling[i] = element.value;

      var label = document.getElementById("couple_label" + i);
      label.innerHTML = "C(" + (i) + "," + (i + 1) + ") = " + element.value;
    }

    element = document.getElementById('checkbox' + i)
    if (element.checked == true){
      photons[i] = 1;
      num_photons++;
    }
    else{
      photons[i] = 0;
    }

  }

  if (num_photons == 0){
    $.notify(
          "Select which waveguide(s) have photon(s) [check checkbox(es)].",
          {
            position:"top",
            className: "info"
          }
        );
    // alert("Select which waveguides have photons! (checkboxes)");
  }
  else if ((wg_num > 5 && num_photons > 5) || (wg_num > 6 && num_photons > 4)){
      $.notify(
            "That simulation is clasically intractable!",
            {
              position:"top",
              className: "info"
            }
          );
    // if (wg_num )
  }
    else{
    $.ajax({
      type: "GET",
      async: true,
      contentType: "application/json; charset=utf-8",
      url: "/_simulate",
      data: {
        length:struct_length,
        coupling:coupling,
        beta:beta,
        photons:photons
      },
      success: function (data) {

// Sample from http://chimera.labs.oreilly.com/books/1230000000345/ch06.html#_the_new_chart
        // console.log('data', data);

          if (num_photons == 1){
            // console.log("Show the propagations and histogram plots.");
            var prop_plot = "";
            var breaker = "_unique_breaker_";
            var hist_plot = "";
            var break_index = data.search(breaker);

            // Get propagation plot data
            prop_plot = data.slice(break_index + breaker.length, data.length);
            document.getElementById('prop_plot').setAttribute('src', 'data:image/png;base64,' + prop_plot + '');
            document.getElementById('prop_plot').style.display = "inline";

            // Get histogram  data
            // hist_plot = data.slice(break_index + breaker.length, data.length);
            // document.getElementById('hist_plot_sp').setAttribute('src', 'data:image/png;base64,' + hist_plot + '');
            // document.getElementById('hist_plot_sp').style.display = "inline";

            // Update visible results
            document.getElementById('corr_plot').style.display = "none";
            // document.getElementById('hist_plot').style.display = "none";

            hist_data = data.slice(0, break_index);
            // console.log("hist data", hist_data);

            var break_points = [];
            for (var i = 1; i < hist_data.length; i++){
              if (data[i] == ",") {break_points.push(i);}
            }

            var dataset = [];
            dataset.push(data.slice(1, break_points[0]))
            var max_val = parseFloat(dataset[0]);
            // console.log("initial max_val", max_val);

            for (var j = 1; j < break_points.length; j++){
              dataset.push(hist_data.slice(break_points[j - 1] + 1, break_points[j]));
              // console.log("parseFloat(dataset[j])", parseFloat(dataset[j]))
              if (parseFloat(dataset[j]) > max_val){
                max_val = parseFloat(dataset[j])
              }
            }
            dataset.push(hist_data.slice(break_points[break_points.length - 1] + 1, hist_data.length - 1));
            if (parseFloat(dataset[dataset.length - 1]) > max_val){
              max_val = parseFloat(dataset[dataset.length - 1])
            }

            d3.select("svg").remove();
            _generate_SVG(dataset, max_val, num_photons, wg_num, 0, 1);
          }


        else if (num_photons == 2) {
          // console.log("Show correlation matrix and histogram plots.")
          document.getElementById('prop_plot').style.display = "none";

          var corr_plot = "";
          var breaker = "_unique_breaker_";
          var hist_plot = "";
          var break_index = data.search(breaker);

          var axis_breaker = "__axis__";
          var axis_index = data.search(axis_breaker);
          // console.log("data.slice(break_index + breaker.length, axis_breaker);", data.slice(break_index + breaker.length, axis_breaker));

          corr_plot = data.slice(break_index + breaker.length, axis_index);
          document.getElementById('corr_plot').setAttribute('src', 'data:image/png;base64,' + corr_plot + '');
          document.getElementById('corr_plot').style.display = "inline";

          // console.log("data:\n", data);
          var axis = data.slice(axis_index + axis_breaker.length, data.length);
          // console.log("axis\n", axis, "\n\n");

          var final_axis = []
          for (var k = 0; k < axis.length; k++){
            var axis_val = ""
            if (axis[k] == "'"){
              k++;
              while (axis[k] != "'"){
                axis_val = axis_val + axis[k];
                k++;
              }
              final_axis.push(axis_val);
            }
          }

          hist_data = data.slice(0, break_index - 1);
          var break_points = [];
          for (var i = 1; i < hist_data.length; i++){
            if (data[i] == ",") {break_points.push(i);}
          }

          var dataset = [];
          dataset.push(data.slice(1, break_points[0]))
          var max_val = parseFloat(dataset[0]);
          for (var j = 1; j < break_points.length; j++){
            dataset.push(parseFloat(hist_data.slice(break_points[j - 1] + 1, break_points[j])));
            if (parseFloat(dataset[j]) > max_val){
              max_val = parseFloat(dataset[j])
            }
          }
          dataset.push(parseFloat(hist_data.slice(break_points[break_points.length - 1] + 1, hist_data.length)));
          if (parseFloat(dataset[j]) > max_val){
            max_val = parseFloat(dataset[j])
          }
          d3.select("svg").remove();

          _generate_SVG(dataset, max_val, num_photons, wg_num, final_axis, 0);

        }

        else {

          // console.log(data);
          // console.log("start");

          document.getElementById('prop_plot').style.display = "none";
          document.getElementById('corr_plot').style.display = "none";

          var axis_breaker = "__axis__";
          var axis_index = data.search(axis_breaker);
          var axis = data.slice(axis_index + axis_breaker.length, data.length);
          // console.log("axis\n", axis, "\n\n");

          var break_points = [];
          for (var i = 1; i < data.length; i++){
            if (data[i] == ",") {break_points.push(i);}
            // else if (data[i]=="_"){break};
          }

          hist_data = data.slice(0, axis_index);
          // console.log('hist_data', hist_data);

          var dataset = [];
          dataset.push(parseFloat(data.slice(1, break_points[0])))
          var max_val = parseFloat(dataset[0]);
          for (var j = 1; j < break_points.length; j++){
            var nxt_slice = hist_data.slice(break_points[j - 1] + 1, break_points[j]);
            if (nxt_slice != ""){
              dataset.push(parseFloat(nxt_slice));

              if (parseFloat(dataset[j]) > max_val){
                max_val = parseFloat(dataset[j]);
              }
            }
          }

          d3.select("svg").remove();


          var final_axis = []
          for (var k = 0; k < axis.length; k++){
            var axis_val = ""
            if (axis[k] == "'"){
              k++;
              while (axis[k] != "'"){
                axis_val = axis_val + axis[k];
                k++;
              }
              final_axis.push(axis_val);
            }
          }
          console.log("finish");

          _generate_SVG(dataset, max_val, num_photons, wg_num, final_axis, 0);
        }
     },
     dataType: "html"
   });
 }
}



function _generate_SVG(dataset, max_val, num_photons, num_wgs, axis, inline){


  // console.log("axis", axis);


  // console.log("received max_val", max_val);

  document.getElementById("page_title").innerHTML = "";

  //Width and height of SVG
  var w = $(window).width()/2
  var h = 68 * dataset.length
  if (h > 300){
    h = $(window).height()/3.5
    // h = 300;
    if (inline == 1){
      // console.log("here.");
      h = 250;
    }
  }


  var barPadding = 1;

  var x_axis_pad = 25;
  var y_axis_pad = 30;

  if (inline == 1){

    // console.log('dataset', dataset)

    // document.getElementById("prop_plot").setAttribute("style", "height: " + (h + 100 + 4 * x_axis_pad) +  "px;");

    // h = 300;

    // w = w - 30;

    // h = h - 3 * x_axis_pad

    var axis_scale = d3.scale.linear()
          .domain([0, max_val + 0.1 * max_val])
          .range([0, w]);

    var x_axis = d3.svg.axis()
          .scale(axis_scale);

// Clear any existing graph
    d3.select("svg").remove();

// Create new svg
    var svg = d3.select(".inline_results")
          .append("svg")
          .attr("width", w + 30)
          .attr("height", h + 3 * x_axis_pad)
          .attr("fill", "navy")
          .attr("id", "result_svg_inline");

// The bars of the graph
  svg.selectAll("rect")
         .data(dataset)
         .enter()
         .append("rect")
         .attr("x", 30)
         .attr("height", ((h - x_axis_pad) / dataset.length) - barPadding)

         .attr("y", function(d, i) {
            return i * ((h - x_axis_pad) / dataset.length) + x_axis_pad;
         })

        .text(function(d, i){return i;})

        .attr("width", function(d) {
          return ((d * w) * (max_val + 0.1 * max_val)) / (max_val + 0.1 * max_val) ** 2;
         });


// The textboxes holding probability values (within waveguides)
  svg.selectAll(".wg_prob_lbl")
        .data(dataset)
        .enter()
        .append("text")
        .attr("class", "wg_prob_lbl")
        .attr("fill", "grey")
        .attr("x", (w/2) + 30)
        .attr("y", function(d, i) {
          var dist = (i * ((h - x_axis_pad) / dataset.length)) + x_axis_pad;
          return dist + 0.5 * (h / dataset.length);
         })
         .attr("height",  (w - x_axis_pad / dataset.length) - barPadding)
         .text(function(d, i){
           if (((h - x_axis_pad) / dataset.length) - barPadding < 14){return;}
           return "P(" + i + ") = " + parseFloat(d).toFixed(4);
         })

         .attr("width", 30);

// The y_axis labels (waveguide numbers)
   svg.selectAll(".y_axis_lbls")
          .data(dataset)
          .enter()
          .append("text")
          .attr("class", "y_axis_lbls")
          .attr("x", 0)
          .attr("y", function(d, i) {
            var dist = (i * ((h - x_axis_pad) / dataset.length)) + x_axis_pad;
            return dist + 0.5 * (h / dataset.length);
           })
           .attr("height",  (w / dataset.length) - barPadding)
           .text(function(d, i){
            //  console.log(i);
             if (i == 0){ return "0";}
             return i;
           })
           .attr("width", 30);

// The y-axis title
   svg.selectAll(".y_axis_lbl")
          .data(dataset)
          .enter()
          .append("text")
          .attr("class", "y_axis_lbl")
          .attr("x", (w/2) - 30)
          .attr("y", h + 1.3 * x_axis_pad)
          //  .attr("height",  (w / dataset.length) - barPadding)
           .text(function(d, i){
             if (i == dataset.length - 1){
               return "Probability P(x)";
             }
           })
           .attr("fill", "black")
           .attr("width", 50);

// The x-axis
     svg.append("g")
          .attr("class", "x_axis")
          .attr("transform", "translate(30," + parseInt(h)  + ")")
          .call(x_axis);

// Plot Title
    svg.append("text")
        .attr("x", (w / 2) + 1.5 * y_axis_pad)
        .attr("y", 0.5 * x_axis_pad)
        .attr("text-anchor", "middle")
        // .attr("fill", "black")
        .style("font-size", "16px")
        // .style("text-decoration", "underline")
        .text("Photon Detection Probabilities");

  }
  else{
    // Scale/domain of y-axis
    pad_top = 75;

    w = w -  2 * y_axis_pad

    x_axis_pad = 30;
    y_axis_pad = 50;

    var axis_scale = d3.scale.linear()
          .domain([1.1 * max_val, 0])
          .range([x_axis_pad + pad_top, h + pad_top]);

    // Axis object
    var y_axis = d3.svg.axis()
          .orient("left")
          .scale(axis_scale);

    var w = 0.9 * $(window).width()

    // Function for scaling data/setting height of rects
    var y = d3.scale.linear()
              .domain([1.1 * max_val, 0])
              .range([h - x_axis_pad, 0]);


    if (((w - 2 * y_axis_pad - pad_top) / dataset.length) - barPadding < 0){
      $.notify(
            "There are too many results to fit in the plot!",
            {
              position:"top",
              className: "info"
            }
          );
          return;
        // break;
      }

// Clear any existing graph
    d3.select("svg").remove();

// Create result SVG
    var svg = d3.select(".results")
          .append("svg")
          .attr("width", w + 2 * y_axis_pad)
          .attr("height", h + 4 * x_axis_pad)
          .attr("fill", "navy")
          .attr("id", "result_svg");

// The columns of the graph
    svg.selectAll("rect")
  			   .data(dataset)
  			   .enter()
  			   .append("rect")
  			   .attr("x", function(d, i) {
  			   		return i * (w / dataset.length) + (2 * y_axis_pad);
  			   })
           .attr("width", function(d, i){
             if (((w - 2 * y_axis_pad - pad_top) / dataset.length) - barPadding < 0){
               return 0;
             }
             return ((w - 2 * y_axis_pad - pad_top) / dataset.length) - barPadding
           })

  			   .attr("y", function(d) {
             if (h - y(d) < 0 || isNaN(h - y(d))){
               return 0;
             }
             return h - y(d) + pad_top;
  			   })

  			   .attr("height", function(d) {
             if (y(d) < 0 || isNaN(y(d))){
               return 0;
             }
             return y(d);
          })

          .on('click', function(d, i){
            // console.log("hey");
          })
          .on('mouseover', function(d, i){
            this.style.fill = "DarkRed";
            var val = d;
            var c = i;

            svg.select('#onhover_label')
                  .attr("style", "visibility: visible")
                  .text(function(d, i){
                    // console.log(val);
                    if (c == 0){
                      return "P(0, 0) = " + parseFloat(val).toFixed(4);}

                    return "P" + axis[c] + " = " + val.toFixed(4);
                  });

          })
          .on('mouseout', function(d, i){
            svg.select('#onhover_label')
                  .attr("style", "visibility: hidden");
                  // .text("P" + axis[i] + " = " + d + "%");

            this.style.fill = "navy";
          });

// Each x-axis tick value (waveguide numbers)
      svg.selectAll(".x_axis_lbls")
             .data(dataset)
             .enter()
             .append("text")
             .attr("class", "x_axis_lbls")
             .attr("id", function(d, i){
               return "x_label" + i;
             })
             .attr("x", function(d, i) {
               var pos = i * (w / dataset.length) + 2 * y_axis_pad;
               return pos + (((w - 2 * y_axis_pad - pad_top) / dataset.length) - barPadding)/2;
    			   })
             .attr("y", function(d) {
               return h + .5 * x_axis_pad + pad_top
              })

              .attr("height",  15)
              .attr("width", ((w - 2 * y_axis_pad + pad_top) / dataset.length) - barPadding)
              .attr("fill", "black")

              .style("text-anchor", "middle")

              .text(function(d, i){
                // console.log("((w - 2 * y_axis_pad) / dataset.length) - barPadding", ((w - 2 * y_axis_pad) / dataset.length) - barPadding)
                if (((w - 2 * y_axis_pad) / dataset.length) - barPadding < 30){
                  return;
                }
                return axis[i];
              });

// x-axis title
      svg.selectAll(".x_axis_lbl")
             .data(dataset)
             .enter()
             .append("text")
             .attr("class", "x_axis_lbl")
             .attr("x", w/2)

             .attr("y", function(d) {
               if (((w - 2 * y_axis_pad) / dataset.length) - barPadding < 30){
                 return h + .5 * x_axis_pad + pad_top;
               }
               return h + x_axis_pad + pad_top
              })

              .attr("height",  15)

              .text(function(d, i){
                if (i == dataset.length - 1){
                  return "Output Waveguides"
                }
              })
              .attr("fill", "black")
              .attr("width", 30);

// y-axis itself
      svg.append("g")
              .attr("class", "y_axis")
              .attr("transform", "translate(" + 2 * y_axis_pad + ", 0)")
              // .attr("height", h - x_axis_pad)
              .call(y_axis);

// y-axis title
      svg.append("text")
              .attr("class", "y_axis_txt")
              .attr('x', 0 - h/2 - pad_top)
              .attr('y', 0.8 * y_axis_pad)
              .attr("transform", "rotate(-90)")
              .style("text-anchor", "middle")
              .text("Probability of finding photons P(x)");

// Text element for displaying probability of waveguide under mouse
      svg.append("text")
              .attr("id", "onhover_label")
              .attr("style", "visibility: hidden")
              // .attr("x", w/2)
              .attr("x", (w / 2) + 1.5 * y_axis_pad)
              .attr("y",  h/2.5)
              .attr("height", 50)
              .attr("width", 100)
              .attr("text-anchor", "middle")

              .style("font-size", "16px")
              .style("text-decoration", "bold")
              // .text("hey")

              .attr("fill", "grey");

// Plot Title
        svg.append("text")
            .attr("x", (w / 2) + 1.5 * y_axis_pad)
            .attr("y", 0.5 * pad_top)
            .attr("text-anchor", "middle")
            .attr("fill", "black")
            .attr("dy", "0em")
            .style("font-size", "18px")
            // .style("text-decoration", "underline")
            .text("Quantum Walk Results")

        svg.append("text")
            // .attr("text-anchor", "middle")
            .attr("x", (w / 2) + 1.5 * y_axis_pad)
            .attr("y", 0.7 * pad_top)
            .attr("text-anchor", "middle")
            .text("Number of Photons: " + num_photons + ", Number of Waveguides: " + num_wgs);

  }

}
