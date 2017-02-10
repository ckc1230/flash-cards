$(document).ready(function() {
    console.log( "ready!" );
    $('#submit-button').click(processSubmission);
});

function processSubmission() {
  $('#flash-cards').empty();
  if ($('#notes-input').val()) {
    var notes = $('#notes-input').val();
    console.log(notes);
    var questions = notes.split('~');
    questions.forEach(function(question, i) {
      var parts = question.split('|');
      var prompt = parts[0] + '_____' + parts[2];
      var row = $("<div>", {"class": "row"});
      var promptDiv = $("<div>", {"class": "card prompt"});
      promptDiv.text(prompt);
      var answerDiv = $("<div>", {"class": "card answer"});
      answerDiv.text(parts[1]);

      $('#flash-cards').append(row);
      $('#flash-cards .row:nth-child('+(i+1)+')').append(promptDiv);
      $('#flash-cards .row:nth-child('+(i+1)+')').append(answerDiv);
    })
    $('#print-button').css({"cursor": "pointer", "color": "black"});
    $('#print-button').click(openPrint);
  }
}

function openPrint() {
  window.print();
}