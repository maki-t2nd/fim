(function($){
$(function(){
  var _form    = $('#form'),
      _genBtn  = $('#genBtn'),
      _addBtn  = $('#addBtn'),
      _delBtn  = $('#delBtn'),
      _gen     = $('#generate'),
      temp     = $('#template').html(),
      delBtn   = '.del',
      _genArea = $('#bookmarkret'),
      ls       = localStorage;

  var lsKey = JSON.parse(ls.getItem('keyData')) || '';
  if(lsKey != ''){
    for(var i=0;i<lsKey.length;i++){
      var key = lsKey[i];
      var val = ls.getItem(key);
      if(i==0){
        _gen.find('[name="key[]"]').val(key);
        _gen.find('[name="value[]"]').val(val);
      }else{
        var _addElm = $(temp);
        _addElm.find('[name="key[]"]').val(key);
        _addElm.find('[name="value[]"]').val(val);
        _gen.append(_addElm);
      }
    }
  }

  _genBtn.on('click', function(e){
    e.preventDefault();
    lsKey = [];
    var lsVal = [];
    var posts = _form.serializeArray();
    var script   = 'javascript:';
    var varTxt = 'var o={';
    for(var i=0;i < posts.length;i++){
      if(posts[i].name == 'key[]'){
        varTxt += '"' + posts[i].value + '":';
        lsKey.push(posts[i].value);
      }else{
        if(posts[i].value.match(/^\[.*\]$/)){
          varTxt += posts[i].value;
        }else{
          varTxt += '"'+ posts[i].value +'"';
        }
        lsVal.push(posts[i].value);
      }
      if(posts[i].name == 'value[]' && i != posts.length - 1){
        varTxt += ',';
      }
    }
    varTxt += '};';

    script +=
      '(function(){'+
        varTxt+
        'var _form=document.forms[0];'+
        'for(var i=0;i<_form.length;i++){'+
          'var _fe=_form[i];'+
          'var k=_fe.name;'+
          'var t=_fe.type;'+
          'if(t=="radio"){'+
            'if(o[k]==_fe.value){'+
              '_fe.checked=true;'+
            '}'+
          '}else if(t=="select-one"||t=="select-multiple"){'+
            'for(var j=0;j<_fe.length;j++){'+
              'if(o[k]==_fe.options[j].value){'+
                '_fe.options[j].selected=true;'+
              '}'+
            '}'+
          '}else if(t=="checkbox"){'+
            'if((o[k]!=undefined)&&(o[k] instanceof Array)){'+
              'for(var h=0;h<o[k].length;h++){'+
                'if(o[k][h]==_fe.value){'+
                  '_fe.checked=true;'+
                '}'+
              '}'+
            '}'+
          '}else{'+
            'if(o[k]!=undefined){'+
              '_fe.value=o[k];'+
            '}'+
          '}'+
        '}'+
      '})();';

    // ブックマークレットに設定
    _genArea.find('a').attr('href', script);
    _genArea.removeClass('hide');

    // ローカルストレージへ保存
    ls.setItem('keyData', JSON.stringify(lsKey));
    for(var i=0;i<lsKey.length;i++){
      ls.setItem(lsKey[i], lsVal[i]);
    }

  });
  
  // 入力エリア追加
  _addBtn.on('click', function(e){
    e.preventDefault();
    _gen.append(temp);
  });

  // 入力エリア削除
  $(document).on('click', delBtn, function(e){
    e.preventDefault();
    if(confirm('削除します。よろしいですか？')){
      $(this).parents('.group').remove();
    }
  });

  // ローカルストレージの履歴削除
  _delBtn.on('click', function(e){
    e.preventDefault();
    ls.clear();
    window.location.reload();
  });
  
});
})(jQuery);