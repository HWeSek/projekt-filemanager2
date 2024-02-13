////////////CHANGE DISPLAY FILTER //////////////////////////
function selectFilter(filter) {
    if (filter == 'none') {
        document.getElementById('display').style.filter = '';
    } else {
        document.getElementById('display').style.filter = `${filter}(100%)`
    }
}
window.onload = function () {
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////IMG EDITOR////////////////////////////////////////////////////
    let toggled = false;
    document.getElementById('filterToggle').addEventListener('click', function () {
        toggled = toggled == true ? false : true;
        if (toggled) {
            document.getElementById('filters').style.width = '200px'

        } else {
            document.getElementById('filters').style.width = '0px'
        }
    })



    document.getElementById('saveBtn').onclick = () => {
        let canvas = getCanvas()
        canvas.toBlob((blob) => {
            let formData = new FormData();
            formData.append('img', blob, 'altered_img.png')
            formData.append('path', document.getElementById('path').value)
            const options = {
                method: "POST",
                body: formData
            };
            fetch('/saveImage', options)
                .then(response => response.text())
                .then(data => {
                    alert('Obrazek zapisany!')
                })
                .catch(error => console.log(error));
        })
    }
}


function getCanvas() {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    const DOMdisplay = document.getElementById("display")
    let image = new Image()
    image.src = DOMdisplay.style.backgroundImage.slice(4, -1).replace(/"/g, "");
    canvas.width = image.width;
    canvas.height = image.height;
    context.filter = DOMdisplay.style.filter;
    context.drawImage(image, 0, 0, image.width, image.height);
    return canvas
}

