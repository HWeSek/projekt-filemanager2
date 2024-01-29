window.onload = function () {
    //////////////////////INIT EDITOR SETTINGS//////////////////////////////
    fetch('/data/editor-settings.json')
        .then(response => response.json())
        .then(data => {
            document.getElementById('line_num').style.fontSize = `${data.font_size}px`
            document.getElementById('text_area').style.fontSize = `${data.font_size}px`
            document.getElementById('line_num').className = data.theme
            document.getElementById('text_area').className = data.theme
            document.getElementById('lines').className = data.theme
        })
        .catch(error => console.log(error));





    ///////////////////////////////SCROLL ECT///////////////////////////////////////
    let area = document.getElementById('text_area')
    let enters = area.value.split("\n").length;
    document.getElementById('line_num').value = '';
    for (let i = 1; i <= enters; i++) document.getElementById('line_num').value += (i + "\n");


    area.onkeyup = function () {
        document.getElementById('line_num').scrollTo(0, area.scrollTop);
        let enters = area.value.split("\n").length;
        document.getElementById('line_num').value = ''
        for (let i = 1; i <= enters; i++) {
            document.getElementById('line_num').value += (i + "\n")
        }
    }

    area.onscroll = function () {
        document.getElementById('line_num').scrollTo(0, area.scrollTop);
    }


    /////////////////////////////////FONT_SIZE////////////////////////////////////////////
    function fontSize(dir) {
        let font_size = parseInt(window.getComputedStyle(document.getElementById("text_area")).fontSize)
        if (dir == 1) {
            console.log('up')
            document.getElementById('line_num').style.fontSize = `${font_size + 1}px`
            document.getElementById('text_area').style.fontSize = `${font_size + 1}px`
        } else if (dir == 0) {
            console.log('down')
            document.getElementById('line_num').style.fontSize = `${font_size - 1}px`
            document.getElementById('text_area').style.fontSize = `${font_size - 1}px`
        }
    }

    document.getElementById('fontD').addEventListener('click', () => { fontSize(0) })
    document.getElementById('fontU').addEventListener('click', () => { fontSize(1) })
    //////////////////////////////////THEMES/////////////////////////////////////////
    const themes = ['default-theme', 'dark-theme', 'tokio-theme'];
    let cycle = 0;
    document.getElementById('themeCh').addEventListener('click', () => {
        cycle++;
        document.getElementById('line_num').className = themes[cycle];
        document.getElementById('text_area').className = themes[cycle];
        document.getElementById('lines').className = themes[cycle];
        cycle = cycle % 3;
    })

    /////////////////////////////////SAVING SETTINGS///////////////////////////////
    document.getElementById('saveEditorSettings').addEventListener('click', () => {
        const data = {
            font_size: parseInt(window.getComputedStyle(document.getElementById("text_area")).fontSize),
            theme: themes[cycle]
        }
        const options = {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };

        fetch('/saveSettings', options)
            .then(recieved => alert('Zapisano pomyślnie!'))
            .catch(error => console.log(error));
    })
}