const express = require('express')
const app = express()
const PORT = 3000;
const path = require("path")
const fs = require("fs")
const mime = require('mime-types')

const imghelper = function (type) {
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

const pathHelper = function (current, root) {
    let path = root.split('/');
    path.splice(path.lastIndexOf(current) + 1, path.length);

    return path.join('/')
}

const hbs = require('express-handlebars');
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'main',
    partialsDir: __dirname + '/views/partials/',
    helpers: {
        fileImg: imghelper,
        pathTo: pathHelper
    }
}));

app.set('view engine', 'hbs');

const formidable = require('formidable');
const bodyParser = require('body-parser');
const { log } = require('console');
const { redirect } = require('statuses');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw({ type: 'image/*', limit: '10mb' }));
app.use(express.json())



app.get('/', function (req, res) {
    let root = '/'
    let path_array = []
    let files_array = [];
    let dirs_array = [];
    if (req.query.path != undefined) {
        root = req.query.path;
    }
    ////Tworzenie tablicy ze ścieżki 
    path_array = root.split('/').splice(2, root.split('/').length)
    // console.log(path_array);

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
    })

    res.render('index.hbs', { files_array, dirs_array, root: root, path_array });

})

app.get("/addFolder", function (req, res) {
    let name = req.query.name;
    let root = req.query.root;
    if (!fs.existsSync(path.join(__dirname, 'upload', (root + '/' + name)))) {
        fs.mkdir(path.join(__dirname, 'upload', (root + '/' + name)), (err) => {
            if (err) throw err
        })
    }
    res.redirect(`/?path=${root}`)
})

app.get("/addFile", function (req, res) {
    let name = req.query.name;
    let root = req.query.root;
    let file_type = name.split('.')[1]
    let contents = '';
    if (!fs.existsSync(path.join(__dirname, 'upload', (root + '/' + name)))) {

        switch (file_type) {
            case 'html':
                contents =
                    `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
</html>`
                break;
            case 'js':
                contents = `document.body.style.backgroundColor = green;`
                break;
            case 'css':
                contents = `*{box-sizing: border-box}`
                break;
            case 'txt':
                contents = `Ala ma kota 123!`
                break;
            case 'json':
                contents = `{"x": 1, "y": 0}`
                break;
            case 'xml':
                contents = `
<?xml version="1.0" encoding="UTF-8"?>
<note>
  <to>Tove</to>
  <from>Jani</from>
  <heading>Reminder</heading>
  <body>Don't forget me this weekend!</body>
</note>`
                break;
            default:
                contents = String(new Date().getMilliseconds());
                break;
        }

        fs.writeFile(path.join(__dirname, 'upload', (root + '/' + name)), contents, (err) => {
            if (err) throw err
        })
    }
    res.redirect(`/?path=${root}`)
})

app.get("/deleteFile", function (req, res) {
    let name = req.query.name;
    let root = req.query.root;
    if (fs.existsSync(path.join(__dirname, 'upload', (root + '/' + name)))) {

        fs.unlink(path.join(__dirname, 'upload', (root + '/' + name)), (err) => {
            if (err) throw err
        })
    }
    res.redirect(`/?path=${root}`)
})

app.get("/deleteFolder", function (req, res) {
    let name = req.query.name;
    let root = req.query.root;
    if (fs.existsSync(path.join(__dirname, 'upload', (root + '/' + name)))) {

        fs.rmSync(path.join(__dirname, 'upload', (root + '/' + name)), { recursive: true, force: true }, (err) => {
            if (err) throw err
        })
    }
    res.redirect(`/?path=${root}`)
})

app.get("/rnFolder", function (req, res) {
    let name = req.query.name;
    let root = req.query.root;
    let new_path = root.split('/');
    new_path[new_path.length - 1] = name;
    new_path = new_path.join('/')
    if (root != '/') {
        if (fs.existsSync(path.join(__dirname, 'upload', root))) {
            fs.rename(path.join(__dirname, 'upload', root), path.join(__dirname, 'upload', new_path), (err) => {
                if (err) console.log(err)
                else {
                }
            })
        }
        res.redirect(`/?path=${new_path}`)
    }
})

