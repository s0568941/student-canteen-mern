const publicVapidKey =
  'BKu4lEtQy3fVJb0NXNgBGcREhPfjqwVtp33aB8Onx9cROnLsGXv6eLz7rigaKxbgVlk6PYd5-Ukqpf5EKTUcuTo';
// IndexedDB
const dbName = 'notifications';
const dbVersion = 1;
const objectStoreName = 'normalPush';
let db;

// create indexedDB
async function createIDBandServiceWorker() {
  const request = window.indexedDB.open(dbName, dbVersion);

  request.onerror = event => {
    alert(
      'Bitte geben Sie die Datenbank frei, um ihre Daten lokal speichern zu können.'
    );
  };

  request.onupgradeneeded = event => {
    db = request.result;

    const notifications = db.createObjectStore(objectStoreName, {
      keyPath: 'enabled',
    });
  };

  request.onsuccess = event => {
    db = request.result;
    getNotificationsPref()
      .then(res => {
        if (res.length === 2) {
          // normal push and morning push is in array
          if (
            res[0].enabled === 0 ||
            (res[1].enabled === 0 && res[0].enabled === 4) ||
            res[1].enabled === 4
          ) {
            // only morning notifications are enabled
            // Activate SW with morning notifications
            const normalNotification = false;
            registerWorkerAndPushNotif(normalNotification).catch(err =>
              console.log('Error while registering ', err)
            );
          }
        } else {
          if (res[0].enabled === 0 || res[0].enabled === -1) {
            if (res[0].enabled === -1) {
              // new user will get notifications initialized as false
              addNotification(0);
            }
            // ACtivate normal SW, if push not enabled
            navigator.serviceWorker
              .register('./sw.js')
              .then(reg => console.log('Service worker registered'))
              .catch(err =>
                console.log('Service worker registration error: ', err)
              );
          } else if (res[0].enabled === 1) {
            // Push enabled
            // Activate Push Notif SW
            registerWorkerAndPushNotif().catch(err =>
              console.log('Error while registering ', err)
            );
          }
        }
      })
      .catch(err => {
        console.log('Error: ', err);
        addNotification(0);
        navigator.serviceWorker
          .register('./sw.js')
          .then(reg => console.log('Service worker registered'))
          .catch(err =>
            console.log('Service worker registration error: ', err)
          );
      });
  };
}

async function getNotificationsPref() {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(objectStoreName, 'readonly');
    const notifications = tx.objectStore(objectStoreName);
    const request = notifications.getAll();
    request.onerror = event => {
      reject(-1);
    };
    request.onsuccess = event => {
      const resValue = request.result === undefined ? -1 : request.result;
      resolve(resValue);
    };
  });
}

async function clearDB() {
  const request = window.indexedDB.open(dbName, dbVersion);
  request.onsuccess = event => {
    db = request.result;
    const tx = db.transaction(objectStoreName, 'readwrite');
    tx.onerror = event => {
      console.log('Error while clearing data: ', event);
    };

    const objStore = tx.objectStore(objectStoreName);

    // Make a request to clear all the data out of the object store
    var objectStoreRequest = objStore.clear();

    objectStoreRequest.onsuccess = function (event) {
      // report the success of our request
      console.log('Cleared data ', event);
    };
  };
}

async function addNotification(enabled) {
  const tx = db.transaction(objectStoreName, 'readwrite');
  const notifications = tx.objectStore(objectStoreName);
  notifications.add({ enabled: enabled });
}

if ('serviceWorker' in navigator) {
  if (window.indexedDB) {
    createIDBandServiceWorker();
  } else {
    // ACtivate normal SW
    navigator.serviceWorker
      .register('./sw.js')
      .then(reg => console.log('Service worker registered'))
      .catch(err => console.log('Service worker registration error: ', err));
  }
}

// source code for function from https://github.com/web-push-libs/web-push/issues/558
function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  var base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * when page loads:
 * send request to check if push is enabled and call register
 */
async function registerWorkerAndPushNotif(normalNotif) {
  const register = await navigator.serviceWorker.register('./sw.js');

  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  });

  // Send Push Notification
  normalNotif = normalNotif === undefined ? true : normalNotif;
  const subscribeRoute = normalNotif ? '/subscribe' : '/subscribeMorning';
  await fetch(subscribeRoute, {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'content-type': 'application/json',
    },
  });
}
