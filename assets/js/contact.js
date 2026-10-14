/* Studio Akari — formulaire de demande de devis (page Formules & contact).
   - pré-remplissage depuis les liens des autres pages (?service=, ?formule=, ?secteur=)
   - choix d'une formule Signature depuis les cartes
   - validation, puis envoi vers le service configuré dans data-endpoint,
     ou ouverture de la messagerie du visiteur si aucun service n'est configuré. */
(function () {
  'use strict';

  var form = document.getElementById('devis-form');
  if (!form) return;
  form.noValidate = true;

  var FORMULES = {
    production: 'Signature Production',
    reportage: 'Signature Reportage',
    complete: 'Signature Production + Reportage'
  };
  var ERRORS = { nom: 'e-nom', email: 'e-email', telephone: 'e-tel', consentement: 'e-consent' };
  var PHONE = '06 86 75 14 38';

  var reduced = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var success = document.querySelector('[data-form-success]');
  var statusEl = form.querySelector('[data-form-status]');
  var pill = form.querySelector('[data-formule-pill]');
  var pillLabel = form.querySelector('[data-formule-label]');
  var signature = form.querySelector('input[data-key="signature"]');
  var callOnly = form.querySelector('[data-call-only]');
  var phoneLabel = form.querySelector('[data-phone-label]');
  var submitBtn = form.querySelector('[type="submit"]');
  var submitHTML = submitBtn.innerHTML;

  function val(name) { return (form.elements[name].value || '').trim(); }
  function checked(name) {
    return Array.prototype.filter.call(form.querySelectorAll('input[name="' + name + '"]'), function (i) { return i.checked; });
  }
  function isCall() {
    var r = checked('contact')[0];
    return !r || r.getAttribute('data-mode') !== 'email';
  }

  /* ---------- Mode de contact ---------- */

  function applyMode() {
    var call = isCall();
    callOnly.hidden = !call;
    callOnly.disabled = !call; // le créneau n'est pas envoyé si on répond par email
    phoneLabel.textContent = call ? 'Téléphone *' : 'Téléphone';
    if (!call) setError('telephone', '');
  }
  form.querySelectorAll('input[name="contact"]').forEach(function (r) { r.addEventListener('change', applyMode); });

  /* ---------- « Vous êtes » : un second clic désélectionne ---------- */

  var profils = form.querySelectorAll('[data-deselectable] input[type="radio"]');
  function syncProfils() { profils.forEach(function (r) { r.setAttribute('data-was', r.checked ? '1' : ''); }); }
  profils.forEach(function (r) {
    r.addEventListener('click', function () {
      if (r.getAttribute('data-was') === '1') r.checked = false;
      syncProfils();
    });
  });

  /* ---------- Formule Signature ---------- */

  function setFormule(key) {
    var label = FORMULES[key] || '';
    form.elements.formule.value = label;
    pillLabel.textContent = label;
    pill.hidden = !label;
    if (label) signature.checked = true;
  }
  signature.addEventListener('change', function () { if (!signature.checked) setFormule(null); });
  form.querySelector('[data-clear-formule]').addEventListener('click', function () {
    setFormule(null);
    signature.checked = false;
  });

  document.querySelectorAll('[data-formule]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      setFormule(link.getAttribute('data-formule'));
      document.getElementById('contact').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    });
  });

  /* ---------- Pré-remplissage depuis l'adresse ---------- */

  function readQuery() {
    var q;
    try { q = new URLSearchParams(window.location.search); } catch (e) { return; }
    var service = form.querySelector('input[name="prestations"][data-key="' + q.get('service') + '"]');
    if (service) service.checked = true;
    if (FORMULES[q.get('formule')]) setFormule(q.get('formule'));
    var profil = form.querySelector('input[name="profil"][data-key="' + q.get('secteur') + '"]');
    if (profil) profil.checked = true;
  }

  /* ---------- Validation ---------- */

  function setError(name, msg) {
    var el = document.getElementById(ERRORS[name]);
    if (el) el.textContent = msg || '';
    var input = form.elements[name];
    if (input) {
      if (msg) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
    }
  }

  form.addEventListener('input', function (e) { if (ERRORS[e.target.name]) setError(e.target.name, ''); });
  form.addEventListener('change', function (e) { if (ERRORS[e.target.name]) setError(e.target.name, ''); });

  function validate() {
    var errors = {};
    if (!val('nom')) errors.nom = 'Indiquez votre nom.';
    if (!/^\S+@\S+\.\S+$/.test(val('email'))) errors.email = 'Adresse email invalide.';
    if (isCall() && val('telephone').replace(/\D/g, '').length < 10) errors.telephone = 'Un numéro est nécessaire pour vous rappeler.';
    if (!form.elements.consentement.checked) errors.consentement = 'Merci de cocher cette case pour envoyer votre demande.';
    Object.keys(ERRORS).forEach(function (k) { setError(k, errors[k]); });
    var first = Object.keys(ERRORS).filter(function (k) { return errors[k]; })[0];
    if (first) form.elements[first].focus();
    return !first;
  }

  /* ---------- Envoi ---------- */

  function summary() {
    var lines = [];
    function add(label, v) { if (v) lines.push(label + ' : ' + v); }
    add('Nom', val('nom'));
    add('Entreprise / agence', val('entreprise'));
    add('Email', val('email'));
    add('Téléphone', val('telephone'));
    add('Ville du projet', val('ville'));
    add('Profil', (checked('profil')[0] || {}).value);
    add('Prestations', checked('prestations').map(function (i) { return i.value; }).join(', '));
    add('Formule', form.elements.formule.value);
    add('Contact souhaité', isCall() ? 'Rappel téléphonique (' + checked('creneau')[0].value + ')' : 'Réponse par email');
    if (val('projet')) lines.push('', 'Projet :', val('projet'));
    return lines.join('\n');
  }

  function openMail() {
    var subject = 'Demande de devis — ' + val('nom');
    window.location.href = 'mailto:' + form.getAttribute('data-mailto') +
      '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(summary());
  }

  function link(href, text) {
    var a = document.createElement('a');
    a.href = href;
    a.textContent = text;
    a.style.textDecoration = 'underline';
    return a;
  }

  function showSuccess(viaMail) {
    var first = val('nom').split(/\s+/)[0] || '';
    success.querySelector('[data-success-title]').textContent = first ? 'Merci ' + first + '.' : 'Merci.';

    var slot = checked('creneau')[0];
    var next = isCall()
      ? 'nous vous rappelons ' + (slot ? slot.getAttribute('data-phrase') : '') + ' au ' + val('telephone') + '.'
      : "nous vous répondons par email à l'adresse " + val('email') + '.';

    var text = success.querySelector('[data-success-text]');
    text.textContent = '';
    if (viaMail) {
      text.appendChild(document.createTextNode("Votre messagerie s'ouvre avec votre demande pré-remplie : il vous suffit de l'envoyer. Dès réception, " + next + ' Rien ne s\'est ouvert ? Écrivez-nous à '));
      text.appendChild(link('mailto:' + form.getAttribute('data-mailto'), form.getAttribute('data-mailto')));
      text.appendChild(document.createTextNode(' ou appelez le '));
      text.appendChild(link('tel:+33686751438', PHONE));
      text.appendChild(document.createTextNode('.'));
    } else {
      text.textContent = 'Votre demande a bien été transmise. ' + next.charAt(0).toUpperCase() + next.slice(1);
    }

    form.hidden = true;
    success.hidden = false;
    success.focus();
  }

  function showStatus() {
    statusEl.textContent = '';
    statusEl.appendChild(document.createTextNode("L'envoi n'a pas abouti. Réessayez dans un instant, ou contactez-nous au "));
    statusEl.appendChild(link('tel:+33686751438', PHONE));
    statusEl.appendChild(document.createTextNode(' ou à '));
    statusEl.appendChild(link('mailto:' + form.getAttribute('data-mailto'), form.getAttribute('data-mailto')));
    statusEl.appendChild(document.createTextNode('.'));
    statusEl.hidden = false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    statusEl.hidden = true;
    if (!validate()) return;

    // Champ piège rempli : envoi d'un robot, on l'ignore discrètement.
    if (form.elements._gotcha.value) { showSuccess(false); return; }

    var endpoint = (form.getAttribute('data-endpoint') || '').trim();
    if (!endpoint) { openMail(); showSuccess(true); return; }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours…';
    fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        showSuccess(false);
      })
      .catch(showStatus)
      .then(function () {
        submitBtn.disabled = false;
        submitBtn.innerHTML = submitHTML;
      });
  });

  success.querySelector('[data-form-reset]').addEventListener('click', function () {
    form.reset();
    setFormule(null);
    Object.keys(ERRORS).forEach(function (k) { setError(k, ''); });
    applyMode();
    syncProfils();
    success.hidden = true;
    form.hidden = false;
    form.elements.nom.focus();
  });

  readQuery();
  applyMode();
  syncProfils();
})();