//////////////////////EDYTOR PLIKÓW!////////////////////////
app.get('/fileEditor', function (req, res) {
    let root = req.query.name;
    if (fs.existsSync(path.join(__dirname, 'upload', root))) {
        fs.readFile(path.join(__dirname, 'upload', root), "utf-8", (err, data) => {
            if (err) console.log(err)
            else {
                let type;
                try {
                    type = mime.lookup(path.join(__dirname, 'upload', root)).split('/')[0];
                } catch (error) {
                    type = 'none';
                }
                let fileName;
                let contents = {};
                //console.log(type);
                if (type == "image") {
                    fileName = "imgEditor.hbs"
                    const effects = [
                        { name: "grayscale" },
                        { name: "invert" },
                        { name: "sepia" }
                    ]
                    contents.effects = effects;
                } else {
                    fileName = "editor.hbs"
                    contents = data.toString();
                }
                res.render(fileName, { root, contents })
            }
        })
    }

})
////////////////////////////SAVE AND PREVIEW IMAGE/////////////////////////////////
app.post('/saveImg', function (req, res) {
    let form = formidable({});
    form.keepExtensions = true;
    form.parse(req, function (err, fields, files) {
        fs.rename(files.img.path, path.join(__dirname, 'upload', fields.path), (err) => {
            res.send('Zapisano pomyślnie!')
        })
    })
})



////////////////////////////////////////////////////////////////////
app.get('/saveFile', function (req, res) {
    let content = req.query.content;
    let root = req.query.root;
    fs.writeFile(path.join(__dirname, 'upload', root), content, (err) => {
        if (err) throw err;
        res.redirect(`/fileEditor?name=${root}`)
    })
})

app.get("/rnFile", function (req, res) {
    let name = req.query.name;
    let root = req.query.root;
    let new_path = root.split('/');
    new_path[new_path.length - 1] = name;
    new_path = new_path.join('/')
    if (root != '/') {
        if (fs.existsSync(path.join(__dirname, 'upload', root))) {
            fs.rename(path.join(__dirname, 'upload', root), path.join(__dirname, 'upload', new_path), (err) => {
                if (err) console.log(err)
                else {
                }
            })
        }
        res.redirect(`/fileEditor?name=${new_path}`)
    }
})

app.post("/saveSettings", function (req, res) {
    fs.writeFile(path.join(__dirname, 'static', 'data', 'editor-settings.json'), JSON.stringify(req.body), (err) => {
        if (err) throw err;
        console.log('zapisano');
        res.send('zapisano');
    })
})

app.post("/", function (req, res) {
    let root;
    let form = formidable({});
    form.keepExtensions = true;
    form.multiples = true;
    form.uploadDir = path.join(__dirname, 'upload');
    form.parse(req, function (err, fields, files) {
        root = fields.root;

        if (Array.isArray(files.upload)) {
            files.upload.forEach(file => {
                if (!fs.existsSync(path.join(__dirname, 'upload', (root + '/' + file.name)))) {
                    fs.rename(file.path, path.join(__dirname, 'upload', (root + '/' + file.name)), (err) => {
                        if (err) console.log(err)
                        else {
                        }
                    })
                }
            })
        }
        if (!Array.isArray(files.upload)) {
            if (!fs.existsSync(path.join(__dirname, 'upload', (root + '/' + files.upload.name)))) {
                fs.rename(files.upload.path, path.join(__dirname, 'upload', (root + '/' + files.upload.name)), (err) => {
                    if (err) console.log(err)
                    else {
                    }
                })
            }
        }
        res.redirect('/');
    });
})

app.use(express.static('static'));
app.use(express.static('upload'));
app.listen(PORT, function () {
    console.log(`Serwer działa na porcie: ${PORT}`)
})