const backendUrl = "https://taskify-backend-rho.vercel.app/"
window.ondragover = function (event) {
    event.preventDefault();
    event.stopPropagation();
}

window.drag = function (event) {
    console.log(`Dragging: ${event.target.id}`);
    event.dataTransfer.setData("div", event.target.id);
}

window.drop = async function (event) {
    event.preventDefault();
    event.stopPropagation();
    const data = event.dataTransfer.getData("div");
    if (event.target.id !== data && document.getElementById(data)) {
        try {
            event.target.appendChild(document.getElementById(data));
            console.log(`Element ${data} dropped into ${event.target.id}`);
        } catch (error) {
            console.error("Drop error:", error.message);
        }
        const droppedInto = event.target.id;
        const response  = await fetch("https://taskify-backend-rho.vercel.app/update", {
            method: "POST",
            headers: { "Content-Type": "application/json","authorization":localStorage.getItem("token") },
            body: JSON.stringify({
                boxid: data,
                targetId: droppedInto,
            }),
        })
        const res = await response.json()
        renderTodos(res.todos);
        renderInProgress(res.inProgress);
        renderUnderReview(res.underReview);
        renderFinished(res.finished);
        
    } else {
        console.error("Invalid drop target or source element not found");
    }
}

document.getElementById("signup").addEventListener("submit",async (e)=>{
    
    e.preventDefault()
    if(document.querySelector("#username-inp1").value == ""){
        alert("Username cannot be empty!!")
    }else if(document.querySelector("#password-inp1").value == ""){
        alert("Password cannot be empty!!")
    }else{
        const username = document.querySelector("#username-inp1").value
        const password = document.querySelector("#password-inp1").value
        const response = await fetch("https://taskify-backend-rho.vercel.app/signup" ,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                "username":username,
                "password":password
            })
        })
        const res = await response.json()
        if(res.message == "user-already-exists"){
            document.getElementById("user-exists").innerHTML = "user already exists"
            document.getElementById("user-exists").style.display = "block"
        }else if(res.message == "incorrect-format"){
            document.getElementById("user-exists").innerHTML = "username/password are less than 3 letters"
            document.getElementById("user-exists").style.display = "block"
        }else if(res.message == "user-added-succesfully"){
            sessionStorage.setItem("page","in")
            document.getElementById("signup-page").style.display = "none"
            document.getElementById("signin-page").style.display = "block"
            document.getElementById("signin-msg").style.display = "block"
        }

    }


})

document.getElementById("signin").addEventListener("submit",async (e)=>{
    e.preventDefault()
    if(document.querySelector("#username-inp2").value == ""){
        alert("Username cannot be empty!!")
    }else if(document.querySelector("#password-inp2").value == ""){
        alert("Password cannot be empty!!")
    }else{
        const username = document.querySelector("#username-inp2").value
        const password = document.querySelector("#password-inp2").value
        const response = await fetch("https://taskify-backend-rho.vercel.app/signin" ,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                "username":username,
                "password":password
            })
        })
        const resData = await response.json()
        
        if(resData.message == "user-not-found"){
            document.getElementById("signin-msg").style.display = "block"
            document.getElementById("signin-msg").innerHTML = "user not found"
            document.getElementById("signin-msg").style.color = "#FA6363"
        }else{
            sessionStorage.setItem("page","todo")
            localStorage.setItem("token",resData.token)
            document.getElementById("signin-page").style.display = "none"
            document.getElementById("main-page").style.display = "block"
            location.reload()
        }

    }
})

document.getElementById("signin-rdr").addEventListener("click",(e)=>{
    e.preventDefault()
    sessionStorage.setItem("page","in")
    document.getElementById("signup-page").style.display = "none"
    document.getElementById("signin-page").style.display = "block"
})
document.getElementById("signup-rdr").addEventListener("click",(e)=>{
    e.preventDefault()
    sessionStorage.setItem("page","up")
    document.getElementById("user-exists").style.display = "none"
    document.getElementById("signin-page").style.display = "none"
    document.getElementById("signup-page").style.display = "block"
    
})


document.querySelector("#newtask").addEventListener("click", () =>{
    document.querySelector("#dialog").showModal()

})
document.querySelector("#close-dialog").addEventListener("click" , () =>{
    document.querySelector("#dialog").close()
})

