function OpenPopup() {
    document.getElementById("popup-overlay").style.display = "block";
}



function ClosePopup() {
   
    document.getElementById("popup-overlay").style.display = "none";
}

function Yes() {
    window.location.href ="mailto:contact@iamkingfresco.com";
}

function No() {
    ClosePopup();
}


document.getElementById("form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the default form submission
    
    var formData = new FormData(this); // Collect form data
    
    // You can perform any additional checks or actions here
    
    // Send form data to PHP script using AJAX
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/mail/mail.php", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            ClosePopup();
            console.log("entrou 2")
            // Handle the response from the PHP script if needed
        }
    };
    xhr.send(formData);
    ClosePopup(); 
    
    console.log("entrou")

});



const closeButton = document.querySelector('.exit_button');

closeButton.addEventListener('click', ClosePopup)




