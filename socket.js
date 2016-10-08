

function postMsg (text) {
  $.post('/messages', {content: text});
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

$(function () {

  dpd.socketReady(function() {
    console.log('socket is ready');
  });

  getLatestMessages({limit: 10});  //  is this required?
  $('button').click(function () {
    let text = $('input').val();
    text && postMsg(text);
  });

  // get msgs from server through websockets
  dpd.messages.on('new', function (message) {
    appendMsgs([message]);
  });
});

//  keep the scroll at the bottom of the element
function keepScrolled(elementId) {
  $(elementId).animate({ scrollTop: $(elementId)[0].scrollHeight}, 100);
}