let priorityValue = ""
document.querySelector("#pr-high").addEventListener("click",()=>{
    document.getElementById("pr-low").style.border = "0px"
    document.getElementById("pr-med").style.border = "0px"
    document.getElementById("pr-high").style.border = "3px solid #56534B"
    priorityValue = "high"
})
document.querySelector("#pr-med").addEventListener("click",()=>{
    document.getElementById("pr-high").style.border = "0px"
    document.getElementById("pr-low").style.border = "0px"
    document.getElementById("pr-med").style.border = "3px solid #56534B"
    priorityValue = "medium"
})
document.querySelector("#pr-low").addEventListener("click",()=>{
    document.getElementById("pr-high").style.border = "0px"
    document.getElementById("pr-med").style.border = "0px"
    document.getElementById("pr-low").style.border = "3px solid #56534B"
    priorityValue = "low"
})
let labelValue = ""
document.querySelector("#work").addEventListener("click",()=>{
    document.getElementById("study").style.border = "0px"
    document.getElementById("family").style.border = "0px"
    document.getElementById("entertainment").style.border = "0px"
    document.getElementById("work").style.border = "3px solid #56534B"
    labelValue = "work"
})
document.querySelector("#study").addEventListener("click",()=>{
    document.getElementById("work").style.border = "0px"
    document.getElementById("family").style.border = "0px"
    document.getElementById("entertainment").style.border = "0px"
    document.getElementById("study").style.border = "3px solid #56534B"
    labelValue = "study"
})
document.querySelector("#entertainment").addEventListener("click",()=>{
    document.getElementById("work").style.border = "0px"
    document.getElementById("study").style.border = "0px"
    document.getElementById("family").style.border = "0px"
    document.getElementById("entertainment").style.border = "3px solid #56534B"
    labelValue = "entertainment"
})
document.querySelector("#family").addEventListener("click",()=>{
    document.getElementById("work").style.border = "0px"
    document.getElementById("study").style.border = "0px"
    document.getElementById("entertainment").style.border = "0px"
    document.getElementById("family").style.border = "3px solid #56534B"
    labelValue = "family"
})


