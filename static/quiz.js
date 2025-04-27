$(document).ready(function () {
  $.getJSON(`/get_quiz_data/${quizId}`, function (data) {
      $("#quiz-title").text(data.title);

      let formHtml = `<form method="POST" action="/submit_quiz/${quizId}" id="quiz-form">`;
      
      data.questions.forEach((q, i) => {
          formHtml += `<div class="question-block" id="q${i}-block"><p>${i + 1}. ${q.question}</p>`;
          
          if (q.type === "multiple_choice" || q.type === "true_false") {
              q.options.forEach(opt => {
                  formHtml += `
                      <div class="pl-3 mb-1">
                          <input type="radio" name="q${i}" value="${opt.charAt(0)}" id="q${i}_${opt.charAt(0)}"> 
                          <label for="q${i}_${opt.charAt(0)}">${opt}</label>
                      </div>`;
              });
              formHtml += `<div class="error-message text-danger pl-3" id="q${i}-error" style="display:none;">Please select an option</div>`;
          } else if (q.type === "fill_in_blank") {
              formHtml += `
                  <input type="text" name="q${i}" class="form-control mt-2" placeholder="Your answer here...">
                  <div class="error-message text-danger" id="q${i}-error" style="display:none;">Please fill in this field</div>
              `;
          }
          
          formHtml += `</div>`;
      });

      formHtml += `</form>`;
      $("#quiz-content").html(formHtml);

      // Append submit button
      const buttonHtml = `
          <div class="fixed-bottom">
              <button form="quiz-form" type="submit" class="submit-button w-100 border-0 text-uppercase">
                  SUBMIT SUBMIT SUBMIT SUBMIT SUBMIT SUBMIT SUBMIT SUBMIT SUBMIT SUBMIT SUBMIT SUBMIT SUBMIT SUBMIT SUBMIT SUBMIT SUBMIT SUBMIT SUBMIT
              </button>
          </div>
      `;
      $("body").append(buttonHtml);

      // Form validation
      $("#quiz-form").on("submit", function(e) {
          let isValid = true;
          
          data.questions.forEach((q, i) => {
              const errorElement = $(`#q${i}-error`);
              const questionBlock = $(`#q${i}-block`);
              
              // Reset error state
              errorElement.hide();
              questionBlock.removeClass("has-error");
              
              if (q.type === "multiple_choice" || q.type === "true_false") {
                  if (!$(`input[name="q${i}"]:checked`).val()) {
                      errorElement.show();
                      questionBlock.addClass("has-error");
                      isValid = false;
                  }
              } else if (q.type === "fill_in_blank") {
                  const answer = $(`input[name="q${i}"]`).val().trim();
                  if (!answer) {
                      errorElement.show();
                      questionBlock.addClass("has-error");
                      isValid = false;
                  }
              }
          });
          
          if (!isValid) {
              e.preventDefault();
              // Scroll to first error
              $("html, body").animate({
                  scrollTop: $(".has-error").first().offset().top - 20
              }, 500);
          }
      });

      // Add real-time validation for fill-in-the-blank questions
      $("body").on("input", 'input[type="text"]', function() {
          const name = $(this).attr("name");
          const errorElement = $(`#${name}-error`);
          if ($(this).val().trim()) {
              errorElement.hide();
              $(`#${name}-block`).removeClass("has-error");
          }
      });

      // Add real-time validation for radio buttons
      $("body").on("change", 'input[type="radio"]', function() {
          const name = $(this).attr("name");
          const errorElement = $(`#${name}-error`);
          errorElement.hide();
          $(`#${name}-block`).removeClass("has-error");
      });
  });
});