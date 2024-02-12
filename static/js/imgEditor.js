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

}
