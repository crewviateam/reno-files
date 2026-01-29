$(function () {
  const form = $("#reno-form");

  form.validate({
    errorPlacement: function errorPlacement(error, element) {
      error.insertAfter(element);
    },
    rules: {
      email: { required: true, email: true },
      name: { required: true },
      phone: { required: true },
    },
  });

  $("#reno-form").steps({
    headerTag: "h3",
    bodyTag: "section",
    // transitionEffect: "fade",
    autoFocus: true,

    onStepChanging: function (event, currentIndex, newIndex) {
      console.log("change2333");
      window.dispatchEvent(new Event("resize"));
      // window.fsAttributes = window.fsAttributes || [];
      // console.log("fs attributes", window.fsAttributes);
      // window.fsAttributes.push([
      //   "rangeslider",
      //   (instances) => {
      //     instances.forEach((instance) => instance.destroy());
      //   },
      // ]);

      // window.fsAttributes.push([
      //   "rangeslider",
      //   () => {
      //     console.log("fs rangeslider reinitialized");
      //   },
      // ]);

      // Always allow going back
      if (currentIndex > newIndex) return true;

      // Validate current step only
      form.validate().settings.ignore = ":disabled,:hidden";
      return form.valid();
    },

    onFinishing: function () {
      form.validate().settings.ignore = ":disabled";
      return form.valid();
    },

    onFinished: function () {
      form.submit(); // 🔥 THIS triggers Webflow submission
    },
  });
});

$(document).ready(function () {
  const input = document.querySelector("#country-phone");

  window.iti = window.intlTelInput(input, {
    initialCountry: "auto",
    geoIpLookup: function (callback) {
      $.get("https://ipinfo.io", function () {}, "jsonp").always(function (
        resp
      ) {
        callback(resp && resp.country ? resp.country : "us");
      });
    },
    separateDialCode: true,
    utilsScript:
      "https://cdn.jsdelivr.net/npm/intl-tel-input@18.5.2/build/js/utils.js",
  });
});

console.log("modal", MicroModal);
console.log("modal btn", $("[data-modal-open]"));

// $("[data-modal-open]").on("click", function () {
//   const modalId = $(this).attr("data-modal-open");
//   initMicroModal();
//   MicroModal.show(modalId);
// });

document.addEventListener("DOMContentLoaded", () => {
  // initMicroModal();
  console.log("modal update");
  $(document).on("click", "[data-modal-open]", function () {
    const modalId = $(this).attr("data-modal-open");
    MicroModal.show(modalId, {
      disableScroll: true,
    });
  });
});
