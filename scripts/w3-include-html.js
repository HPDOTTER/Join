/**
 * Includes HTML content into elements with the `w3-include-html` attribute.
 * 
 * This function searches the document for all elements with the `w3-include-html` attribute,
 * performs an HTTP request to fetch the HTML content specified in the attribute,
 * and inserts the content into the respective element. If the file is not found,
 * it displays "Page not found." in the element.
 * 
 * The function removes the `w3-include-html` attribute from the processed element
 * and recursively calls itself until all elements are processed.
 */
function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
      elmnt = z[i];
      /* Search for elements with a certain attribute: */
      file = elmnt.getAttribute("w3-include-html");
      if (file) {
          /* Make an HTTP request using the attribute value as the file name: */
          xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
              if (this.readyState == 4) {
                  if (this.status == 200) {
                      elmnt.innerHTML = this.responseText;
                  }
                  if (this.status == 404) {
                      elmnt.innerHTML = "Page not found.";
                  }
                  /* Remove the attribute, and call this function once more: */
                  elmnt.removeAttribute("w3-include-html");
                  includeHTML();
              }
          };
          xhttp.open("GET", file, true);
          xhttp.send();
          /* Exit the function: */
          return;
      }
  }
}
