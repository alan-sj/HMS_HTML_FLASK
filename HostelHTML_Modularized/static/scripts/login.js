async function login(event){

    const username=document.getElementById("username").value;
    const password=document.getElementById("password").value;

    const response=await fetch("http://127.0.0.1:5000/login",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({username,password})
    });
    const result=await response.json();
    if(response.ok){
        alert("Logged In as "+username);
        localStorage.setItem("username",username);  
        window.location.href="/dashboard";
    }
    else{
        alert("Incorrect Credentials");
    }
}