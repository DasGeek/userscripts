// ==UserScript==
// @name         Xbox Plaintext Friend-list
// @namespace    https://www.athenasvanguard.com/
// @version      0.1
// @description  Grabs a plaintext version of an Xbox profile's friend list
// @author       Das_Geek
// @match        https://account.xbox.com/*
// @grant        none
// ==/UserScript==

const config = { childList: true, subtree: true };
var friendNames = new Array();

var copyButton = document.createElement('span');
var copyButtonText = document.createTextNode('Copy');
copyButton.appendChild(copyButtonText);
copyButton.onclick = function() {
    var friendText = friendNames.join("\n");
    navigator.clipboard.writeText(friendText);
};

function waitForAddedNode(params) {
    new MutationObserver(function(mutations) {
        var par = params.id || params.className || params.tagName;
        var el = document.querySelector(par);
        if (el && !document.getElementById('tertiaryArea').contains(el)) {
            this.disconnect();
            params.done(el);
        }
    }).observe(params.parent || document, {
        subtree: !!params.recursive,
        childList: true,
    });
}

(function() {
    'use strict';
    waitForAddedNode({
        id: '#primaryArea',
        recursive: true,
        done: function(el) {
            waitForAddedNode({
                tagName: 'xbox-friend-entity',
                parent: document.getElementById('primaryArea'),
                recursive: true,
                done: function(el) {
                    var nameNodes = el.querySelectorAll('span.name');
                    for (let name of nameNodes) {
                        friendNames.push(name.innerText);
                    }
                    el.querySelector('div.friendListTitleText').appendChild(copyButton);
                }
            })
        }
    });
})();
