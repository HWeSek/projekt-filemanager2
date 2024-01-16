const express = require('express')
const app = express()
const PORT = 3000;
const path = require("path")
const fs = require("fs")
const mime = require('mime-types')

let imghelper = function (type) {
    let src;
    switch (type) {
        case "audio/x-flac":
            src = '774673_format_flac_document_extension_file.png';
            break;
        case "image/png":
            src = '774683_format_file_extension_document_png file firmat.png';
            break;
        case "image/jpeg":
            src = '774688_format_jpg_document_extension_file.png';
            break;
        case "application/msword":
            src = '774674_format_doc_document_extension_file.png';
            break;
        case "video/mp4":
            src = '774675_extension_mp4_format_file_document.png';
            break;
        case "text/plain":
            src = '774680_format_file_extension_document_txt.png';
            break;
        case "application/pdf":
            src = '774684_extension_pdf_document_file_format.png';
            break;
        case "audio/mpeg":
            src = '774685_file_documents_document_mp3_format.png';
            break;
        case "application/javascript":
            src = '774687_file_js file firmat_extension_document_format_file_document_js file firmat_extension_format.png';
            break;
        case "text/html":
            src = '774689_document_extension_format_file_html.png';
            break;
        case "image/gif":
            src = '774690_gif_ducument_format_extension_file_filetype.png';
            break;
        case "dir":
            src = '416376_envelope_files_folder_interface_office_icon.png'
            break;
        default:
            src = "199231_format_file_extension_blank_icon.png"
            break;
    }
    return `<img src="gfx/icons/${src}" width="36" alt="${type}">`
}

const hbs = require('express-handlebars');
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'main',
    partialsDir: __dirname + '/views/partials/',
    helpers: {
        fileImg: imghelper
    }
}));

app.set('view engine', 'hbs');

const formidable = require('formidable');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    let root = '/'
    let files_array = [];
    let dirs_array = [];
    if (req.query.path != undefined) {
        root = req.query.path;
    }
    fs.readdir(path.join(__dirname, 'upload', root), (err, files) => {
        if (err) throw err
        files.forEach((file) => {
            fs.lstat(path.join(__dirname, 'upload', root, file), (err, stats) => {
                if (stats.isDirectory()) {
                    dirs_array.push({ name: file, type: 'dir' })
                } else {
                    files_array.push({ name: file, type: mime.lookup(path.join(__dirname, 'upload', file)) });
                }
            })
        })
        res.render('index.hbs', { files_array, dirs_array, root: root });
    })
})

app.get("/addFolder", function (req, res) {
    let name = req.query.name;
    let root = req.query.root;
    if (!fs.existsSync(path.join(__dirname, 'upload', (root + name)))) {
        fs.mkdir(path.join(__dirname, 'upload', name), (err) => {
            if (err) throw err
        })
    }
    res.redirect('/')
})

app.get("/addFile", function (req, res) {
    let name = req.query.name;
    let root = req.query.root;
    if (!fs.existsSync(path.join(__dirname, 'upload', (root + name)))) {
        fs.writeFile(path.join(__dirname, 'upload', name), String(new Date().getMilliseconds()), (err) => {
            if (err) throw err
        })
    }
    res.redirect('/')
})

app.get("/deleteFile", function (req, res) {
    let name = req.query.name;
    if (fs.existsSync(path.join(__dirname, 'upload', name))) {

        fs.unlink(path.join(__dirname, 'upload', name), (err) => {
            if (err) throw err
        })
    }
    res.redirect('/')
})

app.get("/deleteFolder", function (req, res) {
    let name = req.query.name;
    if (fs.existsSync(path.join(__dirname, 'upload', name))) {

        fs.rmSync(path.join(__dirname, 'upload', name), { recursive: true, force: true }, (err) => {
            if (err) throw err
        })
    }
    res.redirect('/')
})

app.post("/", function (req, res) {
    let form = formidable({});

    form.uploadDir = __dirname + '/upload/';
    form.keepExtensions = true;
    form.multiples = true

    form.parse(req, function (err, fields, files) {
    });
    res.redirect('/')
})

app.use(express.static('static'));
app.listen(PORT, function () {
    console.log(`Serwer działa na porcie: ${PORT}`)
})