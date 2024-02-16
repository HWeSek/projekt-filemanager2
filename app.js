const express = require('express')
const app = express()
const PORT = 3000;
const path = require("path")
const fs = require("fs")
const mime = require('mime-types')
const cookieparser = require("cookie-parser");
const Datastore = require('nedb')

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

const hbs = require('express-handlebars');
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'main',
    partialsDir: __dirname + '/views/partials/',
    helpers: {
        fileImg: imghelper,
    }
}));

app.set('view engine', 'hbs');

//////neDb

const users = new Datastore({
    filename: 'users.db',
    autoload: true
});

const formidable = require('formidable');
const bodyParser = require('body-parser');
const { log } = require('console');
const { redirect } = require('statuses');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw({ type: 'image/*', limit: '10mb' }));
app.use(express.json())
app.use(cookieparser())



////REGISTER
app.get('/register', function (req, res) {
    res.render('register.hbs', { layout: 'notloggedin.hbs' });
})

app.post('/register', function (req, res) {
    const username = req.body.username;
    const password = req.body.passwd;
    users.insert({ username: username, password: password }, function (err, newDoc) {
        if (!fs.existsSync(path.join(__dirname, 'upload', username))) {
            fs.mkdir(path.join(__dirname, 'upload', username), (err) => {
                if (err) throw err
            })
        }
        res.redirect('/login');
    })
})

////////LOGIN

app.get('/login', function (req, res) {
    res.render('login.hbs', { layout: 'notloggedin.hbs' });
})

app.post('/login', function (req, res) {
    const username = req.body.username;
    const password = req.body.passwd;
    users.find({ username: username }, function (err, user) {
        if (user[0].password == password) {
            console.log('zalogowano');
            res.cookie("login", username, { httpOnly: true, maxAge: 30 * 1000 });
            res.redirect('/');
        }
    });
})

///////INDEX 

app.get('/', function (req, res) {
    if (req.cookies.login) {
        res.render('index.hbs', { layout: 'notloggedin.hbs', username: req.cookies.login });
    } else {
        res.redirect('/login');
    }
})


/////LOGOUT

app.get('/logout', function (req, res) {
    res.clearCookie("login");
    res.redirect('/')
})

////////////////////////FILEMANAGER
app.get('/filemanager', function (req, res) {
    if (req.cookies.login) {
        let root = `/${req.cookies.login}`
        let path_names = []
        let whole_paths = [];
        let path_array = [];
        let files_array = [];
        let dirs_array = [];
        if (req.query.path != undefined) {
            root = req.query.path;
        }
        ////Tworzenie tablicy ze ścieżki 
        path_names = root.split('/').splice(2, root.split('/').length)
        for (i in path_names) {
            whole_paths[i] = path_names.slice(0, (parseInt(i) + 1)).join('/');
        }
        for (i in path_names) {
            path_array.push({
                name: path_names[parseInt(i)],
                path: whole_paths[parseInt(i)]
            })
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
        })

        res.render('filemanager.hbs', { files_array, dirs_array, root: root, path_array });
    } else {
        res.render('error.hbs', { layout: 'notloggedin.hbs', error: "Nie zalogowano!" })
    }

})

app.get("/addFolder", function (req, res) {
    if (req.cookies.login) {
        let name = req.query.name;
        let root = req.query.root;
        if (!fs.existsSync(path.join(__dirname, 'upload', (root + '/' + name)))) {
            fs.mkdir(path.join(__dirname, 'upload', (root + '/' + name)), (err) => {
                if (err) throw err
            })
        }
        res.redirect(`/filemanager?path=${root}`)
    } else {
        res.render('error.hbs', { layout: 'notloggedin.hbs', error: "Nie zalogowano!" })
    }

})

app.get("/addFile", function (req, res) {
    if (req.cookies.login) {
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
        res.redirect(`filemanager?path=${root}`)
    } else { res.render('error.hbs', { layout: 'notloggedin.hbs', error: "Nie zalogowano!" }) }

})

app.get("/deleteFile", function (req, res) {
    if (req.cookies.login) {
        let name = req.query.name;
        let root = req.query.root;
        if (fs.existsSync(path.join(__dirname, 'upload', (root + '/' + name)))) {

            fs.unlink(path.join(__dirname, 'upload', (root + '/' + name)), (err) => {
                if (err) throw err
            })
        }
        res.redirect(`/filemanager?path=${root}`)
    } else {
        res.render('error.hbs', { layout: 'notloggedin.hbs', error: "Nie zalogowano!" })
    }

})

app.get("/deleteFolder", function (req, res) {
    if (req.cookies.login) {
        let name = req.query.name;
        let root = req.query.root;
        if (fs.existsSync(path.join(__dirname, 'upload', (root + '/' + name)))) {

            fs.rmSync(path.join(__dirname, 'upload', (root + '/' + name)), { recursive: true, force: true }, (err) => {
                if (err) throw err
            })
        }
        res.redirect(`/filemanager?path=${root}`)
    } else {
        res.render('error.hbs', { layout: 'notloggedin.hbs', error: "Nie zalogowano!" })
    }

})

app.get("/rnFolder", function (req, res) {
    if (req.cookies.login) {
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
            res.redirect(`/filemanager?path=${new_path}`)
        }
    } else {
        res.render('error.hbs', { layout: 'notloggedin.hbs', error: "Nie zalogowano!" })
    }

})

//////////////////////EDYTOR PLIKÓW!////////////////////////
app.get('/fileEditor', function (req, res) {
    if (req.cookies.login) {
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
    } else {
        res.render('error.hbs', { layout: 'notloggedin.hbs', error: "Nie zalogowano!" })
    }


})
////////////////////////////SAVE AND PREVIEW IMAGE/////////////////////////////////
app.post('/saveImage', function (req, res) {
    let form = formidable({});
    form.keepExtensions = true;
    form.parse(req, function (err, fields, files) {
        fs.rename(files.img.path, path.join(__dirname, 'upload', fields.path), (err) => {
            res.send('Zapisano pomyślnie!')
        })
    })
})

app.get('/previewFile', function (req, res) {
    if (req.cookies.login) {
        let root = req.query.name;
        if (fs.existsSync(path.join(__dirname, 'upload', root))) {
            res.sendFile(path.join(__dirname, 'upload', root))
        }
    } else {
        res.render('error.hbs', { layout: 'notloggedin.hbs', error: "Nie zalogowano!" })
    }
})


////////////////////////////////////////////////////////////////////
app.get('/saveFile', function (req, res) {
    if (req.cookies.login) {
        let content = req.query.content;
        let root = req.query.root;
        fs.writeFile(path.join(__dirname, 'upload', root), content, (err) => {
            if (err) throw err;
            res.redirect(`/fileEditor?name=${root}`)
        })
    } else {
        res.render('error.hbs', { layout: 'notloggedin.hbs', error: "Nie zalogowano!" })
    }

})

app.get("/rnFile", function (req, res) {
    if (req.cookies.login) {
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
    } else {
        res.render('error.hbs', { layout: 'notloggedin.hbs', error: "Nie zalogowano!" })
    }
})

app.post("/saveSettings", function (req, res) {
    fs.writeFile(path.join(__dirname, 'static', 'data', 'editor-settings.json'), JSON.stringify(req.body), (err) => {
        if (err) throw err;
        console.log('zapisano');
        res.send('zapisano');
    })
})

app.post("/filemanager", function (req, res) {
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
        res.redirect('/filemanager');
    });
})

app.use(express.static('static'));
app.use(express.static('upload'));
app.listen(PORT, function () {
    console.log(`Serwer działa na porcie: ${PORT}`)
})