var g_timer = null;
window.onload = function() {
  
    init();
  }

  function init()
  {
    appendSteps();
    $('.stepper-item').on( 'click', function ( e ) { onStep(this); });
    $('.nav').on( 'click', function ( e ) { onNav(this); });
  }

  function appendSteps()
  {
    let steps = [];
    steps.push({name:"Name",id:"TXT",validation:"validateTXT"});
    steps.push({name:"Age",id:"NUM",validation:"validateNUM"});
    steps.push({name:"Date of bitrh",id:"DATE",validation:"validateDATE"});
    steps.push({name:"Consent",id:"CB",validation:"validateCB"});

    let cont = 1;

    for(step of steps)
    {
        appendStep(step,cont);
        cont++;
    }
  }

  function onNav(div)
  {
    if(isWizardComplete())
        return;

      let active_step = $('.stepper-item.active').attr('step_num');
      if($(div).attr('action') == 'next')
      {
        if(active_step != $('.stepper-item').length)
         active_step++;
        
      }
      else
      {
        if(active_step > 1)
            active_step--;
      }
    
      let query = ".stepper-item[step_num='" + active_step + "']";

      onStep($(query));



  }

  function appendStep(step,step_number)
  {
    
    let stepper_item = $("<div/>");
    if(step_number == 1)
        stepper_item.addClass('stepper-item active');
    else
	    stepper_item.addClass('stepper-item');

    stepper_item.attr('validate',step.validation)
    stepper_item.attr('step',step.id);
    stepper_item.attr('step_num',step_number);

    $('.stepper-wrapper').append(stepper_item);

    let step_counter = $("<div/>");
	step_counter.addClass('step-counter');
	step_counter.html(step_number);

    let step_name = $("<div/>");
	step_name.addClass('step-name');
	step_name.html(step.name);

    stepper_item.append(step_counter);
    stepper_item.append(step_name);


    
  }

  function isWizardComplete()
  {
      let complete = $('.stepper-item.completed').length == $('.stepper-item').length;
      if(complete)
      {
        $('.navs').css('display','none');
        uiShowInfo('<i style="color:#66FF00; margin-right:8px" class="fa fa-check-circle"></i>Wizard complete!!',3);
      }

      return complete;

  }

  function onStep(div)
  {
    if(isWizardComplete())
        return;

    validateCurrentStep($(div).attr('step_num'));
  }

  function setActiveStep(div)
  {
    let obj = div;
    setActiveScreen(obj);
    setStepsStatus($(obj).attr('step_num'));

    if(isWizardComplete())
        return;

    $('.stepper-item.active').attr('class','stepper-item');
    $(obj).attr('class','stepper-item active');

    
    if($(div).attr('step_num') == $('.stepper-item').length)
    {
        $('#btn_next').html('Finish');
    }
    else
    {
      $('#btn_next').html('Next');
    }
  }

  function showProfileDiv()
  {
    
    if($('.profile').length < 1)
      $('body').append('<div class="profile"></div>');

    return $('.profile');
  }

  function showUserProfile()
  {
    
      if($('#username').val() != '')
      {
        let profile = showProfileDiv();
        let ht = "<i style='margin-right:6px' class='fa fa-user'></i>" + $('#username').val();
        if($('.uname').length < 1)
          profile.append('<div class="uname">' + ht + '</div>');
        else
          $('.uname').html(ht);
      }

      if($('#userage').val() != '')
      {
        let profile = showProfileDiv();
        let ht = "<i style='margin-right:6px' class='fa fa-address-card'></i>" + $('#userage').val();

        if($('.uage').length < 1)
          profile.append('<div class="uage">' + ht + '</div>');
        else
          $('.uage').html(ht);
      }

      if($('#userdate').val() != '')
      {
        let profile = showProfileDiv();
        let ht = "<i style='margin-right:6px' class='fa fa-calendar	'></i>" + $('#userdate').val();

        if($('.udate').length < 1)
          profile.append('<div class="udate">' + ht + '</div>');
        else
          $('.udate').html(ht);
      }
  }

  function validateCurrentStep(next_step)
  {
    let validate = true;
    let query = ".stepper-item[step_num='" + next_step + "']";
    if(next_step >=  $('.stepper-item.active').attr('step_num'))
    {
        let func = $('.stepper-item.active').attr('validate');
        validate = window[func](next_step);
        if(validate)
        {
            setStepComplete($('.stepper-item.active'));
        }
    }

    if(validate)
    {
        showUserProfile();
        setActiveStep($(query));
    }
    else
    {
        uiShowInfo('step not completed',3);
        setStepWarning($('.stepper-item.active'));
    }

  }

  function validateTXT(next_step)
  {
    
    let validate = $('#username').val() != '';
    return validate;

     
  }

  function validateNUM(next_step)
  {
    
    let validate = $('#userage').val() != '';
    return validate;

     
  }

  function validateDATE(next_step)
  {
   
    let validate = $('#userdate').val();
    return validate != '';

     
  }

  function validateCB(next_step)
  {
    
      return $('#useragree').is(":checked");


     
  }

  function setActiveScreen(obj)
  {
     let query = ".screen[step='" + $(obj).attr('step') + "']";
    $('.screen').css('display','none');
    $(query).css('display','flex');
  }

  function setStepComplete(div)
  {
  
    $(div).find('.step-counter').html('<i class="fa fa-check"></i>     ');
    $(div).find('.step-counter').css('color','black');
    $(div).attr('class','stepper-item completed');
  }

  function setStepWarning(div)
  {
    $(div).find('.step-counter').html('<i class="fa fa-warning"></i>');
    $(div).find('.step-counter').css('color','red');
  }

  function uiShowInfo(message,duration)
{
	if(g_timer != null)
		 clearInterval(g_timer);
	 
		var info = $("<div/>");
	info.addClass('info');
	info.html(message);
	$('body').append(info);

	
	
	
	var secs = duration * 1000;
	g_timer = setInterval(clearInfo, secs);
}

function clearInfo() 
{
 $('.info').remove();
 
 clearInterval(g_timer);

 
}


  function setStepsStatus(current_step)
  {
    let warn = false;
    $( ".stepper-item" ).each(function( index ) {
   
        if($(this).attr('step_num') < current_step)
        {
            let func = $(this).attr('validate');
            let validate = window[func](current_step);
            if(validate)
            {
                setStepComplete(this);
            }
            else
            {
                warn = true;
                setStepWarning(this);
            }
        }
      
      });

      if(warn)
        uiShowInfo('You still have pending steps',3);
  }
  