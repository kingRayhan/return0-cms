const openUploadModal = () => {
  window.cloudinary
    .openUploadWidget(
      { cloud_name: "azkeroffer", upload_preset: "course-assets" },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("Done uploading..: ", result.info);
        }
      }
    )
    .open();
};

export { openUploadModal };
