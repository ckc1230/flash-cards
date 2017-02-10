$(document).ready(function() {
    console.log( "ready!" );
    $('#submit-button').click(processSubmission);
});

function processSubmission() {
  $('#flash-cards').empty();
  var notes = $('#notes-input').val();
  console.log(notes);
  var questions = notes.split('~');
  questions.forEach(function(question) {
    var parts = question.split('|');
    var prompt = parts[0] + '_____' + parts[2];
    var promptDiv = $("<div>", {"class": "prompt"});
    promptDiv.text(prompt);
    var answerDiv = $("<div>", {"class": "answer"});
    answerDiv.text(parts[1]);

    $('#flash-cards').append(promptDiv);
    $('#flash-cards').append(answerDiv);
  })
}