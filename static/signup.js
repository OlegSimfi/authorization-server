$('.login-form').on('submit', function(e){
  e.preventDefault();

  $.ajax({
    url: '/signup',
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({
      login: $('#field-login').val(),
      password: $('#field-password').val(),
      password2: $('#field-password2').val()
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
      console.log('err', err)
      $('.login-message').slideDown(250);
    },
    
    complete: function(){
      $('.submit .submit-text').css('display', 'block');
      $('.submit .dot-loader').css('display', 'none');
    }
  })
})