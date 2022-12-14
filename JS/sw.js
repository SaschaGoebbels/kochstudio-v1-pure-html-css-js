

// // // // //serviceworker 
// // // // // TODO: Add the registerWorker function here
// // // // const registerWorker = async () => {
// // // //     try {
// // // //      // Define the serviceworker and an optional options object.
// // // //      const worker = navigator.serviceWorker;
// // // //      const options = { scope: './' };
   
// // // //      // Register the worker and save the registeration in a variable. 
// // // //      const swRegisteration = await worker.register('serviceworker.js', options);
   
// // // //      // We will make use of this event later on to display if a worker is registered
// // // //      window.dispatchEvent(new Event('sw-toggle'));
// // // //             ;
// // // //      // Return the registeration object to the calling function
// // // //      return swRegisteration;
// // // //     } catch (e) {
// // // //      console.error(e);
// // // //     }
// // // //    };
// // // // /////////////////////////////////
// // // // // TODO: Add the unregisterWorker function here
// // // // const unregisterWorker = async () => {
// // // //     try {
// // // //      // Define the serviceworker
// // // //      const worker = navigator.serviceWorker;
   
// // // //      // Try to get a sw-registration
// // // //      const swRegisteration = await worker.getRegistration();
   
// // // //      // If there is one, call its unregister function
// // // //      if (swRegisteration) {
// // // //       swRegisteration.unregister();
// // // //       window.dispatchEvent(new Event('sw-toggle'));
   
// // // //       // If there's none, give a hint in the console
// // // //      } else {
// // // //       console.info('No active workers found');
// // // //      }
// // // //     } catch (e) {
// // // //      console.error(e);
// // // //     }
// // // //    };   
// // // // /////////////////////////////////
// // // //    // TODO: Add checkWorkerActive function here
// // // // const checkWorkerActive = async () => {
// // // //     // Get registration object 
// // // //     const swRegisteration = await navigator.serviceWorker.getRegistration();
   
// // // //     // Query for the indicator DOM element and remove its classes
// // // //     const indicator = dqs('#worker-indicator');
// // // //     indicator.classList.remove('bg-danger', 'bg-success');
   
// // // //     // Change its content according to whether there's a registered worker or not
// // // //     if (swRegisteration && swRegisteration !== undefined) {
// // // //      indicator.innerText = 'You have an active service worker';
// // // //      indicator.classList.add('bg-success');
// // // //     } else {
// // // //      indicator.innerText = 'Service worker is not active';
// // // //      indicator.classList.add('bg-danger');
// // // //     }
// // // //    };
// // // // /////////////////////////////////
// // // // // TODO: Add the sw-toggle - event listener here
// // // // window.addEventListener('sw-toggle', () => {
// // // //     checkWorkerActive();
// // // //   });
// // // // ////////////////////////////////////////////////////////////////////////////////
// // // // // // check worker is registerted
// // // // // const swRegisteration = await worker.getRegistration()
// // // // ////////////////////////////////////////////////////////////////////////////////
