
axios.defaults.baseURL = SERVER

window.onload = () =>{
    fetchProfile()
    userDetail()
    fetchFile()
}

const toast = new Notyf({
    position:{x:'center', y:'top'}
})

const Logout = () =>{
    localStorage.clear()
    location.href = '/login'
}


const userDetail = async() =>{
    const session = await getSession()
    const fullname = document.getElementById('fullname')
    const email = document.getElementById('email')
    fullname.innerHTML = session.fullname
    email.innerHTML = session.email

}

const getToken = () =>{
    const options = {
        headers:{
            Authorization : `Bearer ${localStorage.getItem('authToken')}`
        }
    }
    return options

}

const toggleDrawer = () =>{
    const drawer = document.getElementById('drawer')
    const drawerValue = drawer.style.right
    // alert(drawerValue)
    if(drawerValue === "0px"){
        drawer.style.right = "-33.33%"
    }
    else{
        drawer.style.right =  "0px"
    }
}

const uploadFile = async(e) =>{
    const uploadBtn = document.getElementById('upload-btn')
    try {
        e.preventDefault()  
        const progressBar = document.getElementById('progress')
        const form = e.target
        const formData = new FormData(form)
        const file = formData.get('file')
        const size = getFileSize(file.size)
        
        if(size > 200)
            return toast.error("File size too large max size 200 Mb allowed")

        
        const options = {
            onUploadProgress: (e) =>{
                const loaded = e.loaded
                const total = e.total
                const percentagevalue = Math.floor((loaded*100)/total)
                // console.log(percentagevalue)
                progressBar.style.width = percentagevalue+'%'
                progressBar.innerHTML = percentagevalue+'%'
            },
            ...getToken()

        }
        uploadBtn.disabled = true
        const response = await axios.post('/api/file',formData,options)
        // console.log(response.data.payload)
        fetchFile()
        toast.success(`${response.data.payload.filename} uploaded Successfully`)
        progressBar.style.width = 0
        progressBar.innerHTML = ''

        form.reset()
        toggleDrawer()
    } catch (error) {
        console.log(error)
        toast.error(error.response ? error.response.data.message : error.message)
    }finally{
        uploadBtn.disabled = false
    }
}

const getFileSize = (size) => {
    if (size < 1024) {
        return `${size} B`;
    } else if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(1)} Kb`;
    } else if (size < 1024 * 1024 * 1024) {
        return `${(size / (1024 * 1024)).toFixed(1)} Mb`;
    } else {
        return `${(size / (1024 * 1024 * 1024)).toFixed(1)} Gb`;
    }
};

const fetchFile = async() =>{
    try {
        const {data}  = await axios.get('/api/file', getToken())
        // console.log(response.data)
        const tableBody = document.getElementById('table-body')
        tableBody.innerHTML = ''
        for(let file of data){
            // console.log(file)
            const ui = `
            <tr class="border-b border-gray-100">
                <td class="py-4 capitalize pl-6">${file.filename}</td>
                <td class="capitalize">${file.type}</td>
                <td>${getFileSize(file.size)}</td>
                <td>${moment(file.createdAt).format('DD MMM YYYY, hh:mm A')}</td>
                <td>
                    <div class="space-x-2">
                        <button class="px-2 py-1 text-white rounded bg-rose-400 hover:bg-rose-600" onClick="deleteFile('${file._id}',this)">
                            <i class="ri-delete-bin-4-line"></i>
                        </button>
                        <button class="px-2 py-1 text-white rounded bg-green-400 hover:bg-green-600 " onClick="downloadFile('${file._id}','${file.filename}',this)">
                            <i class="ri-download-line"></i>
                        </button>
                        <button class="px-2 py-1 text-white rounded bg-amber-400 hover:bg-amber-600 " onClick="openModalForShare('${file._id}','${file.filename}')">
                            <i class="ri-share-line"></i>
                        </button>
                    </div>  
                </td>
            </tr>  
            `
            tableBody.innerHTML += ui
        }
    } catch (error) {
        toast.error(error.response ? error.response.data.message : error.message)
    }
}


const deleteFile = async(id,button) =>{
    try {
        // console.log(id)
        button.innerHTML = `<i class="fa fa-spinner fa-spin"></i>`
        button.disabled = true
        await axios.delete(`/api/file/${id}`,getToken())
        toast.success("File deleted Successfully")
        fetchFile()
    } catch (error) {
        toast.error(error.response ? error.response.data.message : error.message)
    }
    finally{
        button.innerHTML = `<i class="ri--bin-4-line"></i>`
        button.disabled = false
    }
}

const downloadFile = async(id,filename,button) =>{
    try {
        button.innerHTML = `<i class="fa fa-spinner fa-spin"></i>`
        button.disabled = true
        const options = {
            responseType:'blob',
            ...getToken()
        }
        const {data} = await axios.get(`/api/file/download/${id}`,options)
        console.log(data)
        let  ext = data.type.split('/').pop()
        console.log(ext)
        const url = URL.createObjectURL(data)
        const a = document.createElement('a')
        a.href = url
        if(ext === "x-msdos-program"){
            ext = "exe"
        }
        a.download = `${filename}.${ext}`
        a.click()
        a.remove()
        toast.success(`${filename} downlaod Successfully`)
    } catch (err) {
        if(!err.response){
            return toast.error(err.message)
        }
        else{
            const a  = await (err.response.data).text()
            const errorData  = JSON.parse(a)
            toast.error(errorData.message)
        }
    }
    finally{
        button.innerHTML = `<i class="ri-download-line"></i>`
        button.disabled = true
    }
}



const openModalForShare = (id,filename) =>{
    new Swal({
        showConfirmButton: false,
        html: `
            <form class="text-left flex flex-col gap-6" onSubmit="shareFile('${id}', event)">
                <h1 class="font-medium text-black text-2xl"> Email id</h1>
                <input required type="email" name="email" class="border border-gray-300 w-full p-3 rounded " placeholder="mail@gmail.com"/>
                <button id="send-btn" class="bg-indigo-400 hover:bg-indigo-500 text-white rounded py-3 px-8 w-fit font-medium">Send</button>
                <div class="flex items-center gap-2">
                    <p class="text-gray-500">You are Sharing</p>
                    <p class="text-green-400 font-medium">${filename}</p>
                    
                </div>
            </form>
        `
    })
}

const shareFile = async(id,e) =>{
    e.preventDefault()
    const sendBtn = document.getElementById('send-btn')
    // console.log(sendBtn)
    sendBtn.innerHTML = `
        <i class="fa fa-spinner mr-2 fa-spin"></i>
        Processing
    `
    try {
        
        const email  = e.target.elements.email.value.trim()
        const payload = {
            email: email,
            fileId: id,
        }
        const {data} = await axios.post('/api/file/share',payload,getToken())
        toast.success('File Sent Successfully')
    } catch (error) {
        toast.error(error.response ? error.response.data.message : error.message)
    }
    finally{
        Swal.close()
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