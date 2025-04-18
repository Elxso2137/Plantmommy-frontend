// Sprawdzamy, czy przeglądarka wspiera Service Worker i Push API
if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker i Push API wspierane!');
  navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
    console.log('Service Worker zarejestrowany!', registration);

    // Zapytanie o pozwolenie na powiadomienia push
    Notification.requestPermission().then(function(permission) {
      console.log('Permission dla powiadomień:', permission);
      if (permission === "granted") {
        console.log('Użytkownik zgodził się na powiadomienia push.');
        // Możemy teraz subskrybować użytkownika do powiadomień push
        subscribeUserToPush(registration);
      } else {
        console.log('Użytkownik odmówił powiadomienia push.');
      }
    });
  }).catch(function(error) {
    console.error('Błąd rejestracji Service Workera:', error);
  });
} else {
  console.log('Service Worker lub Push API nie jest wspierane przez tę przeglądarkę.');
}

function subscribeUserToPush(registration) {
  console.log('Próbujemy subskrybować użytkownika...');
  registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlB64ToUint8Array('BHq85usm7hqXXAfaQe3VVa-oXgVXe9VxElrlIAquTTVq3_whlRIrjthhRQSt7JKxT3ldRfmoNc4r1W81kAEoZmY')
  }).then(function(subscription) {
    console.log('Subskrypcja użytkownika:', subscription);
    sendSubscriptionToServer(subscription);
  }).catch(function(error) {
    console.error('Błąd subskrypcji push:', error);
  });
}

function sendSubscriptionToServer(subscription) {
  const userId = localStorage.getItem('user_id'); // zakładamy, że wcześniej zostało zapisane np. "1" lub "2"

  if (!userId) {
    console.error('Brak user_id w localStorage!');
    return;
  }

  const dataToSend = {
    subscription: subscription,
    user_id: userId
  };

  fetch('/save-subscription.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataToSend)
  }).then(function(response) {
    return response.json();
  }).then(function(data) {
    console.log('Subskrypcja zapisana w bazie danych', data);
  }).catch(function(error) {
    console.error('Błąd podczas zapisywania subskrypcji:', error);
  });
}

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
