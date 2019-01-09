const EcwidApp = window.EcwidApp;
// Initialize the application
EcwidApp.init({
  // app_id: "coupon-generator", // use your application namespace
  app_id: "multiple-coupons-dev", // for dev
  autoloadedflag: false,
  autoheight: true
});

setTimeout(() => {
  EcwidApp.ready();
}, 3000)

// EcwidApp.setSize({
//   height: 900
// });


const storeData = EcwidApp.getPayload();
export const storeId = storeData.store_id;
export const accessToken = storeData.access_token;