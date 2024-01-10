const fs = require("fs")
const path = require("path")


// const filepath2 = path.join(__dirname, "static", "upload", "file02.txt")
// data = 'CHRZĄSZCZ BRZMI W TRZCINIE W SZCZEBRZESZYNIE'
// fs.writeFile(filepath2, data, (err) => {
//     if (err) throw err
//     console.log("plik nadpisany");

//     data2 = "\n\nNO CÓŻ ŻE ZE SZWECJI"
//     fs.appendFile(filepath2, data2, (err) => {
//         if (err) throw err
//         console.log("plik utworzony\n\n\n");
//     })
// })


// const filepath = path.join(__dirname, 'static', 'upload', 'xd.txt')



// if (fs.existsSync(filepath)) {
//     console.log("plik istnieje");
//     fs.readFile("static/upload/xd.txt", "utf-8", (err, data) => {
//         if (err) throw err
//         console.log(data.toString());
//     })
//     fs.unlink(filepath, (err) => {
//         if (err) throw err
//         console.log("czas 1: " + new Date().getMilliseconds());
//     })
// } else {
//     console.log("plik nie istnieje");
// }

// ////////////////////////////////////KATALOGI
// if (!fs.existsSync("./newdir")) {
//     fs.mkdir("./newdir", (err) => {
//         if (err) throw err
//         console.log("jest");
//         if (fs.existsSync("./newdir")) {
//             fs.rmdir("./newdir", (err) => {
//                 if (err) throw err
//                 console.log("nie ma ");
//             })
//         }
//     })
// }

fs.readdir(__dirname, (err, files) => {
    if (err) throw err
    console.log("lista", files);
})