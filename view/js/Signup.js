axios.defaults.baseURL = SERVER

const toast = new Notyf({
    position: {x:'center',y:'top'},
    
})

const checkSession = async() =>{
    const session = await getSession()
    
    if(session){
        location.href = '/dashboard'
    }
}

checkSession()

const signup = async(e)=>{
    try {
        e.preventDefault()
        const form = e.target
        const element = form.elements
        const{fullname,mobile,email,password} = element
        const payload = {
            fullname: fullname.value,
            mobile: mobile.value,
            email: email.value,
            password: password.value
        }
        
        const response = await axios.post('/api/users/signup',payload)
        setTimeout(()=>{
            location.href = 'index.html'
        },2000)
        toast.success(response.data.message)
    } catch (error) {
        toast.error(error.response ? error.response.data.message : error.message)
    }
}