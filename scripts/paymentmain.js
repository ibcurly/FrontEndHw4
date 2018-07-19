(function(window) {
  'use strict';
  var FORM_SELECTOR = '[data-coffee-payment="form"]';
  var App = window.App;
  var PaymentFormHandler = App.PaymentFormHandler;
  var paymentFormHandler = new PaymentFormHandler(FORM_SELECTOR);

  paymentFormHandler.addSubmitHandler(function(data) {
    var modal = document.getElementById('myModal');
    var span = document.getElementsByClassName("close")[0];

    var thankString = "Thank you for your payment, "
    var title1 = document.getElementById('title_1');
    var title2 = document.getElementById('title_2');
    var prefix = "";
    if (title1.checked) {
      prefix = "M. ";
    } else if (title2.checked) {
      prefix = "Ms. ";
    }
    var name = document.getElementById('name').value;

    document.getElementById("modalcontent").innerHTML = thankString + prefix + name;
    modal.style.display = "block";

    span.onclick = function() {
      modal.style.display = "none";
      window.location.href = "index.html";
    }
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
        window.location.href = "index.html";
      }
    }



  });
})(window);
