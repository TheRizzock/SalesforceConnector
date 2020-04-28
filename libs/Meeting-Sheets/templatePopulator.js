//Case, pick the type of chevron to add to the template
//Additional case options here require addition the options.html
function chevrons(industry){
    switch(industry){
        case 'Insurance':
            var title = "Insurance Process Chevrons";
            var chevs = 'Field Operations/Sales &#8594; Agent/Broker Submission &#8594; Underwriting &#8594; Bind & Issue &#8594; Onboarding &#8594; Policyholder Service &#8594; Claims';
            break;
        case 'Commercial Banking':
            var title = "Commercial Banking Process Chevrons";
            var chevs = "Relationship Manager &#8594; Application &#8594; Underwriting &#8594; AML/KYC &#8594; Loan Decision & Funding &#8594; Onboarding &#8594; Servicing";
            break;
        case 'Retail Banking':
            var title = "Retail Banking Process Chevrons";
            var chevs = 'Physical Channel (Branch/Web/Mobile) &#8594; Customer Data Capture &#8594; Underwriting &#8594; Onboarding &#8594; Service &#8594; Cross-Selling';
            break;
        case 'Maintenance':
            var title = 'Maintenance Process Chevrons';
            var chevs = 'Sales &#8594; Planning &#8594; Procure &#8594; Order &#8594; Manufacture &#8594; Logistics & Distribution &#8594; Demand Forecast';
            break;
        case 'Utilities':
            var title = 'Utilities Process Chevrons'
            var chevs = 'Analysis &#8594; Engineering &#8594; Procurement &#8594; Construction &#8594; Routine Service &#8594; Field Operations &#8594; Decommission Decision';
            break;
        default:
            var title = 'Process Chevrons'
            var chevs = 'XXXX &#8594; XXXX &#8594; XXXX &#8594; XXXX &#8594; XXXX';
    }
    return [title, chevs]
}

//Generalized information pull from REST and used to populate page 1
//of meeting sheets
function meetingInfo(payload,industry){
    var d = new Date(payload.Date_Time__c);
    d.setHours(d.getHours() - 1);
    console.log(payload);
    var weekDay = Intl.DateTimeFormat('en-US', { weekday: 'long'}).format(d.getDay())
    var custDate = weekDay + ' ' + d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
    var titleDate = String(d.getMonth() + 1) + '-' + String(d.getDate()) + '-' + String(d.getFullYear()).slice(2,4);

    var title = titleDate + ' PRO ' + payload.Text_Copy_of_Contact__c + ' Meeting Sheet';
    var chooseChevs = chevrons(industry)

    document.title = title

    console.log(title)

        // First Table Value
    $('#company-contact').text(payload.Account_Name__c + ' / ' + payload.Text_Copy_of_Contact__c)
    $('#company-contact').text(title)
    $('#company-name').text(payload.Account_Name__c)
    $('#meeting-date').text(custDate)
    $('#bda').text(payload.Contact_Owner__c)
    $('#bde').text(payload.Text_Copy_of_BDE__c)

    // Second Table Values
    $('#prospect-name').text(payload.Text_Copy_of_Contact__c)
    $('#ea-name').text(payload.Assistant_Information__c)
    $('#prospect-tile').text(payload.Title__c)

    $('#Comapany-Phone-Number').text(payload.Main_Phone__c)

    $('#Other-Phone-Number').text(payload.Other_Phone__c)
    $('#prospect-email').text(payload.Contact_Email__c)

    // Thrid Table Values
    $('#call-in').text(payload.Employees__c)

    $('#company-address').text(payload.Contact_Address__c)

    $('#revenue').text(payload.Sales__c)
    // PRocess Chevrons
    $('#chevron-title').html(chooseChevs[0])
    $('#chevron-input').html(chooseChevs[1])

}

//Reformate Red Issue research and sources, using omega and
// for all of characters, chooses to reduce the chance
//of unsuccessful chareter matching
function redIssues(account){
    var issues = account.News__c.split('\u03A9')
    for (art of issues.slice(0,-1)){
        var parts = art.split('\u2234')
        console.log(parts)
        console.log(parts.length)
        if (parts.length === 4){
            var contents = '<h2 class="ltwo"><a class="ltwo" href="' + parts[1].replace('\n','') +'">' + parts[0].replace('\n','') + '</a></h2><br>'
            contents += '<p>' + parts[2].replace(/\n/g,'</p><p>')

            $('#red-issues').append(contents)
        }
    }
}

//Append flash history to the document
//Additional formatting options will go in here
function appendHistory(data){
    for (x of data){
        var text = x.Notes__c.replace(/\n/g,'</p><p>')
        text = '<p>' + text + '</p>'
        $('#history').append(text)
    }

}

