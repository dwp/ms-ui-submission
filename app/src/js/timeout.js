/* eslint-disable */
(function () {
  var timeout = document.querySelector('#timeout');
  var timeoutRefresh = document.querySelector('#timeout-refresh');
  var dialog = document.querySelector('#timeout-dialog');
  var minutes = document.getElementsByClassName('timeout-expires');
  var timeoutValue = document.querySelector('#timeout-value').dataset.timeout;

    if (!timeoutValue) {
       console.error('Date not being passed. Setting local default');
       timeoutValue = new Date(Date.now() + (3600 * 1000)).toISOString();
     }

  var intID = setInterval(function () {
    var exp = Date.parse(timeoutValue);
    if (exp - Date.now() > 5 * 60 * 1000) {
      // more than 5 minutes left
    } else if (exp - Date.now() > 0) {
      window.addEventListener('keydown', function (e) {
        if (e.keyCode === 9) {
          e.preventDefault();
          timeoutRefresh.focus();
        }
        if (e.keyCode === 27) {
          e.preventDefault();
          document.location = timeoutRefresh.href;
        }
      });
      timeout.className = '';
      document.body.classList.add('timeout-freeze');
      var m = Math.ceil((exp - Date.now()) / 60 / 1000);
      var html = document.documentElement.lang !== 'en' ? m : m !== 1 ? m + ' minutes' : m + ' minute';
      [].forEach.call(minutes, function (el) {
        el.innerHTML = html;
      });
    } else {
      document.location = '/session-timeout';
    }
  }, 1000);
})();
