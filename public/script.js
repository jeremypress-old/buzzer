
function selectColor(element) {
    console.log(element)
    const selected = document.querySelector('.clicked')
    if (selected) {
        selected.className = 'color-button';
    }
    (element).className = 'color-button clicked';
}

function buzz() {
    const selectedElement = document.querySelector('.clicked')
    const color = getComputedStyle(selectedElement).backgroundColor;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/buzz', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        color
    }));
}