//Replace line break with in line paragraph </br> tags
function replacer(ob,st){
    for (x of ob){
        var re = RegExp('</br>'+x,'g');
        st = st.replace(re,'</br><b>'+x+'</b>');
    }
    return st
}

//if there are additional prospects, append their
//meeting information to page one
//table format comes directly from the template
//named miso.html at the time of development
function addedProsps(props){
    for (z of props){
        var d = JSON.parse(z)
        var insertHTML = `
                    <tr>
                        <td class="Primary-col-3">| </td>
                        <td colspan="3">|</td>
                    </tr>
                    <tr>
                        <td class="Primary-col-3">Prospect:</td>
                        <td colspan="3">${d.Name}</td>
                    </tr>
                    <tr>
                        <td class="Primary-col-3">Title:</td>
                        <td colspan="3">${d.Title}</td>
                    </tr>
                    <tr>
                        <td class="Primary-col-1">Company Number:</td>
                        <td class="Secondary-col-1" id="Comapany-Phone-Number">${d.Phone}</td>
                        <td class="Primary-col-2">EA:</td>
                        <td class="Secondary-col-2">XXXX</td>
                    </tr>
                    <tr>
                        <td class="Primary-col-1">Other Phone:</td>
                        <td class="Secondary-col-1">${d.OtherPhone}</td>
                        <td class="Primary-col-2">Phone:</td>
                        <td class="Secondary-col-2">XXXX</td>
                    </tr>
                    <tr>
                        <td class="Primary-col-1">Email:</td>
                        <td class="Secondary-col-1">${d.Email}</td>
                        <td class="Primary-col-2">Email:</td>
                        <td class="Secondary-col-2">XXXX</td>
                    </tr>`;
        $('#prospects-inner').append(insertHTML)
    }
}

//if there are additional prospects and bio's are required,
//append them using this function
function addedProspsBio(props){
    for (z of props){
        var d = JSON.parse(z)
        var header = '<h2>' + d.Name + ' - ' + d.Title + '</h2>'
        $('#prospect-bio').append(header)
        if (d.Biography__c){
            var body = d.Biography__c.replace(/\n/g,'</p><p>')
            body = '<p>' + body + '</p>'
            $('#prospect-bio').append(body)
        }

    }
}



//recieve message with data from options.html, which orgins for the pop-up
//meeting sheets button
chrome.runtime.sendMessage({action: 'getSource'}, function(response) {
    // Set image header
    var url = chrome.extension.getURL('images/meetImage2.png');
    $('#logo').attr("src",url);
    //Get Queried data payload
    var payload = response.source.MeetingQuery[0] //Queried Meeting Information
    var acct = response.source.MeetingQuery[1] //queried account information (additional to payload)
    var hist = response.source.MeetingQuery[4] //queried flash report meeting history
    var options = response.source.docForm // document sections to fill

    // General meeting information
    if (options['Meeting Info']){
        meetingInfo(payload,options['Chevrons'])
    }

    // Meeting Notes (set by bda)
    if (payload.Notes__c && options['Conversation']){
        $('#conversation-notes').html(payload.Notes__c.replace(/(?:\r\n|\r|\n)/g, '</br>'))
    }

    // Red Issues (generated through red issue importer)
    if (options['Red Issues'] && acct.News__c){
        redIssues(acct);
    }

    //Comapny Description from Salesforce
    if (payload.Account_Bio__c && options['Company Desc']){
        var notes = payload.Account_Bio__c.replace(/(?:\r\n|\r|\n)/g, '</br>')
        notes = replacer(['Operations','Geographic Reach','Sales and Marketing','Financial Performance','Strategy','Mergers and Acquisitions', 'Company Background','Products & Operations'],notes)
        $('#company-info-area').html(notes)
    }

    // Prospect Background
    if (payload.Contact_Bio__c && options['Bio']){
        var header = '<h2>' + payload.Text_Copy_of_Contact__c + ' - ' + payload.Title__c + '</h2>';
        var body = payload.Contact_Bio__c.replace(/(?:\r\n|\r|\n)/g, '</br>');
        $('#prospect-bio').append(header)
        $('#prospect-bio').append(body)
    }
    //Flash Report meeting history
    if (options['Hist'] && hist.length > 0){
        appendHistory(hist)
    }
    //Additonal Prospect to meeting Info
    if (options['Add Props'].length > 0){
        addedProsps(options['Add Props'])
    }

    //
    if (options['Add Props'].length > 0 && options['Bio']){
        addedProspsBio(options['Add Props'])
    }


//    genWord()
});
