$(document).ready(function() {
  console.log( "cards ready!" );
  var subjects = [];

  $.get( "/api/cards", function( data ) {
    data.forEach(function(value, key) {
      var row = $("<tr>", {"class": "row", "id": value._id});
      var promptDiv = $("<td>", {"class": "card prompt"});
      promptDiv.text(value.prompt);
      var answerDiv = $("<td>", {"class": "card answer"});
      answerDiv.text(value.response);

      // CREATE AND APPEND CARDS
      var optionsDiv = $("<td>");
      var options = $("<table>", {"class": "options"});
      var cardSubject = $("<div>", {"class": "card-subject options-button", "text": value.subject});
      var editSubject = $("<i>", {"class": "edit-subject-button options-button material-icons", "text": 'mode_edit'});
      var editPrompt = $("<div>", {"class": "edit-prompt-button options-button", "text": "Edit Prompt"});
      var editAnswer = $("<div>", {"class": "edit-answer-button options-button", "text": "Edit Answer"});
      var deleteCard = $("<div>", {"class": "delete-card-button options-button", "text": "Delete Card"});
      options.append(cardSubject);
      options.append(editSubject);
      options.append(editPrompt);
      options.append(editAnswer);
      options.append(deleteCard);
      optionsDiv.append(options);

      $('#show-cards-list').append(row);
      $('#show-cards-list .row:nth-child('+(key+1)+')').append(promptDiv);
      $('#show-cards-list .row:nth-child('+(key+1)+')').append(answerDiv);
      $('#show-cards-list .row:nth-child('+(key+1)+')').append(optionsDiv);

      // ADD SUBJECT TO ARRAY
      if (subjects.indexOf(value.subject) == -1) {
        subjects.push(value.subject);
      }
    })
    
    var dropdownList = $('#subjects-dropdown');
    subjects.forEach(function(value, key) {
      var listItem = $('<option>', {"class": "dropdown-item", "text": value})
      dropdownList.append(listItem);
    })
  });

  $('#subjects-dropdown').change(filterCards);
  $('#show-cards-list').on('click', '.edit-prompt-button', handleEditPrompt);
  $('#show-cards-list').on('click', '.edit-answer-button', handleEditAnswer);
  $('#show-cards-list').on('click', '.delete-card-button', handleDeleteCard);
  $('#show-cards-list').on('click', '.edit-subject-button', handleEditSubject);
  $('#card-list-print').click(function() { window.print(); });
});

function filterCards() {
  var filteredSubject = $('#subjects-dropdown').val();
  $('#show-cards-list').empty();
  var count = 1;
  if (filteredSubject === 'All') {
    $.get( "/api/cards", function( data ) {
      data.forEach(function(value, key) {
        var row = $("<tr>", {"class": "row", "id": value._id});
        var promptDiv = $("<td>", {"class": "card prompt"});
        promptDiv.text(value.prompt);
        var answerDiv = $("<td>", {"class": "card answer"});
        answerDiv.text(value.response);

        // CREATE AND APPEND CARDS
        var optionsDiv = $("<td>");
        var options = $("<table>", {"class": "options"});
        var cardSubject = $("<div>", {"class": "card-subject options-button", "text": value.subject});
        var editSubject = $("<i>", {"class": "edit-subject-button options-button material-icons", "text": 'mode_edit'});
        var editPrompt = $("<div>", {"class": "edit-prompt-button options-button", "text": "Edit Prompt"});
        var editAnswer = $("<div>", {"class": "edit-answer-button options-button", "text": "Edit Answer"});
        var deleteCard = $("<div>", {"class": "delete-card-button options-button", "text": "Delete Card"});
        options.append(cardSubject);
        options.append(editSubject);
        options.append(editPrompt);
        options.append(editAnswer);
        options.append(deleteCard);
        optionsDiv.append(options);

        $('#show-cards-list').append(row);
        $('#show-cards-list .row:nth-child('+(key+1)+')').append(promptDiv);
        $('#show-cards-list .row:nth-child('+(key+1)+')').append(answerDiv);
        $('#show-cards-list .row:nth-child('+(key+1)+')').append(optionsDiv);
      })
    })
  } else {
    $.get( "/api/cards", function( data ) {
      data.forEach(function(value, key) {
        if (value.subject ===  filteredSubject) {
          var row = $("<tr>", {"class": "row", "id": value._id});
          var promptDiv = $("<td>", {"class": "card prompt"});
          promptDiv.text(value.prompt);
          var answerDiv = $("<td>", {"class": "card answer"});
          answerDiv.text(value.response);

          // CREATE AND APPEND CARDS
          var optionsDiv = $("<td>");
          var options = $("<table>", {"class": "options"});
          var cardSubject = $("<div>", {"class": "card-subject options-button", "text": value.subject});
          var editSubject = $("<i>", {"class": "edit-subject-button options-button material-icons", "text": 'mode_edit'});
          var editPrompt = $("<div>", {"class": "edit-prompt-button options-button", "text": "Edit Prompt"});
          var editAnswer = $("<div>", {"class": "edit-answer-button options-button", "text": "Edit Answer"});
          var deleteCard = $("<div>", {"class": "delete-card-button options-button", "text": "Delete Card"});
          options.append(cardSubject);
          options.append(editSubject);
          options.append(editPrompt);
          options.append(editAnswer);
          options.append(deleteCard);
          optionsDiv.append(options);

          $('#show-cards-list').append(row);
          $('#show-cards-list .row:nth-child('+(count)+')').append(promptDiv);
          $('#show-cards-list .row:nth-child('+(count)+')').append(answerDiv);
          $('#show-cards-list .row:nth-child('+(count)+')').append(optionsDiv);
          count++;
        }
      })
    })
  }
}

