// Простой роутер на основе location.hash
export function getRoute() {
  const hash = location.hash.replace(/^#\/?/, '');
  return hash || 'home';
}

export function navigate(route) {
  if (getRoute() === route) return;
  location.hash = route === 'home' ? '' : '/' + route;
}

export function onRouteChange(handler) {
  window.addEventListener('hashchange', () => handler(getRoute()));
}