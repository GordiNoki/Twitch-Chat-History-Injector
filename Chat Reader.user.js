// ==UserScript==
// @name         Chat Reader
// @namespace    *://www.twitch.tv.*
// @version      0.1
// @description  It's kinda working...
// @author       GeN (https://github.com/GordiNoki)
// @match        *://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?domain=twitch.tv
// @grant        none
// ==/UserScript==

var parseEventMoreShit = (d) => {
    let badges = d.sender.displayBadges.map(b => `<div class="InjectLayout-sc-588ddc-0 jFfYcJ"><button data-a-target="chat-badge"><img alt="${b.title}"
            aria-label="Значок «${b.title}»" class="chat-badge" src="${b.image1x}"
            srcset="${b.image1x} 1x, ${b.image2x} 2x, ${b.image4x} 4x"></button></div>`)
    let fragments = d.content.fragments.map(f => {
        if(f.content != null) {
            return `<div class="chat-line__message--emote-button" data-test-selector="emote-button"><div class="InjectLayout-sc-588ddc-0 jFfYcJ"><span data-a-target="emote-name"><div class="Layout-sc-nxg1ff-0 bBfLKw chat-image__container"><img alt="${f.text}"
                    class="chat-image chat-line__message--emote"
                    src="https://static-cdn.jtvnw.net/emoticons/v2/${f.content.emoteID}/default/dark/1.0"
                    srcset="https://static-cdn.jtvnw.net/emoticons/v2/${f.content.emoteID}/default/dark/1.0 1x,https://static-cdn.jtvnw.net/emoticons/v2/${f.content.emoteID}/default/dark/2.0 2x,https://static-cdn.jtvnw.net/emoticons/v2/${f.content.emoteID}/default/dark/3.0 4x"></div></span></div></div>`
        } else {
            return `<span class="" data-test-selector="chat-line-message-body"><span class="text-fragment"data-a-target="chat-message-text">${f.text}</span>`
        }
    })
    return `<div class="chat-line__message" data-a-target="chat-line-message" data-test-selector="chat-line-message" tabindex="0"><div class="Layout-sc-nxg1ff-0 jMIEhW"><div class="Layout-sc-nxg1ff-0 jMIEhW chat-line__message-container"><div class="Layout-sc-nxg1ff-0"><div class="Layout-sc-nxg1ff-0 mddis chat-line__no-background"><div class="Layout-sc-nxg1ff-0 gyYLVk chat-line__username-container"><span>${badges.join("")}</span><span class="chat-line__username" role="button" tabindex="0"><span><span class="chat-author__display-name" data-a-target="chat-message-username" data-a-user="${d.sender.login}" data-test-selector="message-username" style="color: ${d.sender.chatColor};">${d.sender.displayName}</span></span></span></div><span aria-hidden="true" data-test-selector="chat-message-separator">: </span>${fragments.join("")}</span></div>
            </div>
        </div>
    </div>
</div>`
}

(function() {
    'use strict';
    function chatDuck() {
        var style = document.createElement('style');
        style.innerHTML = `.mddis, .gyYLVk, .jFfYcJ {
  display: inline-block !important;
}`;
        document.head.appendChild(style);
        if(window.location.pathname.split("/").length == 2 && window.location.pathname.split("/")[1] != "") {
            var ClientID = window.document.body.innerHTML.match(/clientId="[^"]*/g)[0].substr(10);
            if(!ClientID) ClientID = "kimne78kx3ncx6brgo4mv6wki5h1ko";
            fetch("https://gql.twitch.tv/gql", { method: "POST", headers: {
                "Content-Type": "application/json",
                "Client-Id": ClientID,
            }, body: JSON.stringify([{
                "operationName": "MessageBufferChatHistory",
                "variables": {
                    "channelLogin": window.location.pathname.split("/")[1]
                },
                "extensions": {
                    "persistedQuery": {
                        "version": 1,
                        "sha256Hash": "323028b2fa8f8b5717dfdc5069b3880a2ad4105b168773c3048275b79ab81e2f"
                    }
                }
            }]) }).then(r=>r.json()).then(d => {
                var actualData = d[0].data.channel.recentChatMessages
                var chatElement = document.querySelectorAll(`[data-a-target='chat-scroller']`)[0]
                actualData.forEach(h => {
                    var asfd = document.createElement("div")
                    asfd.innerHTML = parseEventMoreShit(h).trim()
                    console.log(asfd.firstChild)
                    chatElement.lastChild.children[0].children[0].appendChild(asfd.firstChild)
                })
                var a = document.createElement("div")
                a.className = "Layout-sc-nxg1ff-0 chat-line__status"
                a.innerHTML = `<span class="CoreText-sc-cpl358-0">Предыдущие сообщения загружены!</span>`
                chatElement.lastChild.children[0].children[0].appendChild(a)
            })
        }
    }
    var oldHref = document.location.href;
    window.addEventListener("load", () => {
        var bodyList = document.querySelector("body")

        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (oldHref != document.location.href) {
                    oldHref = document.location.href;
                    console.log("pogchamp!")
                    chatDuck()
                }
            });
        });

        var config = {
            childList: true,
            subtree: true
        };

        observer.observe(bodyList, config);
        chatDuck()
    })
    if(document.readyState === "complete") {
        var bodyList = document.querySelector("body")

        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (oldHref != document.location.href) {
                    oldHref = document.location.href;
                    chatDuck()
                }
            });
        });

        var config = {
            childList: true,
            subtree: true
        };

        observer.observe(bodyList, config);
        chatDuck()
    }
})();