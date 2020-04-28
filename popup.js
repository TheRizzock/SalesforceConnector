function getAccounts(input){
    if (input.records[0].Parent){
        var idLst = [input.records[0].Id,input.records[0].Parent.Id]
    }
    else
    {
        var idLst = [input.records[0].Id]
    }
    if (input.records[0].ChildAccounts){
        for (x of input.records[0].ChildAccounts.records){
            idLst.push(x.Id)
        }
    }

    var uniqueId = "('" + Array.from(new Set(idLst)).join("','") + "')"
    console.log(uniqueId)

    return uniqueId
}

function prepContacts(accountId,records){
    var thisAcct= [];
    var recordsSt = [];

    for (rec of records){
        if (rec.AccountId === accountId){
            thisAcct.push(rec)
        }
        recordsSt.push(rec.Id)
    }
    var uniqueId = recordsSt.join("','")
    var contactSt = `('${uniqueId}')`
    return [contactSt, thisAcct]

}

$(function(){


    // Collects local storage params for use in the pop.html, i.e. button click
    // to create meeting sheets
    function getToken(callback) {
        chrome.storage.sync.get(["token","sObject",'instance_url'],callback);
    }
    chrome.storage.sync.get(["AccountName"],function(result){;
        $('#filler').text(result.AccountName)
        console.log(result.AccountName)
    });



    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        var url = tabs[0].url.split('/');

        if (url[5] === "ClientActivities__c" && url[6].length === 18){
            console.log(url)
            chrome.storage.sync.set({'sObject':url[6]}, function() {
            // Notify that we saved.
                console.log('tokensaved')
                console.log('oAuth Token saved');
                });
        }
        else{
            chrome.storage.sync.remove("sObject", function() {
                console.log("sObject Cleared");
            });
        }
    });

    var link = "/services/data/v45.0/sobjects/ClientActivities__c/";

    $("#authorize-button").click(function() {
        window.oauth2.start();
    });

    $("#meeting-sheets-button").click(function() {
        getToken(
            function(collect){
            console.log(collect.sObject)
            if (collect.sObject == null){
                alert('This button only works on a Client Activity Page, on lightning experience currently')
            }
            else
            {
            console.log(collect.token);
            var body = collect.instance_url + link + collect.sObject;
            console.log(body);
            console.log(collect.instance_url)

            $.ajax({
                type: 'GET',
                url:body,
                headers: {'Authorization' : 'Bearer ' + collect.token,'Content-Type':'application/javascript'},
                success:function(data) {
                    console.log(data)
                    var accountSO = data.Account__c
                    var link = "/services/data/v45.0/sobjects/Account/";
                    var body = collect.instance_url + link + accountSO;
                    $.ajax({
                            type: 'GET',
                            url:body,
                            headers: {'Authorization' : 'Bearer ' + collect.token,'Content-Type':'application/javascript'},
                            success:function(accountInfo) {
                                var issues = [data,accountInfo];
                                var link = "/services/data/v45.0/";
                                var query = `query?q=select+id,parent.id,(select+id+from+childaccounts)+from+account+where+id='${accountSO}'`
                                console.log(collect.token);
                                var body = collect.instance_url + link + query;
                                console.log(body);
                                console.log(collect.instance_url)

                                $.ajax({
                                    type: 'GET',
                                    url:body,
                                    headers: {'Authorization' : 'Bearer ' + collect.token,'Content-Type':'application/javascript'},
                                    success:function(accounts) {
                                        console.log(accounts)
                                        var filterLst = getAccounts(accounts)
                                        var query = `query?q=select+id,name,AccountId,Title,Phone,Email,OtherPhone,Biography__c+from+Contact+where+AccountID+In${filterLst}+order+by+name+asc+nulls+last`
                                        var body = collect.instance_url + link + query;
                                        $.ajax({
                                            type: 'GET',
                                            url:body,
                                            headers: {'Authorization' : 'Bearer ' + collect.token,'Content-Type':'application/javascript'},
                                            success:function(contacts) {
                                                var cnts = prepContacts(accountSO,contacts.records)
                                                chrome.runtime.sendMessage({action: "putSource",source:[data,accountInfo,cnts[0],cnts[1]]});

                                            }
                                        });
                                        }

                                    });
                                }
                            });

                    }
                });
            }
        });

    });

    $('#help-button').click(function(){
//         var helpUrl = chrome.extension.getURL('Documentation/Documentation.pdf');
//         chrome.tabs.create({url: helpUrl, active: true});
        getToken(
            function(collect){


        });


    });

    $('#red-issue-button').click(function(){


        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        // query the active tab, which will be only one tab
        //and inject the script in it
            chrome.tabs.executeScript(tabs[0].id, {file: "libs/Red-Issue-Scraper/Article-Scraper.js"});

        });
    });
});
