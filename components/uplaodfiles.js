const axios = require('axios')
const {drawmap} = require('./drawmap')
const {drawmap2} = require('./drawmap')
const {validate} =require('./forms')
const {existingValidation} =require('./forms')
const {cleanConnectionTables} = require('./drawmap')
const {API_URL} = require('./index')

  document.getElementById('myDefForm').addEventListener('submit', function(e) {
  var errorM = document.getElementById("error-message")
  e.preventDefault();
  const res = document.getElementById("checkbox-maps-choose").checked;
  if(!validate(res)){
    setTimeout(function(){ 
    errorM.classList.remove("error-m")
    errorM.innerHTML="&nbsp;"
    },3000)
    errorM.classList.add("error-m")
    errorM.innerText="* Some files are required"
    return false;
  }

  document.getElementById("spinner").style.display="block";
  if(res){
    uploadOneHeatMap();
  }
  else{
    upload2HeatMaps()

  }
},false);


document.getElementById('loadSettings').addEventListener('submit', function(e) {
  var errorM = document.getElementById("error-message-exists")
  e.preventDefault();
  const res = document.getElementById("map2-loading").checked;
  if(!existingValidation(res)){
    setTimeout(function(){ 
    errorM.classList.remove("error-m")
    errorM.innerHTML="&nbsp;"
    },3000)
    errorM.classList.add("error-m")
    errorM.innerText="* Some files are required"
    return false;
  }

  if(!res){
    uploadOneHeatMapExists();
  }
  else{
    upload2HeatMapsExists()

  }
},false)


function uploadOneHeatMapExists(){
  let map = document.getElementById('map1').files[0]
  let reader = new FileReader();

  reader.readAsText(map)
  readFile(reader,map,"inchlib","map");
}

function upload2HeatMapsExists(){
 let reader1 = new FileReader();
 let reader2 = new FileReader();
 let map1 = document.getElementById('map1').files[0]

 let map2 = document.getElementById('map2').files[0]

 reader1.readAsText(map1)
 readFile(reader1,"inchlib1","map1");

 reader2.readAsText(map2)
 readFile(reader2,"inchlib2","map2");
}

function readFile(reader,target,mapname){
  cleanConnectionTables();
    reader.onload = function() {
      var fileContent = reader.result;
      localStorage.setItem(mapname,fileContent)
      if(target=="inchlib"){
        drawmap(fileContent,target) 
      }
      else{
        if(target=="inchlib1"){
          drawmap(fileContent,target)
        }
        else{
          drawmap2(fileContent,target)
        } 
      }
    };
}


function uploadOneHeatMap(){

  let formData = new FormData();
  let properties = {}
  
  formData.append("files", document.getElementById('mirNA').files[0]);

  properties = propertiesFilePrepare('mirNA',"mirNA-metadata",'checkbox-meta-data1')

  if(properties['metadata'] == 1) 
    formData.append("files", document.getElementById('mirNA-metadata').files[0])

  properties['raw_distance'] = document.getElementById('distance-select').value
  properties['raw_linkage'] = document.getElementById('linkage-select').value
  properties['both1']=0
  properties['compress1']=0

  if(document.getElementById("miRNA-clust-select").value == "Both"){
    properties['both1']=1
    properties['column_distance'] = document.getElementById('distance-select-column').value
    properties['column_linkage'] = document.getElementById('linkage-select-column').value
  }
  if(document.getElementById("choose-compress").value == "Yes"){
    properties['compress1']=1
    properties['compressed_number'] = document.getElementById('compressed-number').value
    properties['compressed_value'] = document.getElementById('compressed-value').value
  }

  formData.append("files", JSON.stringify(properties));

   axios.post(API_URL+'actions/uploadone', formData, {
      headers: {
        'content-Type': 'multipart/form-data',
        "Access-Control-Allow-Origin": "*"
      }
      }).then((response) => {
        cleanConnectionTables();
        localStorage.setItem("map1",response.data)
        if(localStorage.getItem("map2")){
          localStorage.removeItem("map2")
        }
        drawmap(response.data,"inchlib")
        $('#one_maps_show').show()
        $('#two_maps_show').hide()
        $('#buttons').show()
        $('html, body').animate({ scrollTop: 0 }, 'fast');
    }, (error) => {
      document.getElementById("spinner").style.display="none";
          let errormessage = error.response.data['detail']
          $('#error-message').html(errormessage);
          $('#error-message').addClass("error-m");
          setTimeout(() => $("#error-message").html("&nbsp;"),6000)
    });
}

