import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { TAPi18n } from 'meteor/tap:i18n';

import './notice.html';

Template.notice.onRendered = function onRender() {
  behave(this.firstNode, 'fade');
};

Template.notice.helpers({
  label: function () {
    return TAPi18n.__(Session.get('noticeDisplay'));
  }
});
