const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let targetDir = '';

    if (file.fieldname === 'photo') {
      targetDir = path.join(__dirname, 'uploads/photos');
    } else if (file.fieldname === 'resume') {
      targetDir = path.join(__dirname, 'uploads/resumes');
    } else if (file.fieldname === 'coverLetter') {
      targetDir = path.join(__dirname, 'uploads/coverLetters');
    } else {
      return cb(new Error('Invalid file field'), null);
    }


    fs.mkdirSync(targetDir, { recursive: true });

    cb(null, targetDir);
  },

  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop().toLowerCase();
    const name = file.originalname.split('.')[0].replace(/\s+/g, '-'); // remove spaces
    const userId = req.user?.id || req.user?._id || 'anonymous';
    const filename = `${name}-${userId}-${Date.now()}.${ext}`;
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = file.originalname.split('.').pop().toLowerCase();
  if (file.fieldname === 'photo' && !['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
    return cb(new Error('Only image formats (jpg, jpeg, png, gif) are allowed'), false);
  }
  if ((file.fieldname === 'resume' || file.fieldname === 'coverLetter') && !['pdf', 'doc', 'docx', 'txt'].includes(ext)) {
    return cb(new Error('Only resume/cover letter formats (pdf, doc, docx, txt) are allowed'), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter }).fields([
  { name: 'photo', maxCount: 1 },
  { name: 'resume', maxCount: 1 },
  { name: 'coverLetter', maxCount: 1 }
]);

module.exports = upload;
