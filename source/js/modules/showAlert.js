function showAlert({ heading, status, text, buttonText }) {
  const alert = new Alert({ heading, status, text, buttonText });
  alert.open();
}
