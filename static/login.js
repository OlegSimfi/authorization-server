$('.login-form').on('submit', function(e){
  e.preventDefault();

  $.ajax({
    url: '/login',
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({
      login: $('#field-login').val(),
      password: $('#field-pasw').val()
    }),
    method: 'post',
    beforeSend: function(){
      $('.login-message').slideUp(250);
      $('.submit .submit-text').css('display', 'none');
      $('.submit .dot-loader').css('display', 'flex');
    },
    success: function(res){
      window.location = res.redirect
    },
    error: function(err){
      $('.login-message').slideDown(250);
    },
    complete: function(){
      $('.submit .submit-text').css('display', 'block');
      $('.submit .dot-loader').css('display', 'none');
    }
  })
})