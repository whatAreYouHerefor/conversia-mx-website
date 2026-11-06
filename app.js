const header = document.querySelector('header');
const toggle = document.querySelector('.mobile-toggle');
const menus = [...document.querySelectorAll('.nav-dropdown')];
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  header.classList.toggle('nav-open', open);
});
menus.forEach(menu => menu.addEventListener('toggle', () => {
  if (menu.open) menus.filter(other => other !== menu).forEach(other => { other.open = false; });
}));
document.addEventListener('click', event => {
  menus.forEach(menu => { if (!menu.contains(event.target)) menu.open = false; });
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  const open = menus.find(menu => menu.open);
  if (open) { open.open = false; open.querySelector('summary').focus(); }
  else if (header.classList.contains('nav-open')) { header.classList.remove('nav-open'); toggle.setAttribute('aria-expanded','false'); toggle.focus(); }
});
document.querySelectorAll('nav a').forEach(link => link.addEventListener('click', () => {
  menus.forEach(menu => { menu.open = false; });
  header.classList.remove('nav-open'); toggle.setAttribute('aria-expanded','false');
}));
const tabs = [...document.querySelectorAll('[data-tab]')];
function selectTab(tab, focus = false) {
  tabs.forEach(button => { const active = tab === button; button.setAttribute('aria-selected',String(active)); button.tabIndex = active ? 0 : -1; });
  document.querySelectorAll('[data-panel]').forEach(panel => { panel.hidden = panel.dataset.panel !== tab.dataset.tab; });
  if (focus) tab.focus();
}
tabs.forEach((tab,index) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); selectTab(tabs[next], true); }
  });
});
// The illustrated sidebar and tabs control the same workspace views.
document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => {
  const tab = tabs.find(tab => tab.dataset.tab === button.dataset.view);
  if (tab) selectTab(tab);
}));
const syncSidebar = () => document.querySelectorAll('[data-view]').forEach(button => {
  const selected = document.querySelector(`[data-tab="${button.dataset.view}"]`)?.getAttribute('aria-selected') === 'true';
  button.classList.toggle('demo-active', selected);
  button.setAttribute('aria-pressed', String(selected));
});
new MutationObserver(syncSidebar).observe(document.querySelector('.demo-tabs'),{subtree:true,attributes:true,attributeFilter:['aria-selected']});
