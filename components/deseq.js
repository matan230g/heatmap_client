const axios = require("axios");
const plotly = require ("plotly.js-dist");
const { Parser } = require('json2csv');
let count_matrix_file =""
let design_matrix_file=""
let volcano_plot_data=""
const api_host = process.env.API_HOST;


// document.getElementById('deseq-button').addEventListener('click',(e) =>{
//   $(function () {
//       $('#exampleModal').modal('toggle');
//    });
//   dataManipulate();
// },false)


document.getElementById('files_data_deseq').addEventListener('submit', function(e) {
    e.preventDefault();
    files =["count_matrix_data","design_matrix_data"]
    upload_data(files)
    count_matrix_file =document.getElementById("count_matrix_data").value; 
    design_matrix_file =document.getElementById("design_matrix_data").value; 
  },false);
  
function upload_data(elements){
    let formData = new FormData();
    for (let file in elements){
        formData.append('files', document.getElementById(elements[file]).files[0]);
    }
    axios.post(api_host+"deseq/upload_data", formData, {
        headers: {
          'content-Type': 'multipart/form-data',
          "Access-Control-Allow-Origin": "*"
        }
        }).then((response) => {
          window.alert(response.data['message']);
      })
      .catch(error => {
        console.log(error.response.data.message);
        window.alert(error.response.data['message']);
      })
}

document.getElementById('deseq_form').addEventListener('submit', function(e) {
  e.preventDefault();
  run_deseq_analysis();
},false);

function run_deseq_analysis(){
    let formData = new FormData();
    let elements = document.getElementById("deseq_form").elements
    count_matrix= elements.namedItem("count_matrix").value
    count_matrix_id = elements.namedItem("count_matrix_id").value
    design_matrix = elements.namedItem("design_matrix").value
    design_matrix_id = elements.namedItem("design_matrix_id").value
    formData.append("count_matrix",count_matrix);
    formData.append("count_matrix_id",count_matrix_id);
    formData.append("design_matrix",design_matrix);
    formData.append("design_matrix_id",design_matrix_id);
    axios.post(api_host+"deseq/run_deseq", formData, {
        headers: {
          'content-Type': 'multipart/form-data',
          "Access-Control-Allow-Origin": "*"
        }
        }).then((response) => {
          csv_data = json2csv(response.data);
      })
      .catch(error => {
        console.log(error.response.data['message']);
        window.alert(error.response.data['message']);
      })
}

function json2csv(data){
    const json2csvparser = new Parser();
    const csv = json2csvparser.parse(data)
    return csv
}



document.getElementById('volcano_form').addEventListener('submit', function(e) {
  e.preventDefault();
  deseq_volcano_plot()
},false);
function deseq_volcano_plot(){
    let formData = new FormData();
    let elements = document.getElementById("volcano_form").elements

    data_file= elements.namedItem('data_file').value
    x_column = elements.namedItem('x_column').value
    x_operation= elements.namedItem('x_operation').value
    x_threshold = elements.namedItem('x_threshold').value
    y_column = elements.namedItem('y_column').value
    y_operation= elements.namedItem('y_operation').value
    y_threshold = elements.namedItem('y_threshold').value

    formData.append("data_path",data_file);
    formData.append("x_column",x_column);
    formData.append("x_th",x_threshold);
    formData.append("x_operation",x_operation);
    formData.append("y_column",y_column);
    formData.append("y_th",y_threshold);
    formData.append("y_operation",y_operation);

    axios.post(api_host+"/deseq/volcano_plot_deseq", formData, {
        headers: {
          'content-Type': 'multipart/form-data',
          "Access-Control-Allow-Origin": "*"
        }
        }).then((response) => {
          create_volcano_plot(response.data);
      })
      .catch(error => {
        console.log(error.response.data.message);
        window.alert(error.response.data['message']);
      })
}



function create_volcano_plot(html){
  volcano_plot_data =html['data'];
  // var icon = 
  var config = {
    modeBarButtonsToAdd: [
      {
        name: 'download data',
        // icon: 'download_icon.png',
        click: function() {
          console.log(volcano_plot_data);
        }}
    ]};
  plotly.newPlot('plot',html['data'],html['layout'],config)
}




