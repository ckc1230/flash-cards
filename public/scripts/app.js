$(document).ready(function() {
    console.log( "ready!" );
    $('#submit-button').click(processSubmission);
    $('#show-button').click(toggleExample);
    $('#hide-button').click(toggleExample);
});

function processSubmission() {
  $('#flash-cards').empty();
  if ($('#notes-input').val()) {
    var notes = $('#notes-input').val();
    var questions = notes.split('~');
    questions.forEach(function(question, i) {
      var parts = question.split('|');
      var prompt = parts[0] + '_____' + parts[2];
      var row = $("<tr>", {"class": "row"});
      var promptDiv = $("<td>", {"class": "card prompt"});
      promptDiv.text(prompt);
      var answerDiv = $("<td>", {"class": "card answer"});
      answerDiv.text(parts[1]);

      $('#flash-cards').append(row);
      $('#flash-cards .row:nth-child('+(i+1)+')').append(promptDiv);
      $('#flash-cards .row:nth-child('+(i+1)+')').append(answerDiv);
    })
    $('html, body').animate({
        scrollTop: $("#flash-cards").offset().top
    }, 1000);
    $('#print-button').css({"cursor": "pointer", "color": "black"});
    $('#print-button').click(openPrint);
  }
}

function toggleExample() {
  $('#card-example').toggle();
  $('#hide-button').toggle();
  $('#show-button').toggle();
}

function openPrint() {
  window.print();
}