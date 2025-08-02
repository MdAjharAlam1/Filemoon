
axios.defaults.baseURL = SERVER

window.onload = ()=>{
    fetchProfile()
    userDetail()
    fetchDashboardData()
    fetchRecentFile()
    fetchRecentShare()
}

const toast = new Notyf({
    position:{x:'center', y:'top'}
})

const Logout = () =>{
    localStorage.clear()
    location.href = '/login'
}

const tokenData = localStorage.getItem('authToken')

if(!tokenData){
    protectDashboard()
}

const getToken = () =>{
    const options = {
        headers:{
            Authorization : `Bearer ${localStorage.getItem('authToken')}`
        }
    }
    return options

}



const getFileSize = (size) => {
    if (size < 1024) {
        return `${size} B`;
    } else if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(1)} KB`;
    } else if (size < 1024 * 1024 * 1024) {
        return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    } else {
        return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    }
};

const userDetail = async() =>{
    const session = await getSession()
    const fullname = document.getElementById('fullname')
    const email = document.getElementById('email')
    fullname.innerHTML = session.fullname
    email.innerHTML = session.email

}

const fetchRecentFile = async() =>{
    try {
        const recentFile = document.getElementById('recent-file-box')
        const {data} = await axios.get('/api/file?limit=5', getToken())
        for(let item of data){
            // console.log(item)

            const ui = `
                <div class="flex items-start justify-between">
                    <div>
                        <h1 class="text-zinc-500 font-medium capitalize">${item.filename}</h1>
                        <small class="text-gray-500 text-sm">${getFileSize(item.size)}</small>
                    </div>
                    <p class="text-sm text-gray-600">${moment(item.createdAt).format('DD MMM YYYY hh:mm A')}</p>
                </div>
            `
            recentFile.innerHTML += ui
        }
    } catch (error) {
        toast.error(error.response ? error.response.data.message : error.message)
    }
}

const fetchRecentShare = async() =>{
    try {
        const recentShare = document.getElementById('recent-share-box')
        const {data} = await axios.get('/api/file/share?limit=3',getToken())
        // console.log(data)
        for(let item of data){

            const ui = `
                <div class="flex items-start justify-between">
                    <div>
                        <h1 class="text-zinc-500 font-medium capitalize">${item.file.filename}</h1>
                        <small class="text-gray-500 text-sm">${item.recieverEmail}</small>
                    </div>
                    <p class="text-sm text-gray-600">${moment(item.createdAt).format('DD MMM YYYY hh:mm A')}</p>
                </div>
            `
            recentShare.innerHTML += ui
        }
    } catch (error) {
        toast.error(error.response ?  error.response.data.message :  error.message)
    }
}

const fetchDashboardData = async() =>{
    try {
        const reportBox = document.getElementById('report-box')
        const {data} = await axios.get('/api/dashboard', getToken())
        for(let item of data){
            // console.log(item)
            const ui = `
                <div class=" overflow-hidden bg-white h-40 rounded-lg shadow relative flex items-center justify-center flex-col gap-1 hover:shadow-lg">
                    <h1 class="text-gray-500 font-medium uppercase">${item._id.split('/')[1]}</h1>
                    <p class="text-4xl font-bold ">${item.total}</p>
                    <div class="bg-red-500 w-[100px] h-[100px] rounded-full absolute top-7 -left-5 flex items-center justify-center">
                        <i class="text-white text-4xl  ri-live-line"></i>
                    </div>
                </div>
            `

            reportBox.innerHTML += ui
        }
    } catch (error) {
        toast.error(error.response ? error.response.data.message : error.message)
    }
}

const uploadImage = () =>{
    try {
        const pic = document.getElementById('pic')
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.click()

        input.onchange = async() =>{
            const file = input.files[0]
            const formData = new FormData()
            formData.append('picture',file)
            await axios.post('/api/users/profile-picture',formData,getToken())
            const url = URL.createObjectURL(file)
            pic.src = url
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