
function getToken(callback) {
        chrome.storage.sync.get(["token","sObject",'instance_url'],callback);
    }

function checkActive(){
    chrome.storage.sync.get("Account", function(result) {
       var locals = window.location.href;
       var matcher = locals.match(/\/[a-zA-Z0-9]{18}\//g)[0].replace(/\//g,'');
       if (matcher === result.Account){
            document.getElementById("active-one").style.color = 'green';
            document.getElementById("active-one").innerHTML = 'Active';
            document.getElementById("active-two").style.color = 'green';
            document.getElementById("active-two").innerHTML = 'Active';
        }
        else{
            document.getElementById("active-one").style.color = 'red';
            document.getElementById("active-one").innerHTML = 'Inactive';
            document.getElementById("active-two").style.color = 'red';
            document.getElementById("active-two").innerHTML = 'Inactive';
        }
    });
}

function getAccount(){
    var locals = window.location.href;
    if (locals.match(/\/[a-zA-Z0-9]{18}\//g) && locals.match(/\/Account\//g)){
        var sObject = locals.match(/\/[a-zA-Z0-9]{18}\//g)[0].replace(/\//g,'');
        var acctnm = document.title.replace(' | Salesforce','');
        chrome.storage.sync.set({'Account' : sObject, 'AccountName':acctnm}, function() {
            // Notify that we saved.
            console.log(sObject);
                                });
    }
    else{
        document.parentNode.removeChild(getElementById('active-account'))
    }
    checkActive();
}

function appendBadge(){
    var locals = window.location.href;
    var myDiv = document.getElementById('active-account-one')
    var onAccount = locals.match(/\/[a-zA-Z0-9]{18}\//g) && locals.match(/\/Account\//g);
    var forceLogo = document.getElementsByClassName("slds-global-header__logo")
    console.log(forceLogo)
    if (myDiv == null && onAccount){
        var array = ['one','two'];
        var count = 0;
        for (i of forceLogo){
            var appContainer = document.createElement('div');
            appContainer.title = 'Click to Make Account Active';
            appContainer.className = 'ui-amzext-cnt-badge';
            appContainer.id = 'active-account-' + array[count]
            appContainer.onclick = getAccount;
            i.appendChild(appContainer);


            var myDiv = document.getElementById('active-account-'+array[count])
            console.log(myDiv)

            var im = document.createElement('img')
            im.src = chrome.extension.getURL("images/PRO_BOT_48x48.png");
            im.className = "badge";

            var para = document.createElement("p");
            para.id = 'active-'+array[count]
            para.className = 'woralign'
            with (para.style){
                color = 'red';
                fontSize = '116%';
                }
            var node = document.createTextNode("Inactive");
            para.appendChild(node);
            myDiv.appendChild(im)
            myDiv.appendChild(para);
            count+=1
        }
        checkActive()
    }
    else if (myDiv != null && !onAccount){
        myDiv.parentNode.removeChild(myDiv)
        document.getElementById('active-account-two').parentNode.removeChild(document.getElementById('active-account-two'))
    }
    else{
    checkActive()
    }

}



appendBadge();
checkActive();


