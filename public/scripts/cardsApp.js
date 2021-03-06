$(document).ready(function() {
  console.log( "cards ready!" );
  var subjects = [];

  $.get( "/api/cards", function( data ) {
    data.sort(function(a, b){
      var subjectA = a.subject,
          subjectB = b.subject;

      if(subjectA < subjectB) return -1;
      if(subjectA > subjectB) return 1;
      return 0;
    });

    data.forEach(function(value, key) {
      var row = $("<tr>", {"class": "row", "id": value._id});
      var checkBoxDiv = $("<td>", {"class": "checkbox-div"});
      var checkBox = $("<input>", {"type": "checkbox", "class": "checkbox"});
      var promptDiv = $("<td>", {"class": "card prompt"});
      promptDiv.text(value.prompt);
      var answerDiv = $("<td>", {"class": "card answer"});
      answerDiv.text(value.response);

      // CREATE AND APPEND CARDS
      var optionsDiv = $("<td>");
      var options = $("<table>", {"class": "options"});
      var cardSubject = $("<div>", {"class": "card-subject options-button", "text": value.subject});
      var editPrompt = $("<div>", {"class": "edit-prompt-button options-button", "text": "Edit Prompt"});
      var editAnswer = $("<div>", {"class": "edit-answer-button options-button", "text": "Edit Answer"});
      options.append(cardSubject, editPrompt, editAnswer);
      optionsDiv.append(options);
      checkBoxDiv.append(checkBox);

      $('#show-cards-list').append(row);
      $('#show-cards-list .row:nth-child('+(key+1)+')').append(checkBoxDiv, promptDiv, answerDiv, optionsDiv);

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

  // EVENT LISTENERS
  $('#subjects-dropdown').change(filterCards);
  $('#show-cards-list').on('click', '.edit-prompt-button', handleEditPrompt);
  $('#show-cards-list').on('click', '.edit-answer-button', handleEditAnswer);
  $('#card-list-print').click(handlePrint);
  $('#select-all').click(selectAllCards);
  $('#clear-all').click(clearAllCards);
  $('#edit-subject').click(handleUpdateModal);
  $('#update-subject').click(handleUpdateSubject);
  $('#show-cards-list').on('click', '.checkbox', handleCheckBox);
  $('#start-quiz').on('click', handleStartQuiz);
  $('#flip-card').on('click', flipCard);
  $('#remove-card').on('click', removeCardFromDeck);
  $('#close-quiz').on('click', handleCloseModal);
  $('#close-update').on('click', handleCloseModal);
  $('#left-arrow').on('click', changeCardBackward);
  $('#right-arrow').on('click', changeCardForward);
  $('#random-card').on('click', changeCardRandom);
  $('#delete-card').on('click', function() {
    if (activeCards[currentCard]) {
      $('#delete-number').html(activeCards.length);
      $("#delete-dialog").dialog("open");
      return false;
    } else {
      alert('No flash cards selected.');
    }
  })

  // DELETE DIALOG
  $("#delete-dialog").dialog({
    autoOpen : false, modal : true, show : "fold", hide: "fold", width: 400, resizable: false,
    buttons: [ { text: "Cancel", click: function() { $( this ).dialog( "close" ); } }, 
    { text: "Delete", class: "danger-button", click: function() { handleDeleteCard() } } ]
  });
});

var activeCards = [];
var quizCard = {};
var quiz = {
  cards: []
};
var currentCard = 0;
var randomCard = 0;
var quizInitialLength = 0;

function handleCheckBox() {
  var cardId = $(this).closest('.row').attr('id');
  if ($( this ).prop( "checked" )) {
    activeCards.push(cardId);
  } else if (activeCards.includes(cardId)) {
    activeCards.splice(activeCards.indexOf(cardId) , 1)
  }
}

function selectAllCards() {
  var boxes = $('.checkbox');
  $.each(boxes, function(key, box) {
    box.checked = true;
  })

  var rows = $('.row');
  $.each(rows, function(key, row) {
    var currentId = $(row).attr('id')
    if (activeCards.indexOf(currentId) === -1 ) {
      activeCards.push(currentId);
    }
  })
}

function clearAllCards() {
  var boxes = $('.checkbox');
  $.each(boxes, function(key, box) {
    box.checked = false;
  })

  var rows = $('.row');
  $.each(rows, function(key, row) {
    var currentId = $(row).attr('id')
    activeCards.splice(activeCards.indexOf(currentId) , 1);
  })
}

function handleStartQuiz() {
  if (activeCards[currentCard]) {
    var numArr = Array.apply(null, {length: activeCards.length}).map(Number.call, Number)
    var randArr = numArr.sort(function() { return 0.5 - Math.random() });
    quiz.cards = [];
    currentCard = 0;
    randomCard = 0;

    for (var i=0; i<activeCards.length; i++) {
      var newCard = {
        id: activeCards[i],
        randIndex: randArr[i]
      }
      quiz.cards.push(newCard);
    }
    quizInitialLength = quiz.cards.length;
    $('#deck-count').html(quiz.cards.length);
    $('#quiz-modal').show();
    getCardData(quiz.cards[currentCard].id);

  } else {
    alert('No flash cards selected.')
  }
  $( "html" ).keydown(function(e) {
    if (e.keyCode === 37) {
      e.preventDefault();
      changeCardBackward();
    } else if (e.keyCode === 39) {
      e.preventDefault();
      changeCardForward();
    } else if (e.keyCode === 38) {
      e.preventDefault();
      flipCard();
    } else if (e.keyCode === 86) {
      e.preventDefault();
      removeCardFromDeck();
    } else if (e.keyCode === 40) {
      e.preventDefault();
      changeCardRandom();
    }
  });
}

function changeCardForward() {
  currentCard++;
  if (currentCard >= quiz.cards.length) { currentCard = 0; }
  getCardData(quiz.cards[currentCard].id);
}

function changeCardBackward() {
  currentCard--;
  if (currentCard < 0) { currentCard = quiz.cards.length-1; }
  getCardData(quiz.cards[currentCard].id);
}

function changeCardRandom() {
  if (quiz.cards.length <= 1) {
    alert("This is the last card.")
  } else {
    var card;
    do {
      card = $.grep(quiz.cards, function(card){ return card.randIndex == randomCard; })[0];
      randomCard++;
      if (randomCard >= quizInitialLength) { randomCard = 0; }
    }  while (quiz.cards.indexOf(card) == -1)

    getCardData(quiz.cards[quiz.cards.indexOf(card)].id);
  }
}

function removeCardFromDeck() {
  if (quiz.cards.length > 1) {
    if (currentCard === quiz.cards.length-1) {
      quiz.cards.splice(currentCard , 1);
      getCardData(quiz.cards[--currentCard].id);
    } else {
      quiz.cards.splice(quiz.cards , 1);
      getCardData(quiz.cards[currentCard].id);
    }
    $('#deck-count').html(quiz.cards.length);
  } else {
    alert('This is the last card!');
  }
}

function getCardData(id) {
  $.ajax({
    method: 'GET',
    url: '/api/cards/'+ id,
    success: function(data) {
      quizCard = data;
      $('#quiz-card').html(quizCard.prompt);
      var card = $.grep(quiz.cards, function(card){ return card.id == quizCard._id; });
      // $('#card-count').html(quiz.cards.indexOf(card[0]) + 1);
    }
  });
}

function handleCloseModal() {
  $('.modal').hide();
  $( "html" ).off();
}

function flipCard() {
  $('#quiz-card').html() === quizCard.prompt ? 
    $('#quiz-card').html(quizCard.response) : $('#quiz-card').html(quizCard.prompt);
}

function filterCards() {
  var filteredSubject = $('#subjects-dropdown').val();
  $('#show-cards-list').empty();
  var count = 1;
  if (filteredSubject === 'All') {
    $.get( "/api/cards", function( data ) {
      
      data.sort(function(a, b){
        var subjectA = a.subject,
            subjectB = b.subject;

        if(subjectA < subjectB) return -1;
        if(subjectA > subjectB) return 1;
        return 0;
      });

      data.forEach(function(value, key) {
        var row = $("<tr>", {"class": "row", "id": value._id});
        var checkBoxDiv = $("<td>", {"class": "checkbox-div"});
        var checkBox = $("<input>", {"type": "checkbox", "class": "checkbox", "checked": activeCards.indexOf(value._id) != -1 });
        var promptDiv = $("<td>", {"class": "card prompt"});
        promptDiv.text(value.prompt);
        var answerDiv = $("<td>", {"class": "card answer"});
        answerDiv.text(value.response);

        // CREATE AND APPEND CARDS
        var optionsDiv = $("<td>");
        var options = $("<table>", {"class": "options"});
        var cardSubject = $("<div>", {"class": "card-subject options-button", "text": value.subject});
        var editPrompt = $("<div>", {"class": "edit-prompt-button options-button", "text": "Edit Prompt"});
        var editAnswer = $("<div>", {"class": "edit-answer-button options-button", "text": "Edit Answer"});
        options.append(cardSubject, editPrompt, editAnswer);
        optionsDiv.append(options);
        checkBoxDiv.append(checkBox);

        $('#show-cards-list').append(row);
        $('#show-cards-list .row:nth-child('+(key+1)+')').append(checkBoxDiv, promptDiv, answerDiv, optionsDiv);
      })
    })
  } else {
    $.get( "/api/cards", function( data ) {
      data.forEach(function(value, key) {
        if (value.subject.toLowerCase() ===  filteredSubject.toLowerCase()) {
          var row = $("<tr>", {"class": "row", "id": value._id});
          var checkBoxDiv = $("<td>", {"class": "checkbox-div"});
          var checkBox = $("<input>", {"type": "checkbox", "class": "checkbox", "checked": activeCards.indexOf(value._id) != -1 });
          var promptDiv = $("<td>", {"class": "card prompt"});
          promptDiv.text(value.prompt);
          var answerDiv = $("<td>", {"class": "card answer"});
          answerDiv.text(value.response);

          // CREATE AND APPEND CARDS
          var optionsDiv = $("<td>");
          var options = $("<table>", {"class": "options"});
          var cardSubject = $("<div>", {"class": "card-subject options-button", "text": value.subject});
          var editPrompt = $("<div>", {"class": "edit-prompt-button options-button", "text": "Edit Prompt"});
          var editAnswer = $("<div>", {"class": "edit-answer-button options-button", "text": "Edit Answer"});
          options.append(cardSubject, editPrompt, editAnswer);
          optionsDiv.append(options);
          checkBoxDiv.append(checkBox);

          $('#show-cards-list').append(row);
          $('#show-cards-list .row:nth-child('+(count)+')').append(checkBoxDiv, promptDiv, answerDiv, optionsDiv);
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
  saveOptions.append(updatePrompt, cancelPrompt);

  $('.update-prompt-button').click(function() {
    var cardId = $(this).closest('.row').attr('id');
    $('.options').show();
    $('.save-options').hide();
    $.ajax({
      method: 'PUT',
      url: '/api/cards/'+ cardId,
      data: { prompt: editInput.val() },
      success: function(data) {
        console.log("updated", cardId + ": "  + editInput.val())
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
  saveOptions.append(updateAnswer, cancelAnswer);

  $('.update-answer-button').click(function() {
    var cardId = $(this).closest('.row').attr('id');
    $('.options').show();
    $('.save-options').hide();
    $.ajax({
      method: 'PUT',
      url: '/api/cards/'+ cardId,
      data: { response: editInput.val() },
      success: function(data) {
        console.log("updated", cardId + ": "  + editInput.val())
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
  activeCards.forEach(function(id, key) {
    $.ajax({
      method: 'DELETE',
      url: '/api/cards/'+ id,
      success: function(data) {
        $('#'+id).remove();
        $("#delete-dialog").dialog('close');
      }
    });
  })
  activeCards = [];
}

function handleUpdateModal() {
  activeCards[currentCard] ? $('#update-subject-modal').show() : alert('No flash cards selected.');
}

function handleUpdateSubject() {
  var updatedSubject = $('#update-input').val();
  activeCards.forEach(function(id, key) {
    $.ajax({
    method: 'PUT',
    url: '/api/cards/'+ id,
    data: { subject: updatedSubject },
    success: function(data) {
      $("#"+id).find(".card-subject").text(data.subject);
      console.log(data);
      }
    });
  })
  activeCards = [];
  $('#update-input').val("");
  $('#update-subject-modal').hide();
}

function handlePrint() {
  window.print();
}