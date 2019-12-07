onload = () => {
    var taskInput=document.getElementById("new-task");
    var addButton=document.getElementsByTagName("button")[0];
    var incompleteTaskHolder=document.getElementById("incomplete-tasks");
    var shrinkButton = document.getElementById("shrink");
    var linksButton = document.getElementById("links");

    var deleteTask=function(){
		console.log("Delete Task...");
		var listItem=this.parentNode;
		var ul=listItem.parentNode;
		//Remove the parent list item from the ul.
		ul.removeChild(listItem);
    };

    var createNewTaskElement=function(taskString){
        var listItem=document.createElement("li");
        var label=document.createElement("label");//label
        var deleteButton=document.createElement("button");//delete button
        label.innerText=taskString;
        deleteButton.innerText="Delete";
        deleteButton.className="delete";
        deleteButton.onclick=deleteTask;
        listItem.appendChild(label);
        listItem.appendChild(deleteButton);
        return listItem;
    };


    var addTask= function(e) {
        e.preventDefault();
        console.log("Add Task...");
        //Create a new list item with the text from the #new-task:
        var listItem=createNewTaskElement(taskInput.value);
        incompleteTaskHolder.appendChild(listItem);
        taskInput.value="";
    };

    var shrinkLinks = async function(e) {
        e.preventDefault();
        console.log('Shrink Links');
        let response = await fetch('/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                urls: getURLs()
            })
        });
        let data = await response.json();
        console.table(data);
        let url = `${location.origin}/open?aliasLink=${data.data.aliasLink}&passCode=${data.data.genPassCode}`;
        linksButton.innerHTML = `<button><a href="${url}" style="    text-decoration: none;">${url}</a></button>`;
    }

    addButton.addEventListener("click",addTask);
    shrinkButton.addEventListener("click", shrinkLinks);
}

function getURLs() {
    let urls = [];
    let elements = document.querySelectorAll('ul > li > label');
    for(let val of elements) {
       urls.push(val.innerHTML);
    }
    return urls;
}
