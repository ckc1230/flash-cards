$(document).ready(function() {
    console.log( "ready!" );
    $('#preview-fill-ins-button').click(processFillInsPreview);
    $('#preview-terms-button').click(processTermsPreview);
    $('#preview-custom-button').click(processCustomPreview);
    $('#save-fill-ins-button').click(processFillInsSave);
    $('#save-terms-button').click(processTermsSave);
    $('#save-custom-button').click(processCustomSave);
    $('#save-fill-ins-modal').click(function() {
       $('#notes-input').val() ? launchGuideModal('fill-ins'): alert('Cannot save empty cards.');
    });
    $('#save-terms-modal').click(function() { launchGuideModal('terms') });
    $('#save-custom-modal').click(function() {
      $('#custom-input').val() ? launchGuideModal('custom') : alert('Cannot save empty cards.');
    });
    $('#show-button').click(toggleExample);
    $('#hide-button').click(toggleExample);
    $('#terms-nav').click(showTerms);
    $('#fill-ins-nav').click(showFillIns);
    $('#custom-nav').click(showCustom);
    $('.print-button').click(openPrint);
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

function launchGuideModal(questions) {
    $('#guide-modal').show();
    $('#save-'+questions+'-button').show();
}

function processFillInsPreview() {
  $('#save-fill-ins-modal').css("display", "inline-block");
  $('#preview-modal').show();
  $('#close-preview').click(function() {
    $('#preview-modal').hide();
    $('.save-modal-button').hide();
  });
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

    })
  }
}

function processFillInsSave() {
  $('#guide-modal').hide();
  if ($('#notes-input').val()) {
    var questionSubject = $('#guide-input').val();
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

      var newCard = {
        subject: questionSubject,
        prompt: prompt,
        response: parts[1]
      }
      
      $.post('/api/cards', newCard, function(album) {
        console.log('cards after POST', newCard);
      });
    })
    alert(questions.length + ' new flash-card(s) saved!');
    $('.modal').hide();
    $('.save-modal-button').hide();
  }  
}

function processTermsPreview() {
  $('#save-terms-modal').css("display", "inline-block");
  $('#preview-modal').show();
  $('#close-preview').click(function() {
    $('#preview-modal').hide();
    $('.save-modal-button').hide();
  })
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
    }
  }
}

function processTermsSave() {
  $('#guide-modal').hide();
  var questionSubject = $('#guide-input').val();
  var terms = $('.text-input');
  var definitions = $('.definition-input');
  var termsCount = 0;
  terms = terms.map(function() { return this.value; });
  definitions = definitions.map(function() { return this.value; });

  for (var i = 0; i<5; i++) {
    if (terms[i] && definitions[i]) {
      var row = $("<tr>", {"class": "row"});
      var promptDiv = $("<td>", {"class": "card prompt"});
      promptDiv.text(terms[i]);
      var answerDiv = $("<td>", {"class": "card answer"});
      answerDiv.text(definitions[i]);

      var newCard = {
        subject: questionSubject,
        prompt: terms[i],
        response: definitions[i]
      }

      $.post('/api/cards', newCard, function(album) {
        console.log('cards after POST', newCard);
      });
      termsCount++;
    }
  }
  alert(termsCount + ' new flash-card(s) saved!');
  $('.modal').hide();
  $('.save-modal-button').hide();
}

function processCustomPreview() {
  $('#save-custom-modal').css("display", "inline-block");
  $('#preview-modal').show();
  $('#close-preview').click(function() {
    $('#preview-modal').hide();
    $('.save-modal-button').hide();
  })
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

    })
  }
}

function processCustomSave() {
  $('#guide-modal').hide();
  if ($('#custom-input').val()) {
    var questionSubject = $('#guide-input').val();
    var notes = $('#custom-input').val();
    var questions = notes.split('~');
    questions.forEach(function(question, i) {
      var parts = question.split('|');
      var row = $("<tr>", {"class": "row"});
      var promptDiv = $("<td>", {"class": "card prompt"});
      promptDiv.text(parts[0]);
      var answerDiv = $("<td>", {"class": "card answer"});
      answerDiv.text(parts[1]);

      var newCard = {
        subject: questionSubject,
        prompt: parts[0],
        response: parts[1]
      }
      
      $.post('/api/cards', newCard, function(album) {
        console.log('cards after POST', newCard);
      });
    })
    alert(questions.length + ' new flashcard(s) saved!');
    $('.modal').hide();
    $('.save-modal-button').hide();
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