const axios = require('axios');
const { API_URL } = require('.');
const {drawmapAfterManipulate} = require('./drawmap')

var wichTableWorkOn;
var clusterManipluate;
document.getElementById('preprocess1').addEventListener('click',(e) =>{
    wichTableWorkOn="first_second"
},false)


document.getElementById('preprocess2').addEventListener('click',(e) =>{
    wichTableWorkOn="second_first"
},false)


document.getElementById('mainuplate-data').addEventListener('click',(e) =>{
    $(function () {
        $('#exampleModal').modal('toggle');
     });
     if(wichTableWorkOn=="second_first"){
         $("#inchlib1").hide()
         $("spinner-map1").show()
     }
     else{
        $("#inchlib2").hide()
        $("spinner-map2").show()
     }
    dataManipulate();
},false)


document.getElementById('target-clust-select-manipul').addEventListener('change',changeSelectClusterManipulate)


function dataManipulate(){

    let properties = {}
    let checkIfBoth = document.getElementById('target-clust-select-manipul').value
    let checkIfCompress = document.getElementById("choose-compress-manipulate").checked;
    let action = document.getElementById('action').value
    let linkage1 = document.getElementById('linkage-select-manipulate').value
    let distance1 = document.getElementById('distance-select2-manipulate').value
    let values = getAllValues(wichTableWorkOn ==="first_second" ? "table-connect-1to2" :"table-connect-2to1" )
    properties['data_work_on'] = wichTableWorkOn;
    properties['metadata'] = 0;
    properties['action'] = (action+"").toLowerCase()
    properties['raw_linkage'] = linkage1
    properties['raw_distance'] = distance1
    

    if(checkIfBoth==='Both'){
        properties['both1'] = 1;
        properties['column_linkage'] = document.getElementById('linkage-select-column-manipulate').value
        properties['column_distance'] = document.getElementById('distance-select-column2-manipulate').value
    }
    else{
        properties['both1'] = 0;
    }

    if(checkIfCompress){
        properties['compress1'] = 1;
        properties['compressed_number'] = document.getElementById('compressed-number-manipulate').value
        properties['compressed_value'] = document.getElementById('compressed-value-manipulate').value
    }
    else{
        properties['compress1'] = 0;
    }

    properties['values'] = values

    sendToServer(properties)
}



function sendToServer(properties){
    let map;
    if(properties['data_work_on']=='first_second')
        map="inchlib2"
    else
        map="inchlib1"

    axios.post(API_URL+'actions/'+properties['action'], properties, {
      headers: {
        'content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        "uuid":localStorage.getItem('uuid')
      }
      }).then((response) => {
        if(map=="inchlib2"){
            $("#inchlib2").show()
            $("spinner-map2").show()
        }
        else{
            $("#inchlib1").show()
            $("spinner-map1").show()
        }
        drawmapAfterManipulate(response.data,map)
    }, (error) => {
      errormessage = error.response.data['detail']
      if(map=="inchlib2"){
        console.log('errormessage',errormessage)
        alert(`Map creation failed, too little data after ${properties['action']}`)
        $("#inchlib2").show()
        $("spinner-map2").show()
        // $( `<p style="color:red" id="action_error">${errormessage}</p>` ).insertAfter( "#bt1" );
        // setTimeout(() => $("#action_error").remove(),3000)
      }
      else{
        console.log('errormessage',errormessage)
        alert(`Map creation failed, too little data after ${properties['action']}`)
        $("#inchlib1").show()
        $("spinner-map1").show()
        // $( `<p style="color:red" id="action_error">${errormessage}</p>` ).insertAfter( "#bt2" );
        // setTimeout(() => $("#action_error").remove(),3000)
      }
    });

}


function changeSelectClusterManipulate(event){

    if(event.target.value === 'Both'){
        document.getElementById('mir-linkage-column-manipulate').style.display='block'
        document.getElementById('tgt-distance-column-manipulate').style.display='block'
    }
    else{
        document.getElementById('mir-linkage-column-manipulate').style.display='none'
        document.getElementById('distance-select-column2-manipulate').style.display='none'
    }   


}


function getAllValues(tableName){
    let array = []

    table = document.getElementById(tableName);
    for(var i=1; i<table.rows.length; i++){
        array.push(table.rows[i].cells[0].textContent)
    }      

     return array;
}