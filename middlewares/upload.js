const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let ext = file.mimetype.split('/')[0];
        if (ext === 'image') {
            cb(null, 'uploads/photos');
        }else if (
            file.mimetype === 'application/pdf' || 
            file.mimetype === 'application/msword' || 
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
            cb(null, 'uploads/resumes');
        } else {
            cb(new Error('Invalid file type!'), null);
        }
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop().toLowerCase();
        const userId = req.user?.id || 'anonymous';
        const filename = `${file.originalname.split('.')[0]}-${userId}-${Date.now()}.${ext}`;
        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    // get the file extension from the original name last element of the split array
    let ext = file.originalname.split('.').pop().toLowerCase();
    if (file.fieldname === 'photo' && !['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
        return cb(new Error('Invalid image format'), false);
    }
    if (file.fieldname === 'resume' && !['.pdf', '.doc', '.docx', '.txt'].includes(ext)) {
        return cb(new Error('Invalid resume format'), false);
    }
    cb(null, true);
};

const upload = multer({ storage, fileFilter })
                .fields([
                        { name: 'photo', maxCount: 1 },
                        { name: 'resume', maxCount: 1 }
                ]);

module.exports = upload;