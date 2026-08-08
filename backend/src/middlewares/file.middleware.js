const multer = require("multer");


const upload = multer({

    storage: multer.memoryStorage(),

    limits: {

        // Maximum resume size: 5 MB
        fileSize: 5 * 1024 * 1024,

    },

    fileFilter: (req, file, cb) => {

        /*
        |--------------------------------------------------------------------------
        | Only PDF resumes
        |--------------------------------------------------------------------------
        */

        if (file.mimetype !== "application/pdf") {

            return cb(
                new Error(
                    "Only PDF files are allowed."
                )
            );

        }


        cb(null, true);

    },

});


module.exports = upload;