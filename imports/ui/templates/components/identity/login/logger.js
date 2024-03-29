import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './logger.html';
import './emailLogin.js';
import './blockchainLogin.js';

let currentTab = 0;

Template.logger.onRendered = function onRender() {
  displayTabContent(document.getElementById('tab-view'), currentTab)
}

Template.logger.helpers({
  multipleLoggers: function () {
    if (Meteor.settings.public.app.config.blockchainLogin == true) {
      return true;
    } else {
      return false;
    }
  }
});

Template.logger.events({
  "click #tab-button": function (event) {
    setTabValue(event);
    renderTabs(event.target.parentNode.parentNode.childNodes);
    displayTabContent(document.getElementById('tab-view'), currentTab)
  }
});

//Tab Component

function setTabValue(event) {
  var tab = event.target.parentNode;
  var tabCollection = tab.parentNode.childNodes
  if (tab.getAttribute('value') == "false") {
    for (var i = 0; i < tabCollection.length; i++) {
      if (tabCollection[i].nodeType == 1) {
        if (tabCollection[i].getAttribute('value') == "true") {
          tabCollection[i].setAttribute('value', false);
        }
      }
    }
    tab.setAttribute('value', true);
  };
}

function renderTabs(tabs) {
  var k = 0;
  for (var i = 0; i < tabs.length; i++) {
    if (tabs[i].nodeType == 1) {
      if (tabs[i].getAttribute('value') == "true") {
        tabs[i].setAttribute('class', 'tab tab-active');
        currentTab = k;
      } else {
        tabs[i].setAttribute('class', 'tab');
      }
      k ++;
    }
  };
};

function displayTabContent(tabView, currentTab) {
  for (var i = 0; i < tabView.childNodes.length; i++) {
    if (tabView.childNodes[i].nodeType == 1) {
      if (tabView.childNodes[i].getAttribute('tab') == currentTab) {
        tabView.childNodes[i].setAttribute('style', '');
      } else {
        tabView.childNodes[i].setAttribute('style', 'display:none');
      }
    }
  }
}
