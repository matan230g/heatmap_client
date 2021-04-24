const axios = require('axios')
const plotly = require ("plotly.js-dist");
const { Parser } = require('json2csv');
const {API_URL} = require('./index')
const {drawmap} = require('./drawmap')

var hiddenInput=true;
var heatMapNumber;

document.getElementById('href-instructions').addEventListener('click', navgiateToInstructions);
document.getElementById('href-parameters').addEventListener('click', navgiateToParameters);

document.getElementById("deseq-button1").addEventListener('click',()=>{
  heatMapNumber=1
})

document.getElementById("deseq-button2").addEventListener('click',()=>{
  heatMapNumber=2
})

//For one heatmap
document.getElementById("deseq-button").addEventListener('click',()=>{
  heatMapNumber=3
})


document.getElementById('dseq_files').addEventListener('click', function(e) { 
    uploadDeseqFiles(e)},false);

document.getElementById('dseq_analysys').addEventListener('click',function(e) {
    runAnalysis(e)},false);

document.getElementById('dseq_analysys-download').addEventListener('click',function(e) {
    download_deseq_result(e)},false);

document.getElementById('deseq_plot').addEventListener('click',function(e) {
    plotDseq(e)},false);

// filtering Heatmaps 
document.getElementById('filter-map1').addEventListener('click', function(e) { 
  filter_heatmaps(e,'1')},false);

document.getElementById('filter-map2').addEventListener('click', function(e) { 
  filter_heatmaps(e,'2')},false);

document.getElementById('filter-map').addEventListener('click', function(e) { 
  filter_heatmaps(e,'3')},false);

function filter_heatmaps(e,side){
  e.preventDefault();
  axios.get(API_URL+'deseq/filter_heatmap',{
      params:{'side' :side} ,
      headers: {
        'content-Type': 'multipart/form-data',
        "Access-Control-Allow-Origin": "*"
      }
      }).then((response) => {
        json_data = JSON.parse(response.data['plot']);
        heatmap_data = response.data.heatmap;
        inchlibTarget = side===3 ? "inchlib" : 'inchlib'+side; 
        drawmap(heatmap_data,inchlibTarget)
        create_volcano_plot(json_data,side);
    })
    .catch(error => {
      let error_message = error.response.data.message;
      var para = document.createElement("p");            
          para.innerText = error_message;
          para.style.color="red"
          document.getElementById("dseqAnalysForm").appendChild(para);
          setTimeout(() => {
              para.remove();
          },6000)
    })
}



    
function navgiateToInstructions(){
    document.getElementById("deseq_instructions").style.display="block";
    document.getElementById("deseq_parameters").style.display="none";
}

function navgiateToParameters(){
    document.getElementById("deseq_instructions").style.display="none";
    document.getElementById("deseq_parameters").style.display="block";
}

function check_file_type(file_name){
  if (file_name.endsWith('.csv')){
    return true
  }
  return false
}

function uploadDeseqFiles(e){
        e.preventDefault();
        $('#green').remove();
        files =["design_matrix_input"]
        let formData = new FormData();
        let design_file= document.getElementById("design_matrix_input").files[0]
        if (check_file_type(design_file.name) == false){
          var para = document.createElement("p");          
            para.innerText = "file type must be csv";
            para.style.color="red"
            document.getElementById("dseqForm").appendChild(para);
            setTimeout(() => {
                para.remove();
            },6000)
            return
        }
        formData.append('files',design_file);
        formData.append("side",heatMapNumber);
        axios.post(API_URL+'deseq/upload_data', formData, {
            headers: {
              'content-Type': 'multipart/form-data',
              "Access-Control-Allow-Origin": "*"
            }
            }).then((response) => {
                imagePath = "https://icons.iconarchive.com/icons/custom-icon-design/flatastic-9/512/Accept-icon.png"
                $('#dseqForm').append(`<img id="green" src=${imagePath} style="width:25px;"></img>`); 
                $( "#dseq_analysys" ).prop( "disabled", false );
          })
          .catch(error => {
            initAnaylsysValues()
            let error_message = error.response.data.message;  
            var para = document.createElement("p");          
            para.innerText = error_message;
            para.style.color="red"
            document.getElementById("dseqForm").appendChild(para);
            setTimeout(() => {
                para.remove();
            },6000)
          })
        }

function addValues(valuesArray,selectElem){
    valuesArray.sort()
    for(var i = 0; i<valuesArray.length; i++){
        selectElem.options[i] = new Option(valuesArray[i],valuesArray[i])
    }
}

