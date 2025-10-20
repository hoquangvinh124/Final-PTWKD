(function(){
  const toggle = document.getElementById('spotifyToggle');
  const panel = document.getElementById('spotifyPanel');
  const hero = document.querySelector('.artist-hero');
  const player = document.getElementById('spotifyPlayer');
  const buttons = Array.from(document.querySelectorAll('.spotify-track-btn'));

  if(!toggle || !panel || !hero || !player) return;

  const setOpen = (open) => {
    panel.classList.toggle('is-open', open);
    panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    hero.classList.toggle('blur-active', open);
    toggle.classList.toggle('is-spinning', open);
  };

  const activateButton = (btn) => {
    buttons.forEach(b => b.classList.toggle('active', b === btn));
    const src = btn?.getAttribute('data-src');
    if(src){
      player.src = src;
    }
  };

  toggle.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = !panel.classList.contains('is-open');
    setOpen(isOpen);
  });

  buttons.forEach(btn => {
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      activateButton(btn);
    });
  });

  document.addEventListener('click', (event) => {
    if (!panel.classList.contains('is-open')) return;
    if (panel.contains(event.target)) return;
    if (toggle.contains(event.target)) return;
    setOpen(false);
  });
})();

(function(){
  const profileMain = document.querySelector('.profile-main');
  const heroCard = document.getElementById('heroCard');
  const heroFront = document.getElementById('heroFront');
  const heroBack = document.getElementById('heroBack');
  const flipToggle = document.getElementById('heroFlipToggle');
  const heroEditBtn = document.getElementById('heroEditBtn');
  const heroTabs = Array.from(document.querySelectorAll('.hero-tabs button'));
  const featuredTitle = document.getElementById('featuredPanelTitle');
  const featuredAction = document.getElementById('featuredPanelAction');
  const editForm = document.getElementById('editProfileForm');
  const inputs = editForm ? Array.from(editForm.querySelectorAll('[data-field-input]')) : [];
  const displays = Array.from(document.querySelectorAll('[data-field-display]'));

  if(!profileMain || !heroCard || !heroFront || !heroBack) return;

  const avatarImage = document.getElementById('editAvatar');
  const avatarPreview = document.getElementById('editAvatarPreview');
  const heroAvatar = document.querySelector('.hero-portrait img');
  const passportPhoto = document.querySelector('.passport-photo img');

  const initialAvatar = heroAvatar ? heroAvatar.getAttribute('src') : '';
  const editSaveBtn = document.getElementById('editProfileSaveBtn');
  const profileData = {
    firstName:'',
    lastName:'',
    city:'',
    birthdate:'',
    age:'',
    gender:'',
    avatar: initialAvatar
  };

  const formatDate = (value) => {
    if(!value) return '';
    const parts = value.split('-');
    if(parts.length !== 3) return value;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };
  const updateAvatarDisplays = (src) => {
    if(src && heroAvatar) heroAvatar.src = src;
    if(src && passportPhoto) passportPhoto.src = src;
    if(avatarPreview){
      avatarPreview.src = src;
      avatarPreview.style.display = src ? 'block' : 'none';
    }
  };

  const formatValue = (field, value) => {
    if(!value) return '--';
    if(field === 'birthdate'){
      return formatDate(value);
    }
    if(field === 'age'){
      return `${value} years ol`;
    }
    if(field === 'firstName' || field === 'lastName' || field === 'city'){
      return value;
    }
    if(field === 'gender'){
      return value;
    }
    if(field === 'fullName'){
      return value;
    }
    return value;
  };

  const updateDisplays = () => {
    profileData.fullName = `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim();
    displays.forEach(el => {
      const field = el.getAttribute('data-field-display');
      if(!field) return;
      const rawValue = profileData[field] || '';
      el.textContent = formatValue(field, rawValue);
      el.dataset.state = rawValue ? 'filled' : 'empty';
    });
    updateAvatarDisplays(profileData.avatar);
  };
  const readInputValue = (input) => {
    if(input.type === 'date'){
      return input.value;
    }
    return input.value.trim();
  };

  const syncHeight = () => {
    const frontH = heroFront.scrollHeight;
    const backH = heroBack.scrollHeight;
    const target = Math.max(frontH, backH);
    if(target){
      heroCard.style.height = `${target}px`;
    }
  };

  const setTabActive = (view) => {
    heroTabs.forEach(btn => {
      const isActive = btn.dataset.view === view;
      btn.classList.toggle('active', isActive);
    });
  };

  const setEditMode = (enable, opts = {}) => {
    profileMain.classList.toggle('edit-mode', enable);
    heroCard.classList.toggle('is-flipped', enable);
    featuredTitle.textContent = enable ? 'Edit profile' : 'Featured songs';
    featuredAction.textContent = enable ? 'Autosave' : 'Shuffle';
    if(!opts.skipTabUpdate){
      setTabActive(enable ? 'edit' : 'overview');
    }
    flipToggle?.setAttribute('aria-pressed', enable ? 'true' : 'false');
    syncHeight();
  };

  inputs.forEach(input => {
    const field = input.getAttribute('data-field-input');
    if(!field) return;
    const initial = profileData[field] || '';
    if(initial && input.type !== 'date'){
      input.value = initial;
    }else if(initial && input.type === 'date'){
      input.value = initial;
    }
    input.addEventListener('input', () => {
      profileData[field] = readInputValue(input);
      updateDisplays();
      syncHeight();
    });
    input.addEventListener('change', () => {
      profileData[field] = readInputValue(input);
      updateDisplays();
      syncHeight();
    });
  });

  if(avatarImage){
    avatarImage.addEventListener('change', () => {
      const file = avatarImage.files && avatarImage.files[0];
      if(!file){
        profileData.avatar = initialAvatar;
        updateDisplays();
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        profileData.avatar = reader.result;
        updateDisplays();
        syncHeight();
      };
      reader.readAsDataURL(file);
    });

    const triggerAvatarUpload = () => avatarImage.click();
    if(avatarPreview){
      avatarPreview.addEventListener('click', triggerAvatarUpload);
    }
    const dropLabel = document.querySelector('.avatar-drop');
    if(dropLabel){
      dropLabel.addEventListener('click', (e) => {
        if(e.target !== avatarImage){
          e.preventDefault();
          triggerAvatarUpload();
        }
      });
    }
  }

  heroTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      if(view === 'edit'){
        setEditMode(true);
      }else if(view === 'overview'){
        setEditMode(false);
      }else{
        setEditMode(false, {skipTabUpdate:true});
        setTabActive(view);
      }
    });
  });

  if(heroEditBtn){
    heroEditBtn.addEventListener('click', () => setEditMode(true));
  }

  if(editSaveBtn){
    editSaveBtn.addEventListener('click', () => {
      const payload = {
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        city: profileData.city || '',
        birthdate: profileData.birthdate || '',
        age: profileData.age || '',
        gender: profileData.gender || '',
        avatar: profileData.avatar || ''
      };
      const eventDetail = { detail: payload };
      document.dispatchEvent(new CustomEvent('profile:save', eventDetail));
      if(window.fetch){
        try{
          fetch('/api/profile', {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(payload)
          }).catch(()=>{});
        }catch(e){}
      }
    });
  }

  if(flipToggle){
    flipToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      const flipped = heroCard.classList.toggle('is-flipped');
      flipToggle.setAttribute('aria-pressed', flipped ? 'true' : 'false');
      syncHeight();
    });
  }

  document.addEventListener('click', (event) => {
    if(heroCard.classList.contains('is-flipped') && !profileMain.classList.contains('edit-mode')){
      const target = event.target;
      if(heroCard.contains(target)) return;
      if(flipToggle && flipToggle.contains(target)) return;
      heroCard.classList.remove('is-flipped');
      flipToggle?.setAttribute('aria-pressed','false');
      syncHeight();
      return;
    }
    if(!profileMain.classList.contains('edit-mode')) return;
    const target = event.target;
    if(heroCard.contains(target)) return;
    if(editForm && editForm.contains(target)) return;
    const spotifyPanel = document.getElementById('spotifyPanel');
    if(spotifyPanel && spotifyPanel.contains(target)) return;
    if(flipToggle && flipToggle.contains(target)) return;
    if(heroEditBtn && heroEditBtn.contains(target)) return;
    setEditMode(false);
  });

  window.addEventListener('resize', syncHeight);
  updateDisplays();
  setEditMode(false);
})();

(function(){
  const bioToggle = document.getElementById('bioEditToggle');
  const bioView = document.getElementById('biographyView');
  const bioEdit = document.getElementById('biographyEdit');
  const bioInput = document.getElementById('biographyInput');
  const bioSave = document.getElementById('bioSaveBtn');
  const bioCancel = document.getElementById('bioCancelBtn');
  if(!bioToggle || !bioView || !bioEdit || !bioInput || !bioSave || !bioCancel) return;

  const getText = () => Array.from(bioView.querySelectorAll('p')).map(p=>p.textContent.trim()).join('\n\n');
  const setView = (text) => {
    const parts = text.split(/\n{2,}/).map(t=>t.trim()).filter(Boolean);
    bioView.innerHTML = parts.map(p=>`<p>${p}</p>`).join('');
  };

  const enterEdit = () => {
    bioInput.value = getText();
    bioView.classList.add('d-none');
    bioEdit.classList.remove('d-none');
    bioInput.focus();
  };

  const exitEdit = () => {
    bioView.classList.remove('d-none');
    bioEdit.classList.add('d-none');
  };

  bioToggle.addEventListener('click', enterEdit);
  bioCancel.addEventListener('click', () => {
    exitEdit();
  });
  bioSave.addEventListener('click', () => {
    setView(bioInput.value);
    exitEdit();
  });
})();
