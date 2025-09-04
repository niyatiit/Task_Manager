import multer from "multer"

// Configuare Storage
const storage  = multer.diskStorage({

    // cb means callback
    destination : (req,file , cb) =>{
        cb(null , "uploads/");
    },
    filename: (req,file , cb) =>{
        cb(null , `${Date.now()}-${file.originalname}`)
    }
})

// File Filter
const fileFilter = (req,file,cb) =>{
    const allwedTypes = ['image/jpeg' , 'image/png' , 'image/jpg'];

    if(allwedTypes.includes(file.mimetype)){
        cb(null , true);
    }
    else{
        cb(new Error('Only .jpeg , .jpg , .png Formate are allowed'))
    }
}

const upload = multer({ storage , fileFilter}) 
export {upload}