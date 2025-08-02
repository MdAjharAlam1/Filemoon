axios.defaults.baseURL = SERVER

const toast = new Notyf({
    position: {x:'center',y:'top'}
})

const checkSession = async() =>{
    const session = await getSession()
    
    if(session){
        location.href = '/dashboard'
    } 
}

checkSession()

const login = async(e) =>{
    
    try {
        e.preventDefault()
        const form = e.target
        const element = form.elements
        // console.log(element)
        const {email,password} = element
        const payload = {
            email: email.value,
            password: password.value
        }
        
        const response = await axios.post('/api/users/login',payload)
        localStorage.setItem('authToken',response.data.token)

        toast.success(response.data.message)
        setTimeout(()=>{
            location.href = '/dashboard'
        },2000)
        
    } catch (error) {
        toast.error(error.response ? error.response.data.message : error.message)
    }   
}