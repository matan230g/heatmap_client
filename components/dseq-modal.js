const axios = require('axios')
const plotly = require ("plotly.js-dist");
const { Parser } = require('json2csv');
const {API_URL} = require('./index')
const {drawmap} = require('./drawmap');
const { validate, existingValidation } = require('./forms');

var hiddenInput=true;
var heatMapNumber;

document.getElementById('href-instructions1').addEventListener('click', navgiateToInstructions);
document.getElementById('href-parameters1').addEventListener('click', navgiateToParameters);

document.getElementById('href-instructions2').addEventListener('click', navgiateToInstructions);
document.getElementById('href-parameters2').addEventListener('click', navgiateToParameters);

document.getElementById('href-instructions3').addEventListener('click', navgiateToInstructions);
document.getElementById('href-parameters3').addEventListener('click', navgiateToParameters);

document.getElementById("deseq-button1").addEventListener('click',()=>{
  heatMapNumber=1
})

document.getElementById("deseq-button2").addEventListener('click',()=>{
  heatMapNumber=2
})

//For one heatmap
document.getElementById("deseq-button3").addEventListener('click',()=>{
  heatMapNumber=3
})


document.getElementById('dseq_files1').addEventListener('click', function(e) { 
    uploadDeseqFiles(e)},false);
    
document.getElementById('dseq_files2').addEventListener('click', function(e) { 
  uploadDeseqFiles(e)},false);

  document.getElementById('dseq_files3').addEventListener('click', function(e) { 
    uploadDeseqFiles(e)},false);

document.getElementById('dseq_analysys1').addEventListener('click',function(e) {
    runAnalysis(e)},false);

document.getElementById('dseq_analysys2').addEventListener('click',function(e) {
    runAnalysis(e)},false);

document.getElementById('dseq_analysys3').addEventListener('click',function(e) {
    runAnalysis(e)},false);

document.getElementById('dseq_analysys-download1').addEventListener('click',function(e) {
    download_deseq_result(e)},false);

document.getElementById('dseq_analysys-download2').addEventListener('click',function(e) {
    download_deseq_result(e)},false);

document.getElementById('dseq_analysys-download3').addEventListener('click',function(e) {
    download_deseq_result(e)},false);

document.getElementById('deseq_plot1').addEventListener('click',function(e) {
    plotDseq(e)},false);

document.getElementById('deseq_plot2').addEventListener('click',function(e) {
    plotDseq(e)},false);
  
document.getElementById('deseq_plot3').addEventListener('click',function(e) {
    plotDseq(e)},false);

// filtering Heatmaps 
document.getElementById('filter-map1').addEventListener('click', function(e) { 
  filter_heatmaps(e,'1')},false);

document.getElementById('filter-map2').addEventListener('click', function(e) { 
  filter_heatmaps(e,'2')},false);

document.getElementById('filter-map3').addEventListener('click', function(e) { 
  filter_heatmaps(e,'3')},false);
  

function filter_heatmaps(e,side){
  e.preventDefault();
  heatMapNumber = side;
  values = createFilterValues()


  axios.get(API_URL+'deseq/filter_heatmap',{
      params:{'side' :side, 'values':values
    } ,
      headers: {
        'content-Type': 'multipart/form-data',
        "Access-Control-Allow-Origin": "*",
        "uuid":localStorage.getItem('uuid')
      }
      }).then((response) => {
        json_data = JSON.parse(response.data['plot']);
        heatmap_data = response.data.heatmap;
        let inchlibTarget = 'inchlib'+side;
        if (side==3){
          inchlibTarget = "inchlib"
        }
        drawmap(heatmap_data,inchlibTarget)
        create_volcano_plot(json_data,side);
    })
    .catch(error => {
      let error_message = error.response.data.message;
      var para = document.createElement("p");            
          para.innerText = error_message;
          para.style.color="red"
          document.getElementById("dseqAnalysForm"+heatMapNumber).appendChild(para);
          setTimeout(() => {
              para.remove();
          },6000)
    })
}



    
function navgiateToInstructions(){
    document.getElementById("deseq_instructions"+heatMapNumber).style.display="block";
    document.getElementById("deseq_parameters"+heatMapNumber).style.display="none";
}

