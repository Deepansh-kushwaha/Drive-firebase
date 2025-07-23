const express = require('express');
const router = express.Router();
const fs = require('fs');
const fileModel = require('../models/files.model');
const upload = require('../config/multer.config');
const { storage, BUCKET_ID, ID } = require('../config/appwrite.config');
const authMiddleware = require('../middlewares/auth');
const { Readable } = require('stream');
function bufferToStream(buffer) {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
}

router.get('/home', authMiddleware, async (req, res) => {
    const userfiles = await fileModel.find({
        user: req.user.userid
    });
    res.render('home', { files: userfiles });
});
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        const buckets = await storage.listBuckets();
        console.log("Buckets:", buckets);
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // convert buffer to stream
        const stream = bufferToStream(req.file.buffer);

        const response = await storage.createFile(
            BUCKET_ID,
            ID.unique(),
            stream,                 // ✅ Pass stream here
            req.file.mimetype       // optional
        );
        const result = await response.json();
        const appwriteResponse = result;
        const newFile = await fileModel.create({
            path: req.file.path,
            originalName: req.file.originalname,
            user: req.user.userid
        })
        res.json({
            message: 'File uploaded to Appwrite and saved to DB!',
            file: newFile,
            appwriteMeta: appwriteResponse
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: error.message });
    }

});

router.get('/download/:path', authMiddleware, async (req, res) => {
    const loggedinUserId = req.user.userid;
    const path = req.params.path;
    const file = await fileModel.findOne({
        user: loggedinUserId,
        path: path
    });
    if (!file) {
        return res.status(401).json({ message: 'File not found' });
    } else {
        res.download(file.path, file.originalName);
    }
})
module.exports = router;