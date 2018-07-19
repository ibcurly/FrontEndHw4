(function(window) {
  'use strict';

  var App = window.App || {};
  var $ = window.jQuery;
  var EmailListKey = "TheKey16";
  var MostRecentEmail = "RecentEmailKey";
  var RemoteDataStore = window.App.RemoteDataStore;

  function CheckList(selector) {
    if (!selector) {
      throw new Error('No selector provided');
    }

    this.$element = $(selector);
    if (this.$element.length === 0) {
      throw new Error('Could not find element with selector: ' + selector);
    }
  }

  CheckList.prototype.addClickHandler = function(fn) {
    this.$element.on('click', 'input', function(event) {
      var email = event.target.value;
      this.removeRow(email);
      fn(email);
    }.bind(this));
  };

  CheckList.prototype.addRow = function(coffeeOrder) {
    // Remove any existing rows that match the email address
    this.removeRow(coffeeOrder.emailAddress);

    // Create a new instance of a row, using the coffee order info
    var rowElement = new Row(coffeeOrder);

    // Add the new row instance's $element property to the checklist
    this.$element.append(rowElement.$element);
  };

  CheckList.prototype.removeRow = function(email) {
    this.$element
      .find('[value="' + email + '"]')
      .closest('[data-coffee-order="checkbox"]')
      .remove();
    localStorage.removeItem(email);
    var cookieData = localStorage.getItem(EmailListKey);
    if (cookieData != null) {
      var emailList = String(cookieData).split(',');
      var newList = "";
      emailList.forEach(function(index) {
        if (index.indexOf('@') > -1 && index != email) {
          newList = newList + ',' + index + ',';
        }
      });
    }
    localStorage.setItem(EmailListKey, newList);
  };

  function Row(coffeeOrder) {
    var $div = $('<div></div>', {
      'data-coffee-order': 'checkbox',
      'class': 'checkbox'
    });

    var $label = $('<label></label>');

    var $checkbox = $('<input></input>', {
      type: 'checkbox',
      value: coffeeOrder.emailAddress
    });

    var description = coffeeOrder.size + ' ';
    if (coffeeOrder.flavor) {
      description += coffeeOrder.flavor + ' ';
    }

    description += coffeeOrder.coffee + ', ';
    description += ' (' + coffeeOrder.emailAddress + ')';
    description += ' [' + coffeeOrder.strength + 'x]';

    addOrderCookie(coffeeOrder.emailAddress, description);

    $label.append($checkbox);
    $label.append(description);
    $div.append($label);

    this.$element = $div;
  }

  function RowFromCookie(email, description) {
    var $div = $('<div></div>', {
      'data-coffee-order': 'checkbox',
      'class': 'checkbox'
    });

    var $label = $('<label></label>');

    var $checkbox = $('<input></input>', {
      type: 'checkbox',
      value: email
    });

    $label.append($checkbox);
    $label.append(description);
    $div.append($label);

    this.$element = $div;
  }

  function addOrderCookie(email, description) {
    var emailList = localStorage.getItem(EmailListKey);
    if (emailList == null || emailList == "null") {
      add
      localStorage.setItem(EmailListKey, ',' + email + ',');
    } else {
      localStorage.setItem(EmailListKey, emailList + ',' + email + ',');
    }
    localStorage.setItem(email, description);
    localStorage.setItem(MostRecentEmail, email);
  }

  CheckList.prototype.populateFromCookies = function() {
    var cookieData = localStorage.getItem(EmailListKey);
    if (cookieData != null) {
      var emailList = String(cookieData).split(',');
      var checklist = this;
      emailList.forEach(function(email) {
        if (email.indexOf('@') > -1) {
          var description = localStorage.getItem(email);
          var rowElement = new RowFromCookie(email, description);
          checklist.$element.append(rowElement.$element);
        }
      });
    }
  };

  App.CheckList = CheckList;
  window.App = App;
})(window);
