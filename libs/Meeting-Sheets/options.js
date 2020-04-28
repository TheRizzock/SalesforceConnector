//Get data the user populates the form with
function getData(){
    var vals = {'Title Page' : $('#title').is(":checked"),
                'TOC' : $('#title').is(":checked"),
                'Meeting Info' : $('#meeting-info').is(":checked"),
                'Conversation' : $('#convo').is(":checked"),
                'Red Issues' : $('#reds').is(":checked"),
                'Company Desc':$('#desc').is(":checked"),
                'Chevrons' : $('#chevs').val(),
                'Bio': $('#bio').is(":checked"),
                'Hist': $('#hist').is(":checked"),
                'Add Props' : $('#prosp').val()

                }
    return vals
}
//Fill last selection box with all the accounts contacts
function appendContacts(recs,primary){
    console.log(primary)
    for (i of recs){
        if (i.Name !== primary){
            var option = document.createElement("option");
            option.text = i.Name;
            option.value = JSON.stringify(i);
            var select = document.getElementById("prosp");
            select.appendChild(option);
        }
    }
}

//Reterieve SO Token from salesforce
function getToken(callback) {
        chrome.storage.sync.get(["token","sObject",'instance_url','Account'],callback);
}


//gett all RESP API data from the pop-up through message sending
//run AJAX to get flash history
//Pass meesage data to background for retrival from the templatePopulator.js
chrome.runtime.sendMessage({action: 'getSource'}, function(response) {
    console.log(response.source)
    appendContacts(response.source[3],response.source[0].Text_Copy_of_Contact__c)
    $(function(){

        $('#go').click(function(e){
            e.preventDefault();
            getToken(function(collect){
                var link = "/services/data/v45.0/";
                var query = `query?q=select+name,contact__c,Text_Copy_of_Contact__c,Notes__c+from+ClientActivities__c+where+name='Flash Report'+AND+contact__c+IN+${response.source[2]}+order+by+Date_Time__c+desc+nulls+last+limit+10`
                var body = collect.instance_url + link + query;
                $.ajax({
                    type: 'GET',
                    url:body,
                    headers: {'Authorization' : 'Bearer ' + collect.token,'Content-Type':'application/javascript'},
                    success:function(flash) {
                        console.log(flash)
                        response.source.push(flash.records)
                        var obj = {'MeetingQuery':response.source,'docForm':getData()}
                        chrome.runtime.sendMessage({action: "putSourceTwo",source:obj});
                        window.close();
                    }
                });
            });

        });

    });


});


