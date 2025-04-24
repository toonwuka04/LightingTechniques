$(document).ready(function () {
    $.getJSON(`/get_quiz_data/${quizId}`, function (data) {
      $("#quiz-title").text(data.title);
  
      let formHtml = `<form method="POST" action="/submit_quiz/${quizId}" id="quiz-form">`;
  
      data.questions.forEach((q, i) => {
        formHtml += `<div class="question-block"><p>${i + 1}. ${q.question}</p>`;
  
        if (q.type === "multiple_choice" || q.type === "true_false") {
          q.options.forEach(opt => {
            formHtml += `
              <div class="pl-3 mb-1">
                <input type="radio" name="q${i}" value="${opt.charAt(0)}"> ${opt}
              </div>`;
          });
        } else if (q.type === "fill_in_blank") {
          formHtml += `<input type="text" name="q${i}" class="form-control mt-2" placeholder="Your answer here...">`;
        }
  
        formHtml += `</div>`;
      });
  
      formHtml += `</form>`;
      $("#quiz-content").html(formHtml);
  
      // Append full-width fixed-bottom submit button to <body>
      const buttonHtml = `
        <div class="fixed-bottom">
          <button form="quiz-form" type="submit" class="submit-button w-100 border-0 text-uppercase">
            SUBMIT SUBMIT SUBMIT SUBMIT SUBMIT SUBMIT SUBMIT SUBMIT SUBMIT SUBMIT SUBMIT SUBMIT SUBMIT SUBMIT SUBMIT SUBMIT SUBMIT SUBMIT SUBMIT
          </button>
        </div>
      `;
      $("body").append(buttonHtml);
    });
  });
  