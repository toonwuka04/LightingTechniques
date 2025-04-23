$(document).ready(function () {
    $.getJSON("/get_quiz_data", function (data) {
      $("#quiz-title").text(data.title);

      data.questions.forEach((q, i) => {
        let html = `<div class="question-block"><p>${i + 1}. ${q.question}</p>`;
        
        if (q.type === "multiple_choice") {
          q.options.forEach(opt => {
            html += `<div class="pl-3 mb-1">${opt}</div>`;
          });
        } else if (q.type === "fill_in_blank") {
          html += `<input type="text" class="form-control mt-2" placeholder="Your answer here...">`;
        }
      
        html += `</div>`; // close the question-block div
        $("#quiz-content").append(html);
      });
    });
  });