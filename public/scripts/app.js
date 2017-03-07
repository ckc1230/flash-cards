$(document).ready(function() {
    console.log( "ready!" );
    $('#submit-fill-ins-button').click(processFillInsSubmission);
    $('#submit-terms-button').click(processTermsSubmission);
    $('#submit-custom-button').click(processCustomSubmission);
    $('#show-button').click(toggleExample);
    $('#hide-button').click(toggleExample);
    $('#terms-nav').click(showTerms);
    $('#fill-ins-nav').click(showFillIns);
    $('#custom-nav').click(showCustom);
});

function showTerms() {
  $('#fill-ins-container').hide();
  $('#custom-container').hide();
  $('#terms-container').show();
  $('#fill-ins-nav').removeClass('active');
  $('#custom-nav').removeClass('active');
  $('#terms-nav').addClass('active');
  $('#fill-ins').empty();
  $('#custom').empty();
}

function showFillIns() {
  $('#terms-container').hide();
  $('#custom-container').hide();
  $('#fill-ins-container').show();
  $('#terms-nav').removeClass('active');
  $('#custom-nav').removeClass('active');
  $('#fill-ins-nav').addClass('active');
  $('#terms').empty();
  $('#custom').empty();
}

function showCustom() {
  $('#terms-container').hide();
  $('#fill-ins-container').hide();
  $('#custom-container').show();
  $('#terms-nav').removeClass('active');
  $('#fill-ins-nav').removeClass('active');
  $('#custom-nav').addClass('active');
  $('#fill-ins').empty();
  $('#terms').empty();
}

function processFillInsSubmission() {
  $('#fill-ins').empty();
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

      $('#fill-ins').append(row);
      $('#fill-ins .row:nth-child('+(i+1)+')').append(promptDiv);
      $('#fill-ins .row:nth-child('+(i+1)+')').append(answerDiv);

      var newCard = {
        subject: 'medicine',
        prompt: prompt,
        response: parts[1]
      }
      
      $.post('/api/cards', newCard, function(album) {
        console.log('cards after POST', newCard);
      });

    })
    $('html, body').animate({
        scrollTop: $("#fill-ins").offset().top
    }, 1000);
    $('.print-button').css({"cursor": "pointer", "color": "black"});
    $('.print-button').click(openPrint);
  }
}

function processTermsSubmission() {
  $('#terms').empty();
  var terms = $('.text-input');
  var definitions = $('.definition-input');
  terms = terms.map(function() { return this.value; })  
  definitions = definitions.map(function() { return this.value; })

  for (var i = 0; i<5; i++) {
    if (terms[i] && definitions[i]) {
      var row = $("<tr>", {"class": "row"});
      var promptDiv = $("<td>", {"class": "card prompt"});
      promptDiv.text(terms[i]);
      var answerDiv = $("<td>", {"class": "card answer"});
      answerDiv.text(definitions[i]);

      $('#terms').append(row);
      $('#terms .row:last-child').append(promptDiv);
      $('#terms .row:last-child').append(answerDiv);

      var newCard = {
        subject: 'medicine',
        prompt: terms[i],
        response: definitions[i]
      }

      $.post('/api/cards', newCard, function(album) {
        console.log('cards after POST', newCard);
      });
    }
  }
  $('html, body').animate({
        scrollTop: $("#terms").offset().top
  }, 1000);
  $('.print-button').css({"cursor": "pointer", "color": "black"});
  $('.print-button').click(openPrint);
}

function processCustomSubmission() {
  $('#custom').empty();
  if ($('#custom-input').val()) {
    var notes = $('#custom-input').val();
    var questions = notes.split('~');
    questions.forEach(function(question, i) {
      var parts = question.split('|');
      var row = $("<tr>", {"class": "row"});
      var promptDiv = $("<td>", {"class": "card prompt"});
      promptDiv.text(parts[0]);
      var answerDiv = $("<td>", {"class": "card answer"});
      answerDiv.text(parts[1]);

      $('#custom').append(row);
      $('#custom .row:nth-child('+(i+1)+')').append(promptDiv);
      $('#custom .row:nth-child('+(i+1)+')').append(answerDiv);

      var newCard = {
        subject: 'medicine',
        prompt: parts[0],
        response: parts[1]
      }
      
      $.post('/api/cards', newCard, function(album) {
        console.log('cards after POST', newCard);
      });

    })

    $('html, body').animate({
        scrollTop: $("#custom").offset().top
    }, 1000);
    $('.print-button').css({"cursor": "pointer", "color": "black"});
    $('.print-button').click(openPrint);
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