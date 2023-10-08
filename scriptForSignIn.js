document.getElementById('sign-in-button').addEventListener("click", function()
{
    const userName = document.getElementById('username').value;
    console.log("clicked");
   	document.getElementById('username').value = '';
    localStorage.setItem('username', userName);
    window.location.href = "/canvas_game/gameplay.html";
    console.log(location.href)
    
})
