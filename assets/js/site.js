(function(){
  const root = document.documentElement;
  function setTheme(mode){
    if(mode === 'dark'){
      root.classList.add('dark');
      localStorage.setItem('theme','dark');
      // Update theme-color for mobile browsers
      var metaTheme = document.querySelector('meta[name="theme-color"]');
      if(metaTheme) metaTheme.content = '#0a0f17';
    }
    else {
      root.classList.remove('dark');
      localStorage.setItem('theme','light');
      // Update theme-color for mobile browsers
      var metaTheme = document.querySelector('meta[name="theme-color"]');
      if(metaTheme) metaTheme.content = '#ffffff';
    }
  }
  window.__toggleTheme = function(){
    const isDark = root.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
  }
  // init
  const saved = localStorage.getItem('theme');
  if(saved){ setTheme(saved); }
  else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){ setTheme('dark'); }
})();
(function(){
  const header = document.querySelector('.site-header');
  if(!header) return;
  const onScroll = () => {
    if (window.scrollY > 6) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();
(function(){
  const els = Array.from(document.querySelectorAll('.post-card, .gallery-item'));
  if (!('IntersectionObserver' in window) || els.length === 0) return;
  els.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
  els.forEach(el=> io.observe(el));
})();
(function(){
  const progressBar = document.getElementById('scroll-progress');
  if(!progressBar) return;
  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = progress + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();
})();
(function(){
  // Set active navigation link
  const navLinks = document.querySelectorAll('.nav a[href]');
  const currentPath = window.location.pathname;
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    // Exact match or if it's a section page (blog, portfolio, about, contact)
    if (href === currentPath ||
        (currentPath.startsWith(href) && href !== '/' && href.length > 1)) {
      link.classList.add('active');
    }
  });
})();
