
document.getElementById('loginForm').addEventListener('submit', async function (event){
event.preventDefault();


    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try{
            const response = await fetch('http://localhost:8080/api/login', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  credentials: 'include',
                  body: JSON.stringify({email, password})


            });
          
            if(!response.ok){
                throw new Error(`Login Failed: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);
            localStorage.setItem('accessToken', data.token);

    }
    catch(error){
        console.error('Error Loggin in:', error);
    }


});