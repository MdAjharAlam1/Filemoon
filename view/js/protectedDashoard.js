
axios.defaults.baseURL = SERVER

const protectDashboard = async()=>{
    try {
        
        const token = localStorage.getItem('authToken')
        console.log(session)
    
        if(!session){
            location.href = '/login'
            return
        }
    
        const payload = {
            token
        }
    
        const {data} = await axios.post('/api/token/verify',payload)
        return data

    } catch (error) {
        location.href = '/login'
        return
    }
}