function renderTodos(data){
    document.querySelector("#main1").innerHTML = ""
    console.log(data)
    for(let i=0;i<data.length;i++){
        const currentDate = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        const taskBox = document.createElement("div")
        taskBox.setAttribute("class" , "box")
        taskBox.setAttribute("id", data[i]._id.toString())
        taskBox.setAttribute("draggable","true")
        taskBox.addEventListener("dragstart", (event) => drag(event));
        const taskDel = document.createElement("button")
        taskDel.setAttribute("class","task-del")
        taskDel.setAttribute("id",i)
        taskDel.addEventListener("click", () => deleteTask(data[i]._id.toString()));
        const taskName = document.createElement("div")
        taskName.setAttribute("class","task-name")
        const taskDesc = document.createElement("div")
        taskDesc.setAttribute("class","task-desc")
        const prioAndTime = document.createElement("div")
        prioAndTime.setAttribute("class","prio-and-time")
        const taskPrio = document.createElement("div")
        taskPrio.setAttribute("class","task-prio")
        const taskTime = document.createElement("div")
        taskTime.setAttribute("class","task-time")
        const prioText = document.createElement("span")
        prioText.setAttribute("class","prio-text")
        const taskLabel = data[i].label

        taskName.innerHTML = data[i].task
        taskDesc.innerHTML = data[i].description
        taskTime.innerHTML  = (formatter.format(currentDate)).toLowerCase()
        taskDel.innerHTML = "x"

        if(data[i].priority == "high"){
            prioText.innerHTML = "high"
            taskPrio.style.backgroundColor = "#FA6363"
        }else if(data[i].priority == "medium"){
            prioText.innerHTML = "medium"
            taskPrio.style.backgroundColor = "#F6AA2E"
        }else if(data[i].priority == "low"){
            prioText.innerHTML = "low"
            taskPrio.style.backgroundColor = "#77FD29"
        }

        if(taskLabel == "work"){
            taskBox.style.backgroundColor = "#D2CEFF"
            taskDel.style.backgroundColor = "#D2CEFF"
        }else if(taskLabel == "study"){
            taskBox.style.backgroundColor = "#D1E5F7"
            taskDel.style.backgroundColor = "#D1E5F7"
        }else if(taskLabel == "entertainment"){
            taskBox.style.backgroundColor = "#FFCECE"
            taskDel.style.backgroundColor = "#FFCECE"
        }else if(taskLabel == "family"){
            taskBox.style.backgroundColor = "#DAF2D6"
            taskDel.style.backgroundColor = "#DAF2D6"
        }

        taskPrio.appendChild(prioText)
        prioAndTime.appendChild(taskPrio)
        prioAndTime.appendChild(taskTime)
        taskBox.appendChild(taskDel)
        taskBox.appendChild(taskName)
        taskBox.appendChild(taskDesc)
        taskBox.appendChild(prioAndTime)
        
        document.querySelector("#main1").appendChild(taskBox)
    }
}
function renderInProgress(data){
    document.querySelector("#main2").innerHTML = ""
    for(let i=0;i<data.length;i++){
        const currentDate = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        const taskBox = document.createElement("div")
        taskBox.setAttribute("class" , "box")
        taskBox.setAttribute("id", data[i]._id.toString())
        taskBox.setAttribute("draggable","true")
        taskBox.addEventListener("dragstart", (event) => drag(event));
        const taskDel = document.createElement("button")
        taskDel.setAttribute("class","task-del")
        taskDel.setAttribute("id",i)
        taskDel.addEventListener("click", () => deleteTask(data[i]._id.toString()));
        const taskName = document.createElement("div")
        taskName.setAttribute("class","task-name")
        const taskDesc = document.createElement("div")
        taskDesc.setAttribute("class","task-desc")
        const prioAndTime = document.createElement("div")
        prioAndTime.setAttribute("class","prio-and-time")
        const taskPrio = document.createElement("div")
        taskPrio.setAttribute("class","task-prio")
        const taskTime = document.createElement("div")
        taskTime.setAttribute("class","task-time")
        const prioText = document.createElement("span")
        prioText.setAttribute("class","prio-text")
        const taskLabel = data[i].label

        taskName.innerHTML = data[i].task
        taskDesc.innerHTML = data[i].description
        taskTime.innerHTML  = (formatter.format(currentDate)).toLowerCase()
        taskDel.innerHTML = "x"

        if(data[i].priority == "high"){
            prioText.innerHTML = "high"
            taskPrio.style.backgroundColor = "#FA6363"
        }else if(data[i].priority == "medium"){
            prioText.innerHTML = "medium"
            taskPrio.style.backgroundColor = "#F6AA2E"
        }else if(data[i].priority == "low"){
            prioText.innerHTML = "low"
            taskPrio.style.backgroundColor = "#77FD29"
        }

        if(taskLabel == "work"){
            taskBox.style.backgroundColor = "#D2CEFF"
            taskDel.style.backgroundColor = "#D2CEFF"
        }else if(taskLabel == "study"){
            taskBox.style.backgroundColor = "#D1E5F7"
            taskDel.style.backgroundColor = "#D1E5F7"
        }else if(taskLabel == "entertainment"){
            taskBox.style.backgroundColor = "#FFCECE"
            taskDel.style.backgroundColor = "#FFCECE"
        }else if(taskLabel == "family"){
            taskBox.style.backgroundColor = "#DAF2D6"
            taskDel.style.backgroundColor = "#DAF2D6"
        }

        taskPrio.appendChild(prioText)
        prioAndTime.appendChild(taskPrio)
        prioAndTime.appendChild(taskTime)
        taskBox.appendChild(taskDel)
        taskBox.appendChild(taskName)
        taskBox.appendChild(taskDesc)
        taskBox.appendChild(prioAndTime)
        
        document.querySelector("#main2").appendChild(taskBox)
    }
}
function renderUnderReview(data){
    document.querySelector("#main3").innerHTML = ""
    for(let i=0;i<data.length;i++){
        const currentDate = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        const taskBox = document.createElement("div")
        taskBox.setAttribute("class" , "box")
        taskBox.setAttribute("id", data[i]._id.toString())
        taskBox.setAttribute("draggable","true")
        taskBox.addEventListener("dragstart", (event) => drag(event));
        const taskDel = document.createElement("button")
        taskDel.setAttribute("class","task-del")
        taskDel.setAttribute("id",i)
        taskDel.addEventListener("click", () => deleteTask(data[i]._id.toString()));
        const taskName = document.createElement("div")
        taskName.setAttribute("class","task-name")
        const taskDesc = document.createElement("div")
        taskDesc.setAttribute("class","task-desc")
        const prioAndTime = document.createElement("div")
        prioAndTime.setAttribute("class","prio-and-time")
        const taskPrio = document.createElement("div")
        taskPrio.setAttribute("class","task-prio")
        const taskTime = document.createElement("div")
        taskTime.setAttribute("class","task-time")
        const prioText = document.createElement("span")
        prioText.setAttribute("class","prio-text")
        const taskLabel = data[i].label

        taskName.innerHTML = data[i].task
        taskDesc.innerHTML = data[i].description
        taskTime.innerHTML  = (formatter.format(currentDate)).toLowerCase()
        taskDel.innerHTML = "x"

        if(data[i].priority == "high"){
            prioText.innerHTML = "high"
            taskPrio.style.backgroundColor = "#FA6363"
        }else if(data[i].priority == "medium"){
            prioText.innerHTML = "medium"
            taskPrio.style.backgroundColor = "#F6AA2E"
        }else if(data[i].priority == "low"){
            prioText.innerHTML = "low"
            taskPrio.style.backgroundColor = "#77FD29"
        }

        if(taskLabel == "work"){
            taskBox.style.backgroundColor = "#D2CEFF"
            taskDel.style.backgroundColor = "#D2CEFF"
        }else if(taskLabel == "study"){
            taskBox.style.backgroundColor = "#D1E5F7"
            taskDel.style.backgroundColor = "#D1E5F7"
        }else if(taskLabel == "entertainment"){
            taskBox.style.backgroundColor = "#FFCECE"
            taskDel.style.backgroundColor = "#FFCECE"
        }else if(taskLabel == "family"){
            taskBox.style.backgroundColor = "#DAF2D6"
            taskDel.style.backgroundColor = "#DAF2D6"
        }

        taskPrio.appendChild(prioText)
        prioAndTime.appendChild(taskPrio)
        prioAndTime.appendChild(taskTime)
        taskBox.appendChild(taskDel)
        taskBox.appendChild(taskName)
        taskBox.appendChild(taskDesc)
        taskBox.appendChild(prioAndTime)
        
        document.querySelector("#main3").appendChild(taskBox)
    }
}
function renderFinished(data){
    document.querySelector("#main4").innerHTML = ""
    for(let i=0;i<data.length;i++){
        const currentDate = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        const taskBox = document.createElement("div")
        taskBox.setAttribute("class" , "box")
        taskBox.setAttribute("id", data[i]._id.toString())
        taskBox.setAttribute("draggable","true")
        taskBox.addEventListener("dragstart", (event) => drag(event));
        const taskDel = document.createElement("button")
        taskDel.setAttribute("class","task-del")
        taskDel.setAttribute("id",i)
        taskDel.addEventListener("click", () => deleteTask(data[i]._id.toString()));
        const taskName = document.createElement("div")
        taskName.setAttribute("class","task-name")
        const taskDesc = document.createElement("div")
        taskDesc.setAttribute("class","task-desc")
        const prioAndTime = document.createElement("div")
        prioAndTime.setAttribute("class","prio-and-time")
        const taskPrio = document.createElement("div")
        taskPrio.setAttribute("class","task-prio")
        const taskTime = document.createElement("div")
        taskTime.setAttribute("class","task-time")
        const prioText = document.createElement("span")
        prioText.setAttribute("class","prio-text")
        const taskLabel = data[i].label

        taskName.innerHTML = "<s>" + data[i].task + "</s>"
        taskDesc.innerHTML = "<s>" + data[i].description + "</s>"
        taskTime.innerHTML  = (formatter.format(currentDate)).toLowerCase()
        taskDel.innerHTML = "x"

        if(data[i].priority == "high"){
            prioText.innerHTML = "high"
            taskPrio.style.backgroundColor = "#FA6363"
        }else if(data[i].priority == "medium"){
            prioText.innerHTML = "medium"
            taskPrio.style.backgroundColor = "#F6AA2E"
        }else if(data[i].priority == "low"){
            prioText.innerHTML = "low"
            taskPrio.style.backgroundColor = "#77FD29"
        }

        if(taskLabel == "work"){
            taskBox.style.backgroundColor = "#D2CEFF"
            taskDel.style.backgroundColor = "#D2CEFF"
        }else if(taskLabel == "study"){
            taskBox.style.backgroundColor = "#D1E5F7"
            taskDel.style.backgroundColor = "#D1E5F7"
        }else if(taskLabel == "entertainment"){
            taskBox.style.backgroundColor = "#FFCECE"
            taskDel.style.backgroundColor = "#FFCECE"
        }else if(taskLabel == "family"){
            taskBox.style.backgroundColor = "#DAF2D6"
            taskDel.style.backgroundColor = "#DAF2D6"
        }

        taskPrio.appendChild(prioText)
        prioAndTime.appendChild(taskPrio)
        prioAndTime.appendChild(taskTime)
        taskBox.appendChild(taskDel)
        taskBox.appendChild(taskName)
        taskBox.appendChild(taskDesc)
        taskBox.appendChild(prioAndTime)
        
        document.querySelector("#main4").appendChild(taskBox)
    }
}

