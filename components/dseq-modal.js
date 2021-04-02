const axios = require('axios')
const plotly = require ("plotly.js-dist");
const { Parser } = require('json2csv');
const {API_URL} = require('./index')


var hiddenInput=true;

document.getElementById('href-instructions').addEventListener('click', navgiateToInstructions);
document.getElementById('href-parameters').addEventListener('click', navgiateToParameters);

document.getElementById("dseq-user-file").addEventListener('click', function(e){
    $("#user-analysis-input").attr('hidden',!hiddenInput);
    hiddenInput=!hiddenInput
});

document.getElementById('dseq_files').addEventListener('click', function(e) { 
    uploadDseqFiles(e)},false);

document.getElementById('dseq_analysys').addEventListener('click',function(e) {
    runAnalysis(e)},false);

document.getElementById('dseq_analysys-download').addEventListener('click',function(e) {
    download_deseq_result(e)},false);

document.getElementById('deseq_plot').addEventListener('click',function(e) {
    plotDseq(e)},false);
    
function navgiateToInstructions(){
    document.getElementById("deseq_instructions").style.display="block";
    document.getElementById("deseq_parameters").style.display="none";
}

function navgiateToParameters(){
    document.getElementById("deseq_instructions").style.display="none";
    document.getElementById("deseq_parameters").style.display="block";
}

function uploadDseqFiles(e){
        e.preventDefault();
        $('#green').remove();

        files =["count_matrix_data_input","design_matrix_input"]
        let formData = new FormData();

        formData.append('files', document.getElementById("count_matrix_input").files[0]);
        formData.append('files', document.getElementById("design_matrix_input").files[0]);
        console.log(formData)

        axios.post(API_URL+'deseq/upload_data', formData, {
            headers: {
              'content-Type': 'multipart/form-data',
              "Access-Control-Allow-Origin": "*"
            }
            }).then((response) => {
                imagePath = "https://icons.iconarchive.com/icons/custom-icon-design/flatastic-9/512/Accept-icon.png"
                $('#dseqForm').append(`<img id="green" src=${imagePath} style="width:25px;"></img>`); 
                
                $("#count-matrix-select option").remove();
                countMatrixDropDown = document.getElementById('count-matrix-select');
                addValues(response.data.count_values,countMatrixDropDown)
                $("#design-matrix-select option").remove();
                designMatrixDropDown = document.getElementById('design-matrix-select');
                addValues(response.data.design_values,designMatrixDropDown)
                $( "#dseq_analysys" ).prop( "disabled", false );
          })
          .catch(error => {
            initAnaylsysValues()  
            var para = document.createElement("p");          
            para.innerText = "*Some Error occured. Check your files";
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
    count_matrix_id = document.getElementById("count-matrix-select").value
    design_matrix_id = document.getElementById("design-matrix-select").value

    formData.append("count_matrix_id",count_matrix_id);
    formData.append("design_matrix_id",design_matrix_id);
    axios.post(API_URL+'deseq/run_deseq', formData, {
        headers: {
          'content-Type': 'multipart/form-data',
          "Access-Control-Allow-Origin": "*"
        }
        }).then((response) => {
          //csv_data = json2csv(response.data);
          $('#spinner-analysis').attr('hidden',true);
          imagePath2 = "https://icons.iconarchive.com/icons/custom-icon-design/flatastic-9/512/Accept-icon.png"
          $('#dseqAnalysForm').append(`<img id="green2" src=${imagePath2} style="width:25px;"></img>`); 
          $("#dseq_analysys").prop("disabled",false)
          $("#dseq_analysys-download").attr('hidden',false);
          $("#dseq_plot").prop( "disabled", false )
      })
      .catch(error => {
        var para = document.createElement("p");            
            para.innerText = "*Some Error occured. Check your files";
            para.style.color="red"
            document.getElementById("dseqAnalysForm").appendChild(para);
            setTimeout(() => {
                para.remove();
            },6000)
      })
}

function download_deseq_result(e){
    e.preventDefault();
    console.log("download data");
    axios.get(API_URL+'deseq/get_deseq_result',{
        headers: {
          'content-Type': 'multipart/form-data',
          "Access-Control-Allow-Origin": "*"
        }
        }).then((response) => {
          console.log(response.data); 
          csv_data = json2csv(response.data);
          const csvBlob = new Blob([csv_data],{type: "text/csv"});
          const blobUrl = URL.createObjectURL(csvBlob);
          const anchorElement = document.createElement("a");
          anchorElement.href = blobUrl;
          anchorElement.download = "deseq_result.csv"
          anchorElement.click();
          setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
          },600)
      })
      .catch(error => {
        var para = document.createElement("p");            
            para.innerText = "*Some Error occured. Check your files";
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

    axios.post(API_URL+'deseq/volcano_plot_deseq', formData, {
        headers: {
          'content-Type': 'multipart/form-data',
          "Access-Control-Allow-Origin": "*"
        }
        }).then((response) => {
          create_volcano_plot(response.data);
          $('#deseqModal').modal('toggle');
      })
      .catch(error => {
        var para = document.createElement("p");            
        para.innerText = "*Some Error occured. Check your input params";
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