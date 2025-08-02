

axios.defaults.baseURL = SERVER

const toast = new Notyf({
    position:{x:'center',y:'top'}
})


const Logout = () =>{
    localStorage.clear()
    location.href = '/login'
}

window.onload = () =>{
    fetchProfile()
    userDetail()
    fetchFile()
}

const getToken = () =>{
    const options = {
        headers:{
            Authorization : `Bearer ${localStorage.getItem('authToken')}`
        }
    }
    return options

}




const userDetail = async() =>{
    const session = await getSession()
    // console.log(session)
    const fullname = document.getElementById('fullname')
    const email = document.getElementById('email')
    fullname.innerHTML = session.fullname
    email.innerHTML = session.email

}

const fetchFile = async() =>{
    try {
        const {data}= await axios.get('/api/file/share',getToken())
        // console.log(data)
        const tableBody = document.getElementById('table-body')
        tableBody.innerHTML = ''
        for(let item of data){
            console.log(item)
            const ui = `
                <tr class="border-b border-gray-100">
                    <td class="py-4 pl-6">${item.file.filename}</td>
                    <td>${item.recieverEmail}</td>
                    <td>${moment(item.createdAt).format('DD MMM YYYY, HH:MM A')}</td>
                </tr>
            `

            tableBody.innerHTML += ui
        }
    } catch (error) {
        toast.error(error.response ? error.response.data.message : error.message)
    }
}

const fetchProfile = async() =>{
    try {
        const options = {
            responseType: 'blob',
            ...getToken()
        }
        const {data} = await axios.get('/api/users/profile-picture',options)
        const url =  URL.createObjectURL(data)
        const pic = document.getElementById('pic')
        pic.src = url
    } catch (err) {
        if(!err.response){
            return toast.error(err.message)
        }0
        const error = await (err.response.data).text()
        console.log(error)
        const {message} = JSON.parse(error)
        console.log(message)
        toast.error(message)
    }
}