function runAnalysis(e){

  $('#green2').remove();
  $('#spinner-analysis').attr('hidden',false);
  $("#dseq_analysys-download").attr('hidden',true);
    let formData = new FormData();
    e.preventDefault();
    formData.append("side",heatMapNumber);
    axios.post(API_URL+'deseq/run_deseq', formData, {
        headers: {
          'content-Type': 'multipart/form-data',
          "Access-Control-Allow-Origin": "*"
        }
        }).then((response) => {
          $('#spinner-analysis').attr('hidden',true);
          imagePath2 = "https://icons.iconarchive.com/icons/custom-icon-design/flatastic-9/512/Accept-icon.png"
          $('#dseqAnalysForm').append(`<img id="green2" src=${imagePath2} style="width:25px;"></img>`); 
          $("#dseq_analysys").prop("disabled",false)
          $("#dseq_analysys-download").attr('hidden',false);
          $("#dseq_plot").prop( "disabled", false )
      })
      .catch(error => {
        $('#spinner-analysis').attr('hidden',true);
        let error_message = error.response.data.message;
        var para = document.createElement("p");            
            para.innerText = error_message;
            para.style.color="red"
            document.getElementById("dseqAnalysForm").appendChild(para);
            setTimeout(() => {
                para.remove();
            },6000)
      })
}

function download_deseq_result(e){
    e.preventDefault();

    axios.get(API_URL+'deseq/get_deseq_result',{
        params:{'side' :heatMapNumber} ,
        headers: {
          'content-Type': 'multipart/form-data',
          "Access-Control-Allow-Origin": "*"
        }
        }).then((response) => {
          csv_data = json2csv(response.data);
          const csvBlob = new Blob([csv_data],{type: "text/csv"});
          const blobUrl = URL.createObjectURL(csvBlob);
          const anchorElement = document.createElement("a");
          anchorElement.href = blobUrl;
          anchorElement.download = "deseq_result" + String(heatMapNumber)+".csv"
          anchorElement.click();
          setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
          },600)
      })
      .catch(error => {
        let error_message = error.response.data.message;
        var para = document.createElement("p");            
            para.innerText = error_message;
            para.style.color="red"
            document.getElementById("dseqAnalysForm").appendChild(para);
            setTimeout(() => {
                para.remove();
            },6000)
      })
}

function json2csv(data){
    json_data = JSON.parse(data);
    const json2csvparser = new Parser();
    const csv = json2csvparser.parse(json_data)
    return csv
}

function plotDseq(e){
    e.preventDefault();
    let formData = new FormData();
    if(!hiddenInput){
        formData.append('files', document.getElementById("dseq-anlysis-input").files[0]);
    }
    x_column = document.getElementById("x-column-select").value
    x_operation= document.getElementById("x-operation-select").value
    x_treshold= document.getElementById("x-treshold").value
    y_column = document.getElementById("y-column-select").value
    y_operation= document.getElementById("y-operation-select").value
    y_treshold = document.getElementById('y-treshold').value

    formData.append("x_column",x_column);
    formData.append("x_th",x_treshold);
    formData.append("x_operation",x_operation);
    formData.append("y_column",y_column);
    formData.append("y_th",y_treshold);
    formData.append("y_operation",y_operation);
    formData.append('side',heatMapNumber);

    axios.post(API_URL+'deseq/volcano_plot_deseq', formData, {
        headers: {
          'content-Type': 'multipart/form-data',
          "Access-Control-Allow-Origin": "*"
        }
        }).then((response) => {
          create_volcano_plot(response.data,heatMapNumber);
          $('#deseqModal').modal('toggle');
      })
      .catch(error => {
        let error_message = error.response.data.message;
        var para = document.createElement("p");            
        para.innerText = error_message;
        para.style.color="red"
        document.getElementById("dseqPlotForm").appendChild(para);
        setTimeout(() => {
            para.remove();
        },6000)
      })
    }

function initAnaylsysValues(){
    $('#green2').remove();
    $("#dseq_analysys").prop("disabled",true)
    $("#dseq_analysys-download").attr('hidden',true);
    $("#count-matrix-select option").remove();
    $("#design-matrix-select option").remove();
}

function create_volcano_plot(plot,side){
  let id = side == 1 ? "plot1" : side == 2 ? "plot2" : "plot" 
  let filter;
  if ( side==1 ){
    filter= "#filter-map1";
  }
  else if( side == 2){
    filter= "#filter-map2";
  }
  else{
    filter=  "#filter-map";
  }
  let vp_data = plot['data'];
  let vp_layout = plot['layout'];
  plotly.newPlot(id,vp_data,vp_layout)
  $(filter).show()
}