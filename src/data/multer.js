const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_img_${path.extname(file.originalname)}`);
    }
});

const uploadFile = (req, res, next) => {
    multer({
        storage: storage,
        fileFilter: function (req, file, cb) {
            const acceptedExtensions = ['.jpg', '.png', '.gif', '.jpeg'];
            const fileExtension = path.extname(file.originalname).toLowerCase();
            if (acceptedExtensions.includes(fileExtension)) {
                cb(null, true);
            } else {
                req.fileValidationError = `Las extensiones permitidas son ${acceptedExtensions.join(', ')}`;
                cb(null, false);
            }
        }
    }).single('avatar')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return next(err);
        } else if (err) {
            return next(err);
        }
        next();
    });
};

module.exports = uploadFile;
