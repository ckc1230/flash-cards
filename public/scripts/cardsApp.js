$(document).ready(function() {
  console.log( "cards ready!" );

  $.get( "/api/cards", function( data ) {
    data.forEach(function(value, key) {
      var row = $("<tr>", {"class": "row", "id": value._id});
      var promptDiv = $("<td>", {"class": "card prompt"});
      promptDiv.text(value.prompt);
      var answerDiv = $("<td>", {"class": "card answer"});
      answerDiv.text(value.response);

      var optionsDiv = $("<td>");
      var options = $("<table>", {"class": "options"});
      var editPrompt = $("<div>", {"class": "edit-prompt-button options-button", "text": "Edit Prompt"});
      var editAnswer = $("<div>", {"class": "edit-answer-button options-button", "text": "Edit Answer"});
      var deleteCard = $("<div>", {"class": "delete-card-button options-button", "text": "Delete Card"});
      options.append(editPrompt);
      options.append(editAnswer);
      options.append(deleteCard);
      optionsDiv.append(options);

      $('#show-cards-list').append(row);
      $('#show-cards-list .row:nth-child('+(key+1)+')').append(promptDiv);
      $('#show-cards-list .row:nth-child('+(key+1)+')').append(answerDiv);
      $('#show-cards-list .row:nth-child('+(key+1)+')').append(optionsDiv);
    })
  });

  $('#show-cards-list').on('click', '.edit-prompt-button', handleEditPrompt);
  $('#show-cards-list').on('click', '.edit-answer-button', handleEditAnswer);
  $('#show-cards-list').on('click', '.delete-card-button', handleDeleteCard);

});

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