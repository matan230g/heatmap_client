const axios = require('axios')
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
    dataManipulate();
},false)


document.getElementById('target-clust-select-manipul').addEventListener('change',changeSelectClusterManipulate)




function dataManipulate(){

    let properties = {}
    let checkIfBoth = document.getElementById('target-clust-select-manipul').value
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
    properties['values'] = values

    sendToServer(properties)

}



function sendToServer(properties){
    let map;
    if(properties['data_work_on']=='first_second')
        map="inchlib2"
    else
        map="inchlib1"

    axios.post('http://127.0.0.1:8000/actions/'+properties['action'], properties, {
      headers: {
        'content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        "uuid":localStorage.getItem('uuid')
      }
      }).then((response) => {
        drawmapAfterManipulate(response.data,map)
    }, (error) => {
      errormessage = error.response.data['detail']
      if(map="inchlib2"){
        $( `<p style="color:red" id="action_error">${errormessage}</p>` ).insertAfter( "#ml1" );
        setTimeout(() => $("#action_error").remove(),3000)
      }
      else{
        $( `<p style="color:red" id="action_error">${errormessage}</p>` ).insertAfter( "#ml2" );
        setTimeout(() => $("#action_error").remove(),3000)
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
    console.log(tableName)
    let array = []

    table = document.getElementById(tableName);
    for(var i=1; i<table.rows.length; i++){
        array.push(table.rows[i].cells[0].textContent)
    }      

     return array;
}