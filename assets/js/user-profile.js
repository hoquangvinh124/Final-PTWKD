// Authentication check - redirect to login if not authenticated
(function checkAuth() {
  const authData = localStorage.getItem('demo.auth');
  if (!authData) {
    window.location.href = 'login.html';
    return;
  }
  
  try {
    const session = JSON.parse(authData);
    if (!session || !session.username) {
      window.location.href = 'login.html';
    }
  } catch (e) {
    localStorage.removeItem('demo.auth');
    window.location.href = 'login.html';
  }
})();

const scrollIntoViewCentered = (element) => {
  if(!element) return;
  element.scrollIntoView({ behavior:'smooth', block:'center' });
};

const highlightElement = (element) => {
  if(!element) return;
  element.classList.remove('is-highlighted');
  // force reflow to restart animation
  void element.offsetWidth;
  element.classList.add('is-highlighted');
  setTimeout(() => {
    element.classList.remove('is-highlighted');
  }, 900);
};

function createPaginator(navElement, { perPage = 3, onPageChange } = {}) {
  if(!navElement) return null;
  const prevBtn = navElement.querySelector('[data-action="prev"]');
  const nextBtn = navElement.querySelector('[data-action="next"]');
  const slotButtons = Array.from(navElement.querySelectorAll('[data-index-slot]'));
  if(!slotButtons.length) return null;

  let pages = [];
  let currentPage = 0;

  const updateControls = () => {
    const totalPages = pages.length;
    const slotCount = slotButtons.length;
    const blockStart = Math.floor(currentPage / slotCount) * slotCount;

    slotButtons.forEach((btn, idx) => {
      const pageIndex = blockStart + idx;
      if(pageIndex < totalPages){
        btn.disabled = false;
        btn.classList.remove('is-hidden');
        btn.dataset.pageIndex = String(pageIndex);
        btn.textContent = String(pageIndex + 1);
        btn.setAttribute('aria-label', `Go to page ${pageIndex + 1}`);
        const isActive = pageIndex === currentPage;
        btn.classList.toggle('is-active', isActive);
        if(isActive){
          btn.setAttribute('aria-current','true');
        }else{
          btn.removeAttribute('aria-current');
        }
      }else{
        btn.disabled = true;
        btn.classList.add('is-hidden');
        btn.removeAttribute('data-page-index');
        btn.removeAttribute('aria-current');
        btn.removeAttribute('aria-label');
        btn.textContent = '';
      }
    });

    const atStart = currentPage === 0;
    const atEnd = currentPage >= totalPages - 1;
    if(prevBtn){
      prevBtn.disabled = atStart || !totalPages;
      prevBtn.setAttribute('aria-disabled', prevBtn.disabled ? 'true' : 'false');
    }
    if(nextBtn){
      nextBtn.disabled = atEnd || !totalPages;
      nextBtn.setAttribute('aria-disabled', nextBtn.disabled ? 'true' : 'false');
    }

    navElement.classList.toggle('is-disabled', !totalPages);
  };

  const emit = () => {
    const items = pages[currentPage] || [];
    onPageChange?.({ page: currentPage, totalPages: pages.length, items });
  };

  const setPage = (page) => {
    const total = pages.length;
    if(!total){
      currentPage = 0;
      updateControls();
      emit();
      return;
    }
    const clamped = Math.max(0, Math.min(page, total - 1));
    currentPage = clamped;
    updateControls();
    emit();
  };

  const shiftPage = (delta) => {
    setPage(currentPage + delta);
  };

  slotButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if(btn.disabled) return;
      const pageIndex = Number(btn.dataset.pageIndex);
      if(Number.isNaN(pageIndex)) return;
      setPage(pageIndex);
    });
    btn.addEventListener('keydown', (event) => {
      if(event.key === 'Enter' || event.key === ' '){
        event.preventDefault();
        btn.click();
      }
    });
  });

  const bindControl = (btn, delta) => {
    if(!btn) return;
    btn.addEventListener('click', () => {
      if(btn.disabled) return;
      shiftPage(delta);
    });
    btn.addEventListener('keydown', (event) => {
      if(event.key === 'Enter' || event.key === ' '){
        event.preventDefault();
        btn.click();
      }
    });
  };

  bindControl(prevBtn, -1);
  bindControl(nextBtn, 1);

  const setItems = (items = []) => {
    pages = [];
    if(items.length){
      for(let i = 0; i < items.length; i += perPage){
        pages.push(items.slice(i, i + perPage));
      }
    }
    if(currentPage >= pages.length){
      currentPage = pages.length ? pages.length - 1 : 0;
    }
    updateControls();
    emit();
  };

  updateControls();
  emit();

  return {
    setItems,
    setPage,
    getPage: () => currentPage
  };
}

