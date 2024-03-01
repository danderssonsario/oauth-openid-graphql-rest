/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// ----------------------------------------------------------------------------
// Handles the "active" class on the navigation links.
//
document.addEventListener('DOMContentLoaded', () => {
  // Make all currently active items inactive.
  document.querySelectorAll('a.nav-link.active').forEach((a) => {
    a.classList.remove('active')
    a.attributes.removeNamedItem('aria-current')
  })

  // Find the link to the current page and make it active.
  document.querySelectorAll(`a[href$="${location.pathname}"].nav-link`).forEach((a) => {
    a.classList.add('active')
    a.setAttribute('aria-current', 'page')
  })
})
// ----------------------------------------------------------------------------

const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})
