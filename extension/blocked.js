/**
 * SafeKids AI - Warning Screen Interaction Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);

  const rawReason = urlParams.get('reason');
  const rawExplanation = urlParams.get('explanation');
  const rawOriginalUrl = urlParams.get('originalUrl');

  const threatCategoryEl = document.getElementById('threatCategory');
  const childExplanationEl = document.getElementById('childExplanation');
  const originalUrlEl = document.getElementById('originalUrl');
  const goBackBtn = document.getElementById('goBackBtn');
  const closeTabBtn = document.getElementById('closeTabBtn');

  // Populate dynamic safety information
  if (rawReason) {
    threatCategoryEl.textContent = decodeURIComponent(rawReason).toUpperCase();
  }

  if (rawExplanation) {
    childExplanationEl.textContent = decodeURIComponent(rawExplanation);
  } else {
    childExplanationEl.textContent =
      '🛡️ "Hold on! That link was flagged by our safety system as potentially unsafe. We blocked it so your account and privacy stay 100% protected!"';
  }

  if (rawOriginalUrl) {
    originalUrlEl.textContent = decodeURIComponent(rawOriginalUrl);
  } else {
    originalUrlEl.textContent = 'Flagged Web Address';
  }

  // Action: Return to Google or History back
  goBackBtn.addEventListener('click', () => {
    if (window.history.length > 2) {
      window.history.go(-2);
    } else {
      window.location.href = 'https://www.google.com';
    }
  });

  // Action: Close this tab
  closeTabBtn.addEventListener('click', () => {
    if (chrome.tabs && chrome.tabs.getCurrent) {
      chrome.tabs.getCurrent((tab) => {
        if (tab && tab.id) {
          chrome.tabs.remove(tab.id);
        } else {
          window.close();
        }
      });
    } else {
      window.close();
    }
  });
});
