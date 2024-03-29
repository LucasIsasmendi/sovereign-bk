import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { TAPi18n } from 'meteor/tap:i18n';
import { $ } from 'meteor/jquery';

import { getProfileFromUsername, getAnonymous } from '/imports/startup/both/modules/User';
import { removeContract } from '/imports/startup/both/modules/Contract';
import { getProfileName, stripHTMLfromText } from '/imports/ui/modules/utils';
import { timeSince } from '/imports/ui/modules/chronos';
import { displayModal } from '/imports/ui/modules/modal';
import { animationSettings } from '/imports/ui/modules/animation';
import { addChoiceToBallot } from '/imports/ui/modules/ballot';
import { displayNotice } from '/imports/ui/modules/notice';

import './feedItem.html';
import '../../components/decision/stage/stage.js';
import '../../components/decision/tag/tag.js';
import '../../components/identity/avatar/avatar.js';

Template.feedItem.onRendered = function onRender() {
  //Embedded mode means that Items are in an embedded feed to be selected (ie: for a ballot)
  if (this.firstNode.parentNode.id == 'proposalSuggestions') {
    Session.set('embeddedMode', true);
  } else {
    Session.set('embeddedMode', false);
  }

};

Template.feedItem.helpers({
  description: function () {
    var text = new String();
    var profile = new Array();
    if (this.kind == 'DELEGATION') {
      for (user in this.signatures) {
        profile.push(getProfileFromUsername(this.signatures[user].username))
      }
      text = this.description;
      if (profile.length == 2) {
        text = text.replace('<delegator>', getProfileName(profile[0]));
        text = text.replace('<delegate>', getProfileName(profile[1]));
      }
      return stripHTMLfromText(text).replace(/(([^\s]+\s\s*){35})(.*)/,"$1…");
    } else {
      return stripHTMLfromText(this.description).replace(/(([^\s]+\s\s*){35})(.*)/,"$1…");
    }
  },
  url: function () {
    if (this.stage == 'DRAFT') {
      return '/vote/draft?id=' + this._id;
    } else {
      return this.url;
    }
  },
  tags: function () {
    return this.tags;
  },
  sinceDate: function (timestamp) {
    return TAPi18n.__('posted') + ' ' + timeSince(timestamp);
  },
  editorMode: function (stage) {
    if (stage == 'DRAFT') { return true } else { return false };
  },
  voterMode: function (stage) {
    if (stage == 'LIVE') { return true } else { return false };
  },
  embeddedMode: function () {
    return Session.get('embeddedMode');
  },
  signatures: function () {
    if (this.signatures) {
      return this.signatures;
    } else {
      return [getAnonymous()]
    }
  },
  userIsAuthor: function (signatures) {
    if (Meteor.user() != null) {
      if (Meteor.user()._id == this.owner) {
        return true;
      }
      for (stamp in signatures) {
        if (signatures[stamp]._id == Meteor.user()._id) {
          return true;
        }
      }
    }
    return false;
  },
  delegationMode: function (kind) {
    if (kind == 'DELEGATION') {
      return true;
    }
    return false;
  }
});

Template.feedItem.events({
  'click .micro-button-remove': function (event) {
    var proposalTitle = event.target.parentNode.getAttribute('title');
    var proposalId = event.target.parentNode.getAttribute('id');
    var dom = '#' + 'feedItem-' + proposalId;
    displayModal(
      true,
      {
        icon            : 'images/remove-item.png',
        title           : TAPi18n.__('remove-title'),
        message         : TAPi18n.__('remove-draft-warning') + " <br><em>" + proposalTitle + "</em>",
        cancel          : TAPi18n.__('not-now'),
        action          : TAPi18n.__('remove-draft'),
        displayProfile  : false
      },
      function() {
        $(dom)
          .velocity({ 'opacity' : 0,  'marginTop' : '0px', 'marginBottom' : '0px', 'height' : 0}, {
            duration: animationSettings.duration,
            complete: function() {
              removeContract(proposalId);
              displayNotice(TAPi18n.__('remove-draft-success'), true);
            }
        });
      }
    );
  },
  'click .micro-button-addballot': function (event) {
    addChoiceToBallot(Session.get('contract')._id, event.target.parentNode.getAttribute('id'));
  }
})
