
const axios = require('axios');
const { API_URL } = require('.');

var command;
var values=[]

document.getElementById('preprocess1').addEventListener('click',function(){
    command='1'
},false);

document.getElementById('preprocess2').addEventListener('click',function(){
    command='2'
},false);



document.getElementById('generate_preprocess').addEventListener('click',function(){
    if(command==='1')
        tableName='table-connect-1to2'
    else
        tableName='table-connect-2to1'

    var action = document.getElementById('action-for-pre').value
    var cluster = document.getElementById('cluster-for-pre').value
    command = action + command;

    command = command.toLowerCase();
    
    
    extractData(tableName,cluster)
    $('#exampleModal').modal('hide');

    command = ""
    values=[]
},false);


//docs union1 - the result should be the target from data 2
//docs union2 - the result should be the target from data 1

//docs interesction1 - the result should be the target from data 2
//docs interesction2 - the result should be the target from data 

function extractData(table,cluster){
    var tableElemt = document.getElementById(table)

    //insert all values to json obj
    for(var j=1;j<tableElemt.rows.length;j++){
        var obj = { 
            name: tableElemt.rows[j].cells[0].innerText
        };
        values.push(obj);
    }
    


    switch(command) {
        case 'union1':
          callServer('union',cluster)
          break;
        case 'union2':
          callServer('union',cluster)
          break;
        case 'intersection1':
          callServer('intersection',cluster)
            break;
        case 'intersection2':
          callServer('intersection',cluster)
        default:
      }


}    


    function callServer(endpoint,cluster){
        axios.post(API_URL+'actions/'+endpoint, {
            data: values,
            type: command.toLowerCase(),
            cluster: cluster.toLowerCase()
        } 
            ).then((response) => {
                values=[]
          }, (error) => {
            values=[]
          });
          values=[]
    }
   