function navgiateToParameters(){
    document.getElementById("deseq_instructions"+heatMapNumber).style.display="none";
    document.getElementById("deseq_parameters"+heatMapNumber).style.display="block";
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
        let design_file= document.getElementById("design_matrix_input"+heatMapNumber).files[0]
        if (check_file_type(design_file.name) == false){
          var para = document.createElement("p");          
            para.innerText = "file type must be csv";
            para.style.color="red"
            document.getElementById("dseqForm"+heatMapNumber).appendChild(para);
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
              "Access-Control-Allow-Origin": "*",
              "uuid":localStorage.getItem('uuid')
              
            }
            }).then((response) => {
                imagePath = "https://icons.iconarchive.com/icons/custom-icon-design/flatastic-9/512/Accept-icon.png"
                $('#dseqForm'+heatMapNumber).append(`<img id="green" src=${imagePath} style="width:25px;"></img>`); 
                $( "#dseq_analysys"+heatMapNumber ).prop( "disabled", false );
          })
          .catch(error => {
            initAnaylsysValues()
            let error_message = error.response.data.message;  
            var para = document.createElement("p");          
            para.innerText = error_message;
            para.style.color="red"
            document.getElementById("dseqForm"+heatMapNumber).appendChild(para);
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

  $('#green2'+heatMapNumber).remove();
  $('#spinner-analysis'+heatMapNumber).attr('hidden',false);
  $("#dseq_analysys-download"+heatMapNumber).attr('hidden',true);
    let formData = new FormData();
    e.preventDefault();
    formData.append("side",heatMapNumber);
    axios.post(API_URL+'deseq/run_deseq', formData, {
        headers: {
          'content-Type': 'multipart/form-data',
          "Access-Control-Allow-Origin": "*"
        }
        }).then((response) => {
          $('#spinner-analysis'+heatMapNumber).attr('hidden',true);
          imagePath2 = "https://icons.iconarchive.com/icons/custom-icon-design/flatastic-9/512/Accept-icon.png"
          $('#dseqAnalysForm'+heatMapNumber).append(`<img id="green2" src=${imagePath2} style="width:25px;"></img>`); 
          $("#dseq_analysys"+heatMapNumber).prop("disabled",false)
          $("#dseq_analysys-download"+heatMapNumber).attr('hidden',false);
          $("#dseq_plot"+heatMapNumber).prop( "disabled", false )
      })
      .catch(error => {
        $('#spinner-analysis'+heatMapNumber).attr('hidden',true);
        let error_message = error.response.data.message;
        var para = document.createElement("p");            
            para.innerText = error_message;
            para.style.color="red"
            document.getElementById("dseqAnalysForm"+heatMapNumber).appendChild(para);
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
          "Access-Control-Allow-Origin": "*",
          "uuid":localStorage.getItem('uuid')
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
            document.getElementById("dseqAnalysForm"+heatMapNumber).appendChild(para);
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
    $('#spinner-plot'+heatMapNumber).attr('hidden',false);

    let formData = new FormData();
    if(!hiddenInput){
        formData.append('files', document.getElementById("dseq-anlysis-input"+heatMapNumber).files[0]);
    }
    x_column = document.getElementById("x-column-select"+heatMapNumber).value
    x_operation= document.getElementById("x-operation-select"+heatMapNumber).value
    x_treshold= document.getElementById("x-treshold"+heatMapNumber).value
    y_column = document.getElementById("y-column-select"+heatMapNumber).value
    y_operation= document.getElementById("y-operation-select"+heatMapNumber).value
    y_treshold = document.getElementById('y-treshold'+heatMapNumber).value
  

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
          "Access-Control-Allow-Origin": "*",
          "uuid":localStorage.getItem('uuid')
        }
        }).then((response) => {
          create_volcano_plot(response.data,heatMapNumber);
          $('#spinner-plot'+heatMapNumber).attr('hidden',true);
          $('#deseqModal'+heatMapNumber).modal('toggle');
      })
      .catch(error => {
        $('#spinner-plot'+heatMapNumber).attr('hidden',true);
        let error_message = error.response.data.message;            
        setErrorMessage(error_message)
      })
    }

function initAnaylsysValues(){
    $('#green2').remove();
    $("#dseq_analysys"+heatMapNumber).prop("disabled",true)
    $("#dseq_analysys-download"+heatMapNumber).attr('hidden',true);
    $("#count-matrix-select"+heatMapNumber +" option").remove();
    $("#design-matrix-select1"+heatMapNumber + " option").remove();
}

function create_volcano_plot(plot,side){
  let id = side == 1 ? "plot1" : side == 2 ? "plot2" : "plot" 
  let filter;
  if ( side==1 ){
    filter= "#filter-first-dseq";
  }
  else if( side == 2){
    filter= "#filter-second-dseq";
  }
  else{
    filter=  "#filter-third-dseq";
  }
  let vp_data = plot['data'];
  console.log(vp_data)
  setCheckBoxes(vp_data);
  let vp_layout = plot['layout'];
  plotly.newPlot(id,vp_data,vp_layout)
  $(filter).show()
}

function createFilterValues(){
  res=""
  if(document.getElementById('high'+heatMapNumber).checked){
  res = res+"High,"
  }
  if(document.getElementById('low'+heatMapNumber).checked){
    res = res+"Low,"
    }
    if(document.getElementById('normal'+heatMapNumber).checked){
      res = res+"Normal"
      }

      return res;

}


function setErrorMessage(msg){
  if(msg.includes("Missing")){
    msg="Anaylsys result missing. Please Run Analysis first."
  }
  var para = document.createElement("p");
  para.innerText = msg;
  para.style.color="red"
  document.getElementById("dseqPlotForm"+heatMapNumber).appendChild(para);
  setTimeout(() => {
     para.remove();
  },6000)
}

function setCheckBoxes(vp_data){
  vp_data.forEach(element => {
    console.log("color:" + element.legendgroup)
    if(element.legendgroup === "High"){
      $("#high-checkbox"+heatMapNumber).show()
    }
    if(element.legendgroup === "Normal"){
      $("#normal-checkbox"+heatMapNumber).show()
    }
    if(element.legendgroup === "Low"){
      $("#low-checkbox"+heatMapNumber).show()
    }
  });

  
    
}