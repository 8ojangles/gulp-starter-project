function whichTransitionEvent(){
  var t;
  var el = document.createElement('fakeelement');
  var transitions = {
    'WebkitTransition' :'webkitTransitionEnd',
    'MozTransition'    :'transitionend',
    'MSTransition'     :'msTransitionEnd',
    'OTransition'      :'oTransitionEnd',
    'transition'       :'transitionEnd'
  }

  for(t in transitions){
    if( el.style[t] !== undefined ){
      console.log( transitions[t] );
      return transitions[t];
    }
  }


}

module.exports = whichTransitionEvent;