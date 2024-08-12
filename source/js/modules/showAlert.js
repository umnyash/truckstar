function showAlert({ heading, status, mode, text, buttonText }) {
  const alert = new Alert({ heading, status, mode, text, buttonText });
  alert.open();
}
