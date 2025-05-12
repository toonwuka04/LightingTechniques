$(document).ready(function () {
    $.getJSON(`/get_quiz_data/${quizId}`, function (data) {
      $("#quiz-title").text(data.title);
  
      let formHtml = `<form method="POST" action="/submit_quiz/${quizId}" id="quiz-form">`;
  
      data.questions.forEach((q, i) => {
        formHtml += `<div class="question-block" id="q${i}-block">
          <p style="font-family: Arial; font-size: 18px;">${i + 1}. ${q.question}</p>`;
  
        if (q.type === "multiple_choice" || q.type === "true_false") {
          q.options.forEach(opt => {
            formHtml += `
              <div class="pl-3 mb-1" style="font-family: Arial;">
                <input type="radio" name="q${i}" value="${opt.charAt(0)}" id="q${i}_${opt.charAt(0)}"> 
                <label for="q${i}_${opt.charAt(0)}">${opt}</label>
              </div>`;
          });
          formHtml += `<div class="error-message text-danger pl-3" id="q${i}-error" style="display:none;">Please select an option</div>`;
        } else if (q.type === "fill_in_blank") {
          formHtml += `
            <input type="text" name="q${i}" class="form-control mt-2" placeholder="Your answer here..." style="font-family: Arial;">
            <div class="error-message text-danger" id="q${i}-error" style="display:none;">Please fill in this field</div>`;
        }
  
        formHtml += `</div>`;
      });
  
      formHtml += `</form>`;
      $("#quiz-content").html(formHtml);
  

      const repeatedText = "SUBMIT ".repeat(50);
      const barHtml = `
        <div id="marquee-bar" style="
          position: fixed;
          bottom: 0;
          width: 100%;
          background-color: white;
          overflow: hidden;
          z-index: 9999;
          height: 60px;
          cursor: pointer;
        ">
          <div id="submit-text" style="
            display: inline-block;
            white-space: nowrap;
            animation: scroll-left 15s linear infinite;
            font-family: Arial, sans-serif;
            font-size: 22px;
            font-weight: 400;
            color: black;
            line-height: 60px;
          ">
            ${repeatedText}
          </div>
        </div>
        <style>
          @keyframes scroll-left {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
        </style>
      `;
      $("body").append(barHtml);
  

      $("#marquee-bar").on("click", function () {
        $("#quiz-form").trigger("submit");
      });

      $("#quiz-form").on("submit", function (e) {
        let isValid = true;
  
        data.questions.forEach((q, i) => {
          const errorElement = $(`#q${i}-error`);
          const questionBlock = $(`#q${i}-block`);
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
          $("html, body").animate({
            scrollTop: $(".has-error").first().offset().top - 20
          }, 500);
        }
      });
  

      $("body").on("input", 'input[type="text"]', function () {
        const name = $(this).attr("name");
        const errorElement = $(`#${name}-error`);
        if ($(this).val().trim()) {
          errorElement.hide();
          $(`#${name}-block`).removeClass("has-error");
        }
      });
  
      $("body").on("change", 'input[type="radio"]', function () {
        const name = $(this).attr("name");
        const errorElement = $(`#${name}-error`);
        errorElement.hide();
        $(`#${name}-block`).removeClass("has-error");
      });
    });
  });
  
