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

    document.getElementById('previewBtn').onclick = () => {
        console.log('działa');

        // const options = {
        //     method: "POST",
        //     body: getFileSource()
        // };
        console.log(getFileSource());
        // fetch('/dupa', options)
        //     .then(response => response.text())
        //     .then(data => {
        //         console.log(data); // Response from the server
        //     })
        //     .catch(error => console.log(error));
    }

    function getFileSource() {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        const DOMdisplay = document.getElementById("display")
        let image = new Image()
        image.src = DOMdisplay.style.backgroundImage.slice(4, -1).replace(/"/g, "");
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0, image.width, image.height);

        canvas.toBlob((blob) => {
            let form = new FormData()
            form.append('image', blob, 'altered_img.png');
        })
    }
}
