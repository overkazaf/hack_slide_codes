var page = require('webpage').create();

page.onResourceRequested = function(request) {
  // console.log('Request ' + JSON.stringify(request, undefined, 4));
};
page.onResourceReceived = function(response) {
  // console.log('Receive ' + JSON.stringify(response, undefined, 4));
};

page.open('https://fundebug.com/dashboard/5a1d183c1369c5000cd65e50/errors/inbox?filters=%7B%22startTime%22:1512920940000,%22endTime%22:1513007340000%7D&sortby=%7B%22sortfield%22:%22lastSeen%22,%22sortvalue%22:%22descending%22%7D&search=&eventId=&errorStatus=', function() {
  console.log('page has been loaded');
  page.includeJs("http://localhost:8888/jquery.min.js", function() {
    console.log('jQuery has been loaded');
    var ua = page.evaluate(function() {
      $(".email_part_input").val('289202839@qq.com');
      console.log('project name', $(".email_part_input").val());

      $(".email_password_part").val('Qazwsx123@');
      console.log('project name', $(".email_password_part").val());

      $(".LoginBtnContainer > .btn").click();
      return 123;
    });

    page.render('fundebug.png');


    console.log('ua', ua);
    phantom.exit()
  });
});