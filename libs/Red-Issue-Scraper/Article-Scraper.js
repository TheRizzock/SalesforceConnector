function comp(array){
    var array2 = [];
    for (i of array){
        array2.push(i.textContent)
    }
    return array2

}


//alert('CONTENT SCRIPT: I am running!');
var title = document.getElementsByTagName('h1');
console.log(title);
//alert(title);
var p = document.getElementsByTagName('p')
var url = window.location.href;
title = comp(title)
p = comp(p)
console.log(title)

var data = {'headers':title,'paragraphs':p,'link':url}

chrome.runtime.sendMessage({action: "articleSource",source:data});

