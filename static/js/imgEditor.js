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
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        const DOMdisplay = document.getElementById("display")
        let image = new Image()
        image.src = DOMdisplay.style.backgroundImage.slice(4, -1).replace(/"/g, "");
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0, image.width, image.height);

        canvas.toBlob((blob) => {
            let reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function () {
                let data = reader.result;
                console.log(data);
                const toSend = {
                    path: document.getElementById('path').value,
                    data: data
                }
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(toSend)
                };
                fetch('/saveImg', options)
                    .then(response => response.blob())
                    .then(data => {
                        alert('Obrazek zapisany!')
                    })
                    .catch(error => console.log(error));
            }
        })
    }

}