document.querySelector("#addtask").addEventListener("click", async (e)=>{
    e.preventDefault()
    document.querySelector("#dialog").close()
    const task = document.getElementById("task").value
    const description = document.getElementById("description").value

    if(task == ""){
        alert("task cannot be empty")
    }else{
        try{
            console.log(task + description + labelValue + priorityValue)
            const response = await fetch("https://taskify-backend-rho.vercel.app/create-todo", {
                method: "POST",
                headers: {
                    "Content-Type":"application/json",
                    "authorization":localStorage.getItem("token")
                },
                body: JSON.stringify({
                    "task":task,
                    "description":description,
                    "priority":priorityValue,
                    "label":labelValue
                })
            })
            const res = await response.json()
            renderTodos(res.todos)

        }catch(err){
            console.error(err)
            alert(err)
        }
    }
    
})





window.onload = async ()=>{
    if(sessionStorage.getItem("page")=="in"){
        document.getElementById("signup-page").style.display = "none"
        document.getElementById("signin-page").style.display = "block"
    }else if(sessionStorage.getItem("page")=="up"){
        document.getElementById("signup-page").style.display = "block"
        document.getElementById("signin-page").style.display = "none"
    }else if(sessionStorage.getItem("page")=="todo"){
        document.getElementById("signup-page").style.display = "none"
        document.getElementById("signin-page").style.display = "none"
        document.getElementById("main-page").style.display = "block"
    }
    const response = await fetch("https://taskify-backend-rho.vercel.app/", {
        method: "GET",
        headers:{
            "authorization":localStorage.getItem("token")
        }
    })
    const res = await response.json()
    renderTodos(res.todos)
    renderInProgress(res.inProgress)
    renderUnderReview(res.underReview)
    renderFinished(res.finished)

}

async function deleteTask(index){
    const response  = await fetch("https://taskify-backend-rho.vercel.app/delete-todo", {
        method: "POST",
        headers: {
            "Content-Type":"application/json",
            "authorization":localStorage.getItem("token")
        },
        body: JSON.stringify({
            "taskid":index
        })
    })
    const res = await response.json()
    renderTodos(res.todos)
    renderInProgress(res.inProgress)
    renderUnderReview(res.underReview)
    renderFinished(res.finished)

}

document.getElementById("user").addEventListener("click",(e)=>{
    e.preventDefault()
    localStorage.removeItem("token")
    sessionStorage.setItem("page","in")
    document.getElementById("signup-page").style.display = "none"
    document.getElementById("signin-page").style.display = "block"
    document.getElementById("main-page").style.display = "none"

})
document.getElementById("user2").addEventListener("click",(e)=>{
    console.log("element clicked")
    e.preventDefault()
    localStorage.removeItem("token")
    sessionStorage.setItem("page","in")
    document.getElementById("signup-page").style.display = "none"
    document.getElementById("signin-page").style.display = "block"
    document.getElementById("main-page").style.display = "none"

})