function upload2HeatMaps(){
  let formData = new FormData();

  let properties = {}
  let propertiesSecond = {}

  formData.append("files", document.getElementById('mirNA').files[0]);
 
  properties = propertiesFilePrepare('mirNA',"mirNA-metadata",'checkbox-meta-data1')
  // console.log('propertiessss:' , properties)
  if(properties['metadata'] == 1) 
    formData.append("files", document.getElementById('mirNA-metadata').files[0])


  // Second Map

  formData.append("files", document.getElementById('target').files[0]);

  propertiesSecond = propertiesFilePrepare('target','target-metadata','checkbox-meta-data2')
  // console.log('propertiesSecond:' , propertiesSecond)

  if(propertiesSecond['metadata'] == 1) 
    formData.append("files", document.getElementById('target-metadata').files[0])


  //Connections
  formData.append("files", document.getElementById('connection').files[0])

  properties['file2'] = propertiesSecond['file1']
  properties['metadata2'] = propertiesSecond['metadata']

  // Clustering

  properties['raw_distance'] = document.getElementById('distance-select').value
  properties['raw_linkage'] = document.getElementById('linkage-select').value
  properties['both1'] = 0
  properties['compress1']=0

  if(document.getElementById("miRNA-clust-select").value == "Both"){
    properties['both1']=1
    properties['column_distance'] = document.getElementById('distance-select-column').value
    properties['column_linkage'] = document.getElementById('linkage-select-column').value
  }

  if(document.getElementById("choose-compress").value == "Yes"){
    properties['compress1']=1
    properties['compressed_number'] = document.getElementById('compressed-number').value
    properties['compressed_value'] = document.getElementById('compressed-value').value
  }

  properties['raw_distance2'] = document.getElementById('distance-select').value
  properties['raw_linkage2'] = document.getElementById('linkage-select').value
  properties['both2'] = 0
  properties['compress2']=0

  if(document.getElementById("target-clust-select").value == "Both"){
    properties['both2'] = 1
    properties['column_distance2'] = document.getElementById('distance-select-column2').value
    properties['column_linkage2'] = document.getElementById('linkage-select-column2').value
  }
  if(document.getElementById("choose-compress2").value == "Yes"){
    properties['compress2']=1
    properties['compressed_number2'] = document.getElementById('compressed-number2').value
    properties['compressed_value2'] = document.getElementById('compressed-value2').value
  }
  


  formData.append("files", JSON.stringify(properties));

  axios.post(API_URL+'actions/upload', formData, {
    headers: {
      'content-Type': 'multipart/form-data',
      "Access-Control-Allow-Origin": "*"
    }
    }).then((response) => {
      localStorage.setItem('uuid',response.headers.uuid)
      cleanConnectionTables();
      localStorage.setItem("map1",response.data.first)
      drawmap(response.data.first,"inchlib1");
      localStorage.setItem("map2",response.data.second)
      drawmap2(response.data.second,"inchlib2");
      $('#one_maps_show').hide()
      $('#two_maps_show').show()
      $('#buttons').show()
      var first_second_connections= response.data.first_second_connections;
      localStorage.setItem('first_second_connections',JSON.stringify(first_second_connections))

      var second_first_connections= response.data.second_first_connections;
      localStorage.setItem('second_first_connections',JSON.stringify(second_first_connections))
      $('html, body').animate({ scrollTop: 0 }, 'fast');
      }, (error) => {
          document.getElementById("spinner").style.display="none";
          let errormessage = error.response.data['detail']
          $('#error-message').html(errormessage);
          $('#error-message').addClass("error-m");
          setTimeout(() => $("#error-message").html("&nbsp;"),6000)
      });
}



function propertiesFilePrepare(id1,id2,id3){
  let properties= {}
  if(document.getElementById(id1).files[0] && document.getElementById(id2).files[0] && document.getElementById(id3).checked){
    properties ={
      file1:'1',
      metadata:'1'
    }
  }
else{
  properties = {
      file1:'1',
      metadata:'0'
  }
}
return properties
}