document.addEventListener("DOMContentLoaded", function () {
  const fileInput = document.getElementById("file-upload");
  const fileRemoveButton = document.querySelector(".contact-form-big__file-remove");
  const fileText = document.querySelector(".contact-form-big__file-text");

  // Изначально скрываем кнопку удаления файла
  fileRemoveButton.style.display = "none";

  fileInput.addEventListener("change", function () {
    if (fileInput.files.length > 0) {
      fileText.textContent = fileInput.files[0].name;
      fileRemoveButton.style.display = "inline-block";
    } else {
      fileText.textContent = "Прикрепить файл";
      fileRemoveButton.style.display = "none";
    }
  });

  fileRemoveButton.addEventListener("click", function () {
    fileInput.value = "";
    fileText.textContent = "Прикрепить файл";
    fileRemoveButton.style.display = "none";
  });
});
