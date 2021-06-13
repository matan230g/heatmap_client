
/* function for Table of mir and gene */
var idSet = new Set()
export function initTable(table){
    idSet= new Set();
    table.innerHTML=`<thead>
    <tr class="table-info">
        <th>miRNA</th>
        <th>Gene Target</th>
        <th>Action</th>
    </tr>
    </thead>`;
}

export function addMir(id, idMap){
    if(idMap==='inchlib1' ||idMap==='inchlib' ){// add mir only if the mir map was clicked
        var table = document.getElementById("table-connect-1to2")
        var length = document.getElementById("table-connect-1to2").rows.length;
        var connection_kind= "connect_1to2";
    }
    else{
        var table = document.getElementById("table-connect-2to1")
        var length = document.getElementById("table-connect-2to1").rows.length;
        var connection_kind= "connect_2to1";

    }
        id.forEach(element => {
            if(!idSet.has(element)){
            idSet.add(element)
            var newRow = table.insertRow(length)
            newRow.insertCell(0).innerText=element
            var element_getDetailes= element+"-getDetailes-"+connection_kind;
            newRow.insertCell(1).innerHTML=`<button id=${element_getDetailes}  type='button' >Click here</button>`;
            newRow.insertCell(2).innerHTML=`<i id=${element} style="color:red;"class="fas fa-trash-alt"></i>`;
            document.getElementById(element).addEventListener('click', function deleteId(event){
                var td = event.target.parentNode; 
                var tr = td.parentNode; // the row to be removed
                tr.parentNode.removeChild(tr);
                idSet.delete(element);
            });
            document.getElementById(element_getDetailes).addEventListener('click', targetConnection);
            length++;

            }
        });  
}


function targetConnection(event){
    var td = event.target.parentNode; 
    var Left_element = td.children[0].id;
    var Left_element_array = Left_element.split('-');
    var element_deatils=Left_element_array[0];
    let connection_kind=Left_element_array[2];

    let connection_list = document.getElementById("connection_list");

    if(connection_kind==="connect_1to2")
        show_connections('first_second_connections', element_deatils,connection_list)
    else
        show_connections('second_first_connections', element_deatils,connection_list)
    

    $('#connection-dialog').modal('show');
}

function show_connections(connections_from_localStorage_name, element_deatils, connection_list){
    let connections_from_localStorage = localStorage.getItem(connections_from_localStorage_name);
    let dict= JSON.parse(connections_from_localStorage);
    if (dict[element_deatils]== undefined || dict[element_deatils].length == 0)
        connection_list.textContent= 'There are no suitable connections'; 
    else
        connection_list.textContent=dict[element_deatils]; 
}

