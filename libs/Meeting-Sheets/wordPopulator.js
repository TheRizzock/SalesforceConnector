$(document).ready(function() {
    var o = {
    filename: $(document).find("title").text() +'.doc',
    margins: '0.5in'
                };
    $(document).googoose(o);
});