function handleEditPrompt() {
  var row = $(this).closest('.row');
  var prompt = row.children('.prompt');
  var editCard = $('<td>', {"class": "card"});
  var editInput = $('<textarea>', {"class": "edit-card", "text": prompt.text()});
  editCard.append(editInput);
  prompt.replaceWith(editCard);

  $('.options').hide();
  var saveOptions = $("<table>", {"class": "save-options"});
  var updatePrompt = $("<div>", {"class": "update-prompt-button options-button", "text": "Update Prompt"});
  var cancelPrompt = $("<div>", {"class": "cancel-prompt-button options-button", "text": "Cancel"});
  row.append(saveOptions)
  saveOptions.append(updatePrompt);
  saveOptions.append(cancelPrompt);

  $('.update-prompt-button').click(function() {
    var cardId = $(this).closest('.row').attr('id');
    console.log('update: ', editInput.val());
    $('.options').show();
    $('.save-options').hide();
    $.ajax({
      method: 'PUT',
      url: '/api/cards/'+ cardId,
      data: { prompt: editInput.val() },
      success: function(data) {
        prompt.text(editInput.val());
        editCard.replaceWith(prompt);
      }
    });
  });
  $('.cancel-prompt-button').click(function() {
    editCard.replaceWith(prompt);  
    $('.options').show();
    $('.save-options').hide();
  });
}

function handleEditAnswer() {
  var row = $(this).closest('.row');
  var answer = row.children('.answer');
  var editCard = $('<td>', {"class": "card"});
  var editInput = $('<textarea>', {"class": "edit-card", "text": answer.text()});
  editCard.append(editInput);
  answer.replaceWith(editCard);
  $('.options').hide();
  var saveOptions = $("<table>", {"class": "save-options"});
  var updateAnswer = $("<div>", {"class": "update-answer-button options-button", "text": "Update Answer"});
  var cancelAnswer = $("<div>", {"class": "cancel-answer-button options-button", "text": "Cancel"});
  row.append(saveOptions)
  saveOptions.append(updateAnswer);
  saveOptions.append(cancelAnswer);

  $('.update-answer-button').click(function() {
    var cardId = $(this).closest('.row').attr('id');
    console.log('update: ', editInput.val());
    console.log('id:', cardId)
    $('.options').show();
    $('.save-options').hide();
    $.ajax({
      method: 'PUT',
      url: '/api/cards/'+ cardId,
      data: { response: editInput.val() },
      success: function(data) {
        console.log(editInput.val())
        answer.text(editInput.val());
        editCard.replaceWith(answer);
      }
    });
  });

  $('.cancel-answer-button').click(function() {
    editCard.replaceWith(answer);  
    $('.options').show();
    $('.save-options').hide();
  });
}

function handleDeleteCard() {
  var cardId = $(this).closest('.row').attr('id');
  $.ajax({
    method: 'DELETE',
    url: '/api/cards/'+ cardId,
    success: function(data) {
      $('#'+cardId).remove();
      console.log('deleted');
    }
  });
}

function handleEditSubject() {
  var row = $(this).closest('table');
  var subject = row.children('.card-subject');

  var saveSubject = $("<i>", {"class": "save-subject-button options-button material-icons", "text": 'save'});
  row.children('.edit-subject-button').replaceWith(saveSubject);

  var subjectInput = $("<input>", {"class": "subject-input card-subject options-button", "value": subject.text()});
  subject.replaceWith(subjectInput);

  $(saveSubject).on('click', handleSaveSubject);
}

function handleSaveSubject() {
  var cardId = $(this).closest('.row').attr('id');
  var row = $(this).closest('table');
  var input = row.children('input');
  $.ajax({
    method: 'PUT',
    url: '/api/cards/'+ cardId,
    data: { subject: input.val() },
    success: function(data) {
      var updatedSubject = $("<div>", {"class": "card-subject options-button", "text": input.val()});
      var editSubject = $("<i>", {"class": "edit-subject-button options-button material-icons", "text": 'mode_edit'});
      row.children('.save-subject-button').replaceWith(editSubject);
      input.replaceWith(updatedSubject);
    }
  });
}