function setupFilter(filterGroup, items = [], { getStatus, onFilterChange } = {}) {
  if(!filterGroup) return null;
  const buttons = Array.from(filterGroup.querySelectorAll('.filter-button'));
  if(!buttons.length) return null;
  const statusGetter = typeof getStatus === 'function' ? getStatus : (item => item.dataset.status || '');
  let currentValue = buttons.find(btn => btn.classList.contains('is-active'))?.dataset.filterValue || 'all';

  const apply = (value, { scroll = true } = {}) => {
    currentValue = value;
    const visibleItems = [];
    buttons.forEach(btn => {
      const isActive = btn.dataset.filterValue === value;
      btn.classList.toggle('is-active', isActive);
      if(isActive){
        btn.setAttribute('aria-pressed', 'true');
      }else{
        btn.setAttribute('aria-pressed', 'false');
      }
    });
    items.forEach(item => {
      const status = statusGetter(item);
      const matches = value === 'all' || status === value;
      item.classList.toggle('is-hidden', !matches);
      item.setAttribute('aria-hidden', matches ? 'false' : 'true');
      if(matches){
        visibleItems.push(item);
      }
    });
    if(typeof onFilterChange === 'function'){
      onFilterChange({ value, visibleItems });
    }
    if(scroll && visibleItems.length){
      scrollIntoViewCentered(visibleItems[0]);
      highlightElement(visibleItems[0]);
    }
  };

  buttons.forEach(btn => {
    const value = btn.dataset.filterValue;
    btn.addEventListener('click', () => apply(value));
    btn.addEventListener('keydown', (event) => {
      if(event.key === 'Enter' || event.key === ' '){
        event.preventDefault();
        apply(value);
      }
    });
  });

  // initialise without scrolling
  apply(currentValue, { scroll:false });

  return {
    apply,
    getValue: () => currentValue
  };
}

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
  const heroFrontFace = heroFront ? heroFront.closest('.hero-face') : null;
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

  // Load profile data from session
  const sessionData = JSON.parse(localStorage.getItem('demo.auth') || '{}');
  const profileData = {
    firstName: sessionData.firstName || '',
    lastName: sessionData.lastName || '',
    city: sessionData.city || '',
    birthdate: sessionData.dateOfBirth || '',
    country: sessionData.country || '',
    gender: sessionData.gender || '',
    memberRank: sessionData.memberRank || 'Member',
    avatar: sessionData.avatar || initialAvatar
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
    if(field === 'firstName' || field === 'lastName' || field === 'city' || field === 'country'){
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

  const removeIdsDeep = (node) => {
    if(node && node.removeAttribute){
      node.removeAttribute('id');
    }
    if(node && node.querySelectorAll){
      node.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
    }
  };

  const measureFace = (face, width) => {
    if(!face || !width) return 0;
    const clone = face.cloneNode(true);
    removeIdsDeep(clone);
    const wrapper = document.createElement('div');
    wrapper.className = 'hero-card hero-card-measure';
    wrapper.style.width = `${width}px`;
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);
    const height = wrapper.getBoundingClientRect().height;
    wrapper.remove();
    return height;
  };

  const syncHeight = () => {
    const rect = heroCard.getBoundingClientRect();
    const width = rect.width || heroCard.offsetWidth || heroCard.clientWidth;
    if(!width) return;
    const frontSource = heroFrontFace || heroFront;
    const backSource = heroBack;
    const frontH = measureFace(frontSource, width);
    const backH = measureFace(backSource, width);
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
    profileMain.classList.remove('shipping-mode');
    heroCard.classList.toggle('is-flipped', enable);
    featuredTitle.textContent = enable ? 'Edit profile' : 'Wishlist';
    featuredAction.textContent = enable ? 'Autosave' : 'Updated';
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
      }else if(view === 'shipping'){
        setEditMode(false, {skipTabUpdate:true});
        setTabActive(view);
        profileMain.classList.add('shipping-mode');
      }else{
        setEditMode(false, {skipTabUpdate:true});
        setTabActive(view);
        profileMain.classList.remove('shipping-mode');
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
        country: profileData.country || '',
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

  const editClearBtn = document.getElementById('editProfileClearBtn');
  if(editClearBtn){
    editClearBtn.addEventListener('click', () => {
      // Clear all profile data
      profileData.firstName = '';
      profileData.lastName = '';
      profileData.city = '';
      profileData.birthdate = '';
      profileData.country = '';
      profileData.gender = 'Man';
      profileData.avatar = initialAvatar;
      
      // Clear all input fields
      inputs.forEach(input => {
        const field = input.getAttribute('data-field-input');
        if(field === 'gender'){
          input.value = 'Man';
        } else if(input.type === 'date'){
          input.value = '';
        } else {
          input.value = '';
        }
      });
      
      // Clear avatar upload
      if(avatarImage){
        avatarImage.value = '';
      }
      
      // Update displays
      updateDisplays();
      syncHeight();
      
      // Dispatch clear event
      document.dispatchEvent(new CustomEvent('profile:clear'));
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

  let resizeRaf = null;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(syncHeight);
  });
  updateDisplays();
  setEditMode(false);
})();

// Shipping Address Management
(function(){
  const shippingForm = document.getElementById('shippingAddressForm');
  const shippingSaveBtn = document.getElementById('shippingSaveBtn');
  const shippingClearBtn = document.getElementById('shippingClearBtn');
  const shippingEditBtn = document.getElementById('shippingEditBtn');
  const shippingSavedDisplay = document.getElementById('shippingAddressSaved');
  
  if(!shippingForm || !shippingSaveBtn) return;

  const shippingData = {
    shippingFullName: '',
    shippingPhone: '',
    shippingCity: '',
    shippingStreet: ''
  };

  const loadShippingData = () => {
    try {
      const saved = localStorage.getItem('shippingAddress');
      if(saved){
        const data = JSON.parse(saved);
        Object.assign(shippingData, data);
        updateShippingDisplay();
        return true;
      }
    } catch(e) {}
    return false;
  };

  const saveShippingData = () => {
    try {
      localStorage.setItem('shippingAddress', JSON.stringify(shippingData));
      return true;
    } catch(e) {
      return false;
    }
  };

  const updateShippingDisplay = () => {
    const hasData = Object.values(shippingData).some(v => v);
    
    if(hasData){
      shippingForm.classList.add('d-none');
      shippingSavedDisplay.classList.remove('d-none');
      
      document.getElementById('displayShippingFullName').textContent = shippingData.shippingFullName || '--';
      document.getElementById('displayShippingPhone').textContent = shippingData.shippingPhone || '--';
      document.getElementById('displayShippingCity').textContent = shippingData.shippingCity || '--';
      document.getElementById('displayShippingStreet').textContent = shippingData.shippingStreet || '--';
    } else {
      shippingForm.classList.remove('d-none');
      shippingSavedDisplay.classList.add('d-none');
    }

    const inputs = shippingForm.querySelectorAll('[data-field-input]');
    inputs.forEach(input => {
      const field = input.getAttribute('data-field-input');
      if(shippingData[field] !== undefined){
        input.value = shippingData[field];
      }
    });
  };

  const inputs = shippingForm.querySelectorAll('[data-field-input]');
  inputs.forEach(input => {
    const field = input.getAttribute('data-field-input');
    input.addEventListener('input', () => {
      shippingData[field] = input.value.trim();
    });
  });

  if(shippingSaveBtn){
    shippingSaveBtn.addEventListener('click', () => {
      inputs.forEach(input => {
        const field = input.getAttribute('data-field-input');
        shippingData[field] = input.value.trim();
      });
      
      if(saveShippingData()){
        updateShippingDisplay();
        document.dispatchEvent(new CustomEvent('shipping:saved', {
          detail: shippingData
        }));
      }
    });
  }

  if(shippingClearBtn){
    shippingClearBtn.addEventListener('click', () => {
      Object.keys(shippingData).forEach(key => {
        shippingData[key] = '';
      });
      inputs.forEach(input => {
        input.value = '';
      });
    });
  }

  if(shippingEditBtn){
    shippingEditBtn.addEventListener('click', () => {
      shippingForm.classList.remove('d-none');
      shippingSavedDisplay.classList.add('d-none');
    });
  }

  loadShippingData();
  updateShippingDisplay();

  window.getShippingAddress = () => {
    return {...shippingData};
  };
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

(function(){
  const ticketContainer = document.querySelector('.tickets-grid');
  const cards = ticketContainer ? Array.from(ticketContainer.querySelectorAll('.ticket-card')) : [];
  const detail = document.getElementById('ticketDetail');
  const emptyState = document.getElementById('ticketDetailEmpty');
  const content = document.getElementById('ticketDetailContent');
  const closeBtn = document.getElementById('ticketDetailClose');
  const titleEl = document.getElementById('ticketDetailTitle');
  const statusEl = document.getElementById('ticketDetailStatus');
  const dateEl = document.getElementById('ticketDetailDate');
  const codeEl = document.getElementById('ticketDetailCode');
  const roomEl = document.getElementById('ticketDetailRoom');
  const seatsEl = document.getElementById('ticketDetailSeats');
  const notesEl = document.getElementById('ticketDetailNotes');
  const summaryEl = document.getElementById('ticketDetailSummary');
  const nav = document.querySelector('[data-nav="tickets"]');
  const filterGroup = document.querySelector('[data-filter="tickets"]');

  if(!cards.length || !ticketContainer || !detail || !emptyState || !content || !nav) return;

  let activeCard = null;
  const defaultEmptyText = emptyState.textContent.trim();

  const getContent = (card, attr, selector) => {
    const value = card.dataset[attr];
    if(value) return value;
    if(!selector) return '';
    const node = card.querySelector(selector);
    return node ? node.textContent.trim() : '';
  };

  const clearActiveState = () => {
    cards.forEach(item => {
      item.classList.remove('is-active');
      item.setAttribute('aria-pressed', 'false');
    });
  };

  const setEmptyState = (message = defaultEmptyText) => {
    emptyState.textContent = message;
    detail.classList.add('is-empty');
    emptyState.classList.remove('d-none');
    content.classList.add('d-none');
  };

  const clearDetail = (message = defaultEmptyText) => {
    clearActiveState();
    activeCard = null;
    titleEl.textContent = '';
    const showtimeEl = document.getElementById('ticketDetailShowtime');
    if(showtimeEl){
      showtimeEl.textContent = '';
    }
    dateEl.textContent = '';
    if(codeEl) codeEl.textContent = '';
    roomEl.textContent = '';
    if(seatsEl) seatsEl.textContent = '';
    if(notesEl) notesEl.textContent = '';
    if(summaryEl){
      summaryEl.textContent = '';
    }
    setEmptyState(message);
    const posterEl = document.getElementById('ticketDetailPoster');
    if(posterEl){
      posterEl.removeAttribute('src');
    }
  };

  const showDetail = (card) => {
    activeCard = card;
    cards.forEach(item => {
      const isActive = item === card;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    scrollIntoViewCentered(card);
    highlightElement(card);
    detail.classList.remove('is-empty');
    emptyState.classList.add('d-none');
    content.classList.remove('d-none');

    titleEl.textContent = getContent(card, 'title', '.ticket-title');
    
    const time = card.dataset.time || '';
    const showtime = card.dataset.showtime || '';
    let showtimeLabel = '';
    if(showtime === 'morning') showtimeLabel = 'Morning Show';
    else if(showtime === 'afternoon') showtimeLabel = 'Afternoon Show';
    else if(showtime === 'evening') showtimeLabel = 'Evening Show';
    else if(showtime === 'latenight') showtimeLabel = 'Late Night Show';
    
    const showtimeEl = document.getElementById('ticketDetailShowtime');
    if(showtimeEl){
      showtimeEl.textContent = time ? `${showtimeLabel} · ${time}` : showtimeLabel;
    }

    const posterEl = document.getElementById('ticketDetailPoster');
    if(posterEl){
      const posterSrc = card.dataset.poster || card.querySelector('.ticket-media img')?.getAttribute('src') || '';
      if(posterSrc){
        posterEl.src = posterSrc;
        posterEl.alt = `${getContent(card, 'title', '.ticket-title') || 'Selected screening'} poster`;
      }else{
        posterEl.removeAttribute('src');
      }
    }

    dateEl.textContent = getContent(card, 'date', '.ticket-media-time');
    if(codeEl) codeEl.textContent = getContent(card, 'code', '.ticket-code');
    roomEl.textContent = getContent(card, 'room', '.ticket-room');
    if(seatsEl) seatsEl.textContent = getContent(card, 'seats', '.ticket-seats');

    const description = card.dataset.description || '';
    if(summaryEl){
      summaryEl.textContent = description || 'No summary available.';
    }

    if(notesEl){
      const notes = card.dataset.description || '';
      notesEl.textContent = notes || 'No additional notes.';
    }

    detail.scrollIntoView({behavior:'smooth', block:'nearest'});
  };

  if(closeBtn){
    closeBtn.addEventListener('click', () => {
      clearActiveState();
      setEmptyState();
      activeCard = null;
    });
  }

  cards.forEach(card => {
    card.addEventListener('click', () => {
      showDetail(card);
    });
    card.addEventListener('keydown', (event) => {
      if(event.key === 'Enter' || event.key === ' '){
        event.preventDefault();
        showDetail(card);
      }
    });
  });

  const applyPageItems = (pageItems) => {
    const pageSet = new Set(pageItems);
    cards.forEach(card => {
      const visible = pageSet.has(card);
      card.classList.toggle('is-hidden', !visible);
      card.setAttribute('aria-hidden', visible ? 'false' : 'true');
      card.tabIndex = visible ? 0 : -1;
      if(!visible){
        card.classList.remove('is-active', 'is-highlighted');
      }
    });
    if(activeCard && !pageSet.has(activeCard)){
      clearDetail();
    }
  };

  const paginator = createPaginator(nav, {
    perPage: 3,
    onPageChange: ({ items }) => {
      applyPageItems(items);
      if(items.length){
        clearDetail();
      }
    }
  });

  const applyFilterResults = (visibleItems) => {
    const results = visibleItems.slice();
    if(!results.length){
      cards.forEach(card => {
        card.classList.add('is-hidden');
        card.setAttribute('aria-hidden', 'true');
        card.tabIndex = -1;
        card.classList.remove('is-active', 'is-highlighted');
      });
      paginator?.setItems([]);
      clearDetail('No reservations match this filter.');
      return;
    }
    paginator?.setItems(results);
  };

  applyFilterResults(cards);

  setupFilter(filterGroup, cards, {
    getStatus: (item) => item.dataset.showtime || '',
    onFilterChange: ({ visibleItems }) => {
      applyFilterResults(visibleItems);
    }
  });
  clearDetail();
})();

// Wishlist section - pagination only
(function(){
  const grid = document.querySelector('.wishlist-grid');
  const cards = grid ? Array.from(grid.querySelectorAll('.wishlist-card')) : [];
  const nav = document.querySelector('[data-nav="wishlist"]');

  if(!grid || !cards.length || !nav) return;

  const applyPageItems = (pageItems) => {
    const pageSet = new Set(pageItems);
    cards.forEach(card => {
      const visible = pageSet.has(card);
      card.classList.toggle('is-hidden', !visible);
      card.setAttribute('aria-hidden', visible ? 'false' : 'true');
    });
  };

  // Hide navigation if not enough items (check before creating paginator)
  if (cards.length <= 8) {
    nav.parentElement.style.display = 'none';
    return; // Don't create paginator
  }

  const paginator = createPaginator(nav, {
    perPage: 8,
    onPageChange: ({ items }) => {
      applyPageItems(items);
    }
  });

  paginator?.setItems(cards);
})();

// Logout functionality
(function() {
  const logoutBtn = document.getElementById('logoutBtn');
  
  if (!logoutBtn) return;
  
  logoutBtn.addEventListener('click', () => {
    // Confirm logout
    const confirmLogout = confirm('Are you sure you want to logout?');
    
    if (confirmLogout) {
      // Clear authentication data
      localStorage.removeItem('demo.auth');
      
      // Redirect to login page
      window.location.href = 'login.html';
    }
  });
})();

// Change Password functionality
(function() {
  const changePasswordBtn = document.getElementById('changePasswordBtn');
  const changePasswordModal = document.getElementById('changePasswordModal');
  const changePasswordForm = document.getElementById('changePasswordForm');
  const passwordMessage = document.getElementById('passwordMessage');
  
  if (!changePasswordBtn || !changePasswordModal || !changePasswordForm) return;
  
  // Open modal
  changePasswordBtn.addEventListener('click', () => {
    changePasswordModal.setAttribute('aria-hidden', 'false');
    changePasswordForm.reset();
    passwordMessage.hidden = true;
    passwordMessage.className = 'password-message';
  });
  
  // Close modal
  const closeModal = () => {
    changePasswordModal.setAttribute('aria-hidden', 'true');
    changePasswordForm.reset();
    passwordMessage.hidden = true;
    passwordMessage.className = 'password-message';
  };
  
  // Close on backdrop click or close button
  changePasswordModal.addEventListener('click', (e) => {
    if (e.target.hasAttribute('data-password-close') || e.target.closest('[data-password-close]')) {
      closeModal();
    }
  });
  
  // Toggle password visibility
  changePasswordModal.addEventListener('click', (e) => {
    const toggleBtn = e.target.closest('.toggle-password-visibility');
    if (!toggleBtn) return;
    
    const targetId = toggleBtn.dataset.target;
    const input = document.getElementById(targetId);
    if (!input) return;
    
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    toggleBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
  });
  
  // Handle form submission
  changePasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    
    // Reset message
    passwordMessage.hidden = true;
    passwordMessage.className = 'password-message';
    
    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      showMessage('Please fill in all fields', 'error');
      return;
    }
    
    if (newPassword.length < 6) {
      showMessage('New password must be at least 6 characters', 'error');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      showMessage('New passwords do not match', 'error');
      return;
    }
    
    // Get current user
    const authData = localStorage.getItem('demo.auth');
    if (!authData) {
      showMessage('Not authenticated. Please login again.', 'error');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);
      return;
    }
    
    const currentUser = JSON.parse(authData);
    const username = currentUser.username;
    
    // Get users database
    const usersData = localStorage.getItem('demo.users');
    if (!usersData) {
      showMessage('User database not found', 'error');
      return;
    }
    
    const users = JSON.parse(usersData);
    const user = users.find(u => u.username === username);
    
    if (!user) {
      showMessage('User not found', 'error');
      return;
    }
    
    // Verify current password
    if (user.password !== currentPassword) {
      showMessage('Current password is incorrect', 'error');
      return;
    }
    
    // Update password
    user.password = newPassword;
    localStorage.setItem('demo.users', JSON.stringify(users));
    
    // Show success message
    showMessage('Password updated successfully!', 'success');
    
    // Close modal after 1.5 seconds
    setTimeout(() => {
      closeModal();
    }, 1500);
  });
  
  function showMessage(text, type) {
    passwordMessage.textContent = text;
    passwordMessage.className = `password-message ${type}`;
    passwordMessage.hidden = false;
  }
})();
