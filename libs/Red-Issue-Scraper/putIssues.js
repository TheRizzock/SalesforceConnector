function optionControl(array){
    var d = {};
    var count = 0;
    for (i of array){
        d['Option '+toString(count)] = i;
        count += 1
    }
    return d
}

function getToken(callback) {
        chrome.storage.sync.get(["token","sObject",'instance_url','Account'],callback);
}

function removeTab() {
                chrome.tabs.getCurrent(function(tab) {
                    chrome.tabs.remove(tab.id);
                });
            };

function save(option,value){

    getToken(
    function(collect){
        console.log(collect.token);
        var link = "/services/data/v45.0/sobjects/Account/";
        var body = collect.instance_url + link + collect.Account;
        console.log(body);

        $.ajax({
            type: 'GET',
            url:body,
            headers: {'Authorization' : 'Bearer ' + collect.token,'Content-Type':'application/javascript'},
            success:function(data) {
                let corpus = null;
                if (!data.News__c || option === 'replace'){
                   corpus = value
                }
                else if (option === 'append'){
                    corpus = data.News__c + '\n' + value
                    console.log('appending')

                }
                console.log(corpus)
                if (corpus.length <= 1600000){
                    $.ajax({
                            type: 'PATCH',
                            url:body,
                            headers: {'Authorization' : 'Bearer ' + collect.token,'Content-Type':'application/json'},
                            data: JSON.stringify({'News__c':corpus}),
                            success: function(){
                                console.log('whelp!')
                                removeTab();
                                }
                    });

                    alert(value)
                }
                else if (option === 'replace'){
                    // Handle Replacing
                    alert("The conetent you are trying to append or replace with exceeds the 1600000 character limit salesforce allows, please reduce the corpus text")
                }

                }
            });
    }
);
}

chrome.runtime.sendMessage({action: 'getArticle'}, function(response) {
    var payload = response.source;
    var heads = payload.headers;
    var par = payload.paragraphs;

    $('input[name="webpage-location"]').val(payload.link);
    console.log(payload.link)
    var $el = $("#titles");
    $el.empty(); // remove old options
    $.each(optionControl(heads), function(key,value) {
        $el.append($("<option></option>")
        .attr("value", value));
    });
    $('textarea[id="content"]').val(par.join('\n\r'));
    $('textarea[id="content"]').val(par.join('\n\r'));
    $('#article-title').val(heads[0]);

});

chrome.storage.sync.get("AccountName", function(result) {
    $("#account").text(result.AccountName);
    $("#account2").text(result.AccountName);
});

chrome.storage.sync.get("AccountName", function(result) {
    $("#account").text(result.AccountName);
    $("#account2").text(result.AccountName);
});


function dataPrep(){
     var content = $('#content').val(); //.split('\n').join('</p><br><p>');
     var title = $('#article-title').val();
     var path = $('#url').val();

     content += '∴'
     title += '∴'
     path += '∴'
     var corp = title + '\n' + path + '\n' + content + 'Ω'
     return corp
}


$(function(){
    $('#append').click(function(e){
        e.preventDefault();
        var data = dataPrep();

        save('append',data);

    });
    $('#replace').click(function(e){
        e.preventDefault();
        var data = dataPrep();
        save('replace',data);
    });
});