
let lastMsgTime;

function postMsg (text) {
  $.post('/messages', {content: text}, function (data) {
    appendMsgs([data]);
  });
}

function appendMsgs (msgsArr) {
  if (msgsArr.length) {
    lastMsgTime = msgsArr[0].timestamp;
    for (let i = msgsArr.length - 1; i > -1; i--) {
      let msg = msgsArr[i];
      let timeStr = new Date(msg.timestamp).toLocaleTimeString();
      let $div = $('<div class="message">');
      $div.append()
      $('#messages').append(`
        <div class="message">
          <div class="time">Time: ${timeStr}</div>
          <p>${msg.content}</p>
        </div>
      `);
      keepScrolled('#messages');
    }
  }
}

// get messages, by default the last 10 messages, if a timestamp is given it
// will return messages written after that timestamp
function getLatestMessages (opts) {
  let defs = {limit: 10};
  opts = opts || defs;
  let url = opts.timestamp ? `/messages?{"timestamp": {"$gt":${lastMsgTime}}}` : `/messages?{"$limit":${opts.limit},"$sort":{"timestamp":-1}}`;
  $.get(url, appendMsgs);
}

// Get a random quote
function getRandomQuote () {
  $.ajax('http://api.forismatic.com/api/1.0/', {
    jsonp: "jsonp",
    dataType: "jsonp",
    data: {
      method: "getQuote",
      lang: "en",
      format: "jsonp"
    },
    success: function (data) {
      postMsg(data.quoteText);
      randomQuoteScheduler();
    }
  })
}

// Get a random quote at a random time
function randomQuoteScheduler () {
  let msInterval = Math.random()*20000;
  setTimeout(getRandomQuote, msInterval);
}

//  keep the scroll at the bottom of the element
function keepScrolled(elementId) {
  $(elementId).animate({ scrollTop: $(elementId)[0].scrollHeight}, 100);
}

$(function () {

  getLatestMessages({limit: 10});

  $('button').click(function () {
    let text = $('input').val();
    text && postMsg(text);
  });

  // poll server for new messages
  // setInterval(function () {
  //   getLatestMessages({timestamp: lastMsgTime});
  // }, 15000);

  // get msgs from server through websockets
  dpd.messages.on('new', function (message) {
    appendMsgs([message]);
  });

  randomQuoteScheduler();

});


// Other ways to post
// *************************************************
// $.post('/messages', {content: 'hello'})
//   .done(function (data) {
//     console.log(data);
//   })
//   .fail(function (xhr, status, error) {
//     console.log(error);
//   });
//
// $.post('/messages', {content: 'hello'}, function (data) {
//   console.log(data);
// });

//
// function showError(error) {
//       var message = "An error occurred";
//       if (error.message) {
//         message = error.message;
//       } else if (error.errors) {
//         var errors = error.errors;
//         message = "";
//         Object.keys(errors).forEach(function(k) {
//                 message += k + ": " + errors[k] + "\n";
//         });
//       }
//
//       alert(message);
//     }
