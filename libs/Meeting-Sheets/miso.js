function convertImagesToBase64(targetDocumentElement) {
    var clonedDocumentElement = targetDocumentElement.cloneNode(true);

    var regularImages = targetDocumentElement.querySelectorAll("img");

    var clonedImages = clonedDocumentElement.querySelectorAll("img");
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    for (var i = 0; i < regularImages.length; i++) {

        var regularImgElement = regularImages[i];
        var clonedImgElement = clonedImages[i];

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        canvas.width = regularImgElement.width;
        canvas.height = regularImgElement.height;

        ctx.scale(regularImgElement.width / regularImgElement.naturalWidth, regularImgElement.height / regularImgElement.naturalHeight);
        ctx.drawImage(regularImgElement, 0, 0);

        // by default toDataURL() produces png image, but you can also export to jpeg
        // checkout function's documentation for more details
        var dataURL = canvas.toDataURL();


        clonedImgElement.setAttribute('src', dataURL);
    }

    canvas.remove();

    return clonedDocumentElement;
}



$(document).ready(function() {
    var convert = convertImagesToBase64(document.documentElement)
    var textFileAsBlob = new Blob(['\ufeff',convert.innerHTML], {
    type: 'application/msword'})
    var downloadLink = document.createElement("a");
    downloadLink.download = document.title;
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.onclick = function(e) { document.body.removeChild(e.target); };
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
});