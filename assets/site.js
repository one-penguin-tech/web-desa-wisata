(function(){
  document.documentElement.classList.add('js');
  var els=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
    els.forEach(function(e){io.observe(e)});
  }else{els.forEach(function(e){e.classList.add('in')})}

  // directory: search + kecamatan filter
  var q=document.getElementById('q'),kec=document.getElementById('kec'),grid=document.getElementById('villages');
  if(grid){
    var items=[].slice.call(grid.children),count=document.getElementById('count'),empty=document.getElementById('empty');
    var run=function(){
      var t=q.value.trim().toLowerCase(),k=kec.value,n=0;
      items.forEach(function(i){
        var ok=(!k||i.dataset.kec===k)&&(!t||i.textContent.toLowerCase().indexOf(t)>-1);
        i.hidden=!ok;if(ok)n++;
      });
      count.textContent=n+' desa ditampilkan';empty.hidden=n>0;
    };
    q.addEventListener('input',run);kec.addEventListener('change',run);run();
  }

  // events: category chips
  var chips=document.querySelectorAll('[data-filter]');
  if(chips.length){
    var evs=document.querySelectorAll('[data-cat]'),eEmpty=document.getElementById('ev-empty');
    chips.forEach(function(c){c.addEventListener('click',function(){
      chips.forEach(function(x){x.setAttribute('aria-pressed',x===c)});
      var f=c.dataset.filter,n=0;
      evs.forEach(function(e){var ok=f==='semua'||e.dataset.cat===f;e.hidden=!ok;if(ok)n++});
      eEmpty.hidden=n>0;
    })});
  }

  // aspiration form (stored in this browser only)
  var form=document.getElementById('aspirasi'),list=document.getElementById('comments');
  if(form){
    var KEY='forkom-aspirasi',read=function(){try{return JSON.parse(localStorage.getItem(KEY))||[]}catch(e){return[]}};
    var esc=function(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML};
    var render=function(){
      var a=read();
      list.innerHTML=a.length?a.map(function(c){return '<div class="comment"><b>'+esc(c.nama)+'</b><small>'+esc(c.asal)+' - '+esc(c.waktu)+'</small><p>'+esc(c.isi)+'</p></div>'}).join(''):'<div class="empty">Belum ada aspirasi. Jadilah yang pertama menulis.</div>';
    };
    form.addEventListener('submit',function(ev){
      ev.preventDefault();
      var ok=true;
      ['nama','asal','isi'].forEach(function(id){
        var f=form.elements[id],e=document.getElementById(id+'-err');
        var bad=!f.value.trim();e.textContent=bad?'Kolom ini wajib diisi.':'';f.setAttribute('aria-invalid',bad);if(bad)ok=false;
      });
      var st=document.getElementById('status');
      if(!ok){st.textContent='';return}
      var a=read();
      a.unshift({nama:form.nama.value.trim(),asal:form.asal.value.trim(),isi:form.isi.value.trim(),waktu:new Date().toLocaleString('id-ID')});
      try{localStorage.setItem(KEY,JSON.stringify(a.slice(0,30)))}catch(e){}
      form.reset();render();st.textContent='Terima kasih, aspirasi Anda sudah tampil di bawah.';
    });
    render();
  }
})